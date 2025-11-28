'''
Business: Telegram bot webhook для обработки сообщений с интеграцией ChatGPT и сохранением контекста диалогов
Args: event - dict с httpMethod, body содержащим Telegram update
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с statusCode, headers, body
'''

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
DATABASE_URL = os.environ.get('DATABASE_URL')

def send_telegram_message(chat_id: int, text: str) -> None:
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    requests.post(url, json={'chat_id': chat_id, 'text': text})

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def get_or_create_user(conn, telegram_id: int, username: Optional[str], first_name: Optional[str], last_name: Optional[str]) -> None:
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO users (telegram_id, username, first_name, last_name) VALUES (%s, %s, %s, %s) ON CONFLICT (telegram_id) DO UPDATE SET username = EXCLUDED.username, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, updated_at = CURRENT_TIMESTAMP",
            (telegram_id, username, first_name, last_name)
        )
        conn.commit()

def save_message(conn, telegram_id: int, role: str, content: str) -> None:
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO messages (telegram_id, role, content) VALUES (%s, %s, %s)",
            (telegram_id, role, content)
        )
        conn.commit()

def get_context_messages(conn, telegram_id: int, limit: int = 10) -> List[Dict[str, str]]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT role, content FROM messages WHERE telegram_id = %s ORDER BY created_at DESC LIMIT %s",
            (telegram_id, limit)
        )
        messages = cur.fetchall()
        return [{'role': msg['role'], 'content': msg['content']} for msg in reversed(messages)]

def get_bot_settings(conn, telegram_id: int) -> Dict[str, Any]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT * FROM bot_settings WHERE telegram_id = %s",
            (telegram_id,)
        )
        settings = cur.fetchone()
        if not settings:
            cur.execute(
                "INSERT INTO bot_settings (telegram_id) VALUES (%s) RETURNING *",
                (telegram_id,)
            )
            conn.commit()
            settings = cur.fetchone()
        return dict(settings)

def call_openai(messages: List[Dict[str, str]]) -> str:
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': 'gpt-4',
        'messages': messages,
        'temperature': 0.7
    }
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    result = response.json()
    return result['choices'][0]['message']['content']

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    if 'message' not in body_data:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True})
        }
    
    message = body_data['message']
    chat_id = message['chat']['id']
    user_text = message.get('text', '')
    
    if not user_text:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True})
        }
    
    username = message['from'].get('username')
    first_name = message['from'].get('first_name')
    last_name = message['from'].get('last_name')
    
    conn = get_db_connection()
    
    get_or_create_user(conn, chat_id, username, first_name, last_name)
    
    settings = get_bot_settings(conn, chat_id)
    
    if user_text == '/start':
        send_telegram_message(chat_id, settings['greeting_message'])
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True})
        }
    
    save_message(conn, chat_id, 'user', user_text)
    
    context_messages = []
    if settings['context_enabled']:
        context_messages = get_context_messages(conn, chat_id, settings['max_context_messages'])
    else:
        context_messages = [{'role': 'user', 'content': user_text}]
    
    system_prompt = {'role': 'system', 'content': f"Ты - {settings['bot_name']}. Отвечай дружелюбно и полезно на русском языке."}
    full_messages = [system_prompt] + context_messages
    
    ai_response = call_openai(full_messages)
    
    save_message(conn, chat_id, 'assistant', ai_response)
    
    send_telegram_message(chat_id, ai_response)
    
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
