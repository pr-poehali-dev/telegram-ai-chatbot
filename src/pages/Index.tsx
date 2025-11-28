import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Dialog {
  id: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
  hasContext: boolean;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [botName, setBotName] = useState('Мой AI Бот');
  const [greeting, setGreeting] = useState('Привет! Я AI-ассистент, готов помочь.');
  const [contextEnabled, setContextEnabled] = useState(true);

  const mockDialogs: Dialog[] = [
    {
      id: '1',
      userName: 'Анна Смирнова',
      lastMessage: 'Спасибо за помощь с документами!',
      timestamp: '10 минут назад',
      messageCount: 12,
      hasContext: true,
    },
    {
      id: '2',
      userName: 'Дмитрий Иванов',
      lastMessage: 'Как настроить интеграцию?',
      timestamp: '1 час назад',
      messageCount: 5,
      hasContext: true,
    },
    {
      id: '3',
      userName: 'Елена Петрова',
      lastMessage: 'Отлично работает, спасибо!',
      timestamp: '3 часа назад',
      messageCount: 8,
      hasContext: false,
    },
    {
      id: '4',
      userName: 'Михаил Козлов',
      lastMessage: 'Подскажите по API',
      timestamp: 'Вчера',
      messageCount: 15,
      hasContext: true,
    },
  ];

  const filteredDialogs = mockDialogs.filter(
    (dialog) =>
      dialog.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dialog.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Icon name="Bot" size={28} className="text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">AI Bot Manager</h1>
          </div>
          <p className="text-muted-foreground ml-15">
            Управляй своим Telegram ботом и анализируй диалоги
          </p>
        </div>

        <Tabs defaultValue="dialogs" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-card rounded-2xl p-1">
            <TabsTrigger
              value="dialogs"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon name="MessageSquare" size={18} className="mr-2" />
              История диалогов
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dialogs" className="space-y-4 animate-scale-in">
            <Card className="p-6 rounded-3xl border-2 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">История диалогов</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Всего диалогов: {mockDialogs.length}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-sm px-4 py-2 rounded-full bg-primary/10 text-primary"
                >
                  <Icon name="TrendingUp" size={16} className="mr-1" />
                  +12% за неделю
                </Badge>
              </div>

              <div className="relative mb-6">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Поиск по имени или сообщению..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-2xl border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-3">
                {filteredDialogs.map((dialog, index) => (
                  <Card
                    key={dialog.id}
                    className="p-5 rounded-2xl border-2 hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer group"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon name="User" size={24} className="text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {dialog.userName}
                            </h3>
                            {dialog.hasContext && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5 rounded-full border-primary/50 text-primary"
                              >
                                <Icon name="Link" size={12} className="mr-1" />
                                Контекст
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                            {dialog.lastMessage}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Icon name="Clock" size={14} />
                              {dialog.timestamp}
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="MessageCircle" size={14} />
                              {dialog.messageCount} сообщений
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="ChevronRight" size={20} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 rounded-3xl border-2 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Всего пользователей
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">247</p>
              </Card>

              <Card className="p-6 rounded-3xl border-2 bg-gradient-to-br from-accent/20 to-accent/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent-foreground/80 rounded-xl flex items-center justify-center">
                    <Icon name="MessageSquare" size={20} className="text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Сообщений сегодня
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">1,234</p>
              </Card>

              <Card className="p-6 rounded-3xl border-2 bg-gradient-to-br from-secondary to-secondary/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Icon name="Zap" size={20} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Активных диалогов
                  </h3>
                </div>
                <p className="text-3xl font-bold text-foreground">42</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 animate-scale-in">
            <Card className="p-6 rounded-3xl border-2 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <Icon name="Settings" size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Настройки бота</h2>
                  <p className="text-sm text-muted-foreground">
                    Настрой поведение и параметры бота
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="botName" className="text-base font-medium">
                    Имя бота
                  </Label>
                  <Input
                    id="botName"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="h-12 rounded-2xl border-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Это имя будет отображаться в Telegram
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greeting" className="text-base font-medium">
                    Приветственное сообщение
                  </Label>
                  <Input
                    id="greeting"
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    className="h-12 rounded-2xl border-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Первое сообщение, которое увидит пользователь
                  </p>
                </div>

                <div className="pt-4 border-t-2">
                  <h3 className="text-lg font-semibold mb-4">Умные функции</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon name="Link" size={20} className="text-primary-foreground" />
                        </div>
                        <div>
                          <Label htmlFor="context" className="text-base font-medium cursor-pointer">
                            Сохранение контекста
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Бот запоминает предыдущие сообщения для связных ответов
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="context"
                        checked={contextEnabled}
                        onCheckedChange={setContextEnabled}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-accent-foreground/80 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon name="Sparkles" size={20} className="text-white" />
                        </div>
                        <div>
                          <Label htmlFor="smart" className="text-base font-medium cursor-pointer">
                            Умные предложения
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            AI предлагает варианты ответов
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="smart"
                        defaultChecked
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon name="Shield" size={20} className="text-primary-foreground" />
                        </div>
                        <div>
                          <Label
                            htmlFor="moderation"
                            className="text-base font-medium cursor-pointer"
                          >
                            Модерация контента
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Автоматическая фильтрация неуместных сообщений
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="moderation"
                        defaultChecked
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base">
                    <Icon name="Save" size={20} className="mr-2" />
                    Сохранить настройки
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-2 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="Info" size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Подсказка</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Сохранение контекста позволяет боту помнить предыдущие сообщения в диалоге, что
                    делает разговор более естественным и связным. Контекст хранится до 24 часов.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
