import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('tournaments');

  const tournaments = [
    {
      id: 1,
      name: 'Кибер Лига 2024',
      status: 'Активен',
      prize: '500,000 ₽',
      teams: 16,
      date: '25.10.2024',
    },
    {
      id: 2,
      name: 'Осенний Кубок',
      status: 'Регистрация',
      prize: '250,000 ₽',
      teams: 8,
      date: '01.11.2024',
    },
  ];

  const teams = [
    { id: 1, name: 'Cyber Warriors', rank: 1, wins: 24, losses: 3 },
    { id: 2, name: 'Digital Hunters', rank: 2, wins: 22, losses: 5 },
    { id: 3, name: 'Neon Squad', rank: 3, wins: 20, losses: 7 },
    { id: 4, name: 'Pixel Destroyers', rank: 4, wins: 18, losses: 9 },
  ];

  const streams = [
    {
      id: 1,
      title: 'Финал Кибер Лиги',
      viewers: '12.5K',
      status: 'LIVE',
      game: 'CS2',
    },
    {
      id: 2,
      title: 'Полуфинал - День 2',
      viewers: '8.2K',
      status: 'LIVE',
      game: 'Dota 2',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-grid">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
          
          <header className="relative z-10 border-b border-primary/20">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center neon-border border border-primary">
                    <Icon name="Swords" className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-primary neon-glow">CYBER ARENA</h1>
                </div>
                <nav className="hidden md:flex space-x-6">
                  <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                    Главная
                  </Button>
                  <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                    Турниры
                  </Button>
                  <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                    Команды
                  </Button>
                  <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                    Трансляции
                  </Button>
                </nav>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
                  <Icon name="LogIn" className="w-4 h-4 mr-2" />
                  Войти
                </Button>
              </div>
            </div>
          </header>

          <section className="relative z-10 py-20 md:py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <Badge className="bg-primary/20 text-primary border border-primary/50 mb-4 animate-glow-pulse">
                  <Icon name="Zap" className="w-3 h-3 mr-1" />
                  Турнир 5 на 5
                </Badge>
                <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="text-primary neon-glow">КИБЕРСПОРТИВНАЯ</span>
                  <br />
                  <span className="text-foreground">АРЕНА</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Присоединяйся к легендарным турнирам, собери команду и докажи свое превосходство на киберспортивной арене
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-border border border-primary text-lg">
                    <Icon name="Trophy" className="w-5 h-5 mr-2" />
                    Зарегистрировать команду
                  </Button>
                  <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 text-lg">
                    <Icon name="Play" className="w-5 h-5 mr-2" />
                    Смотреть трансляции
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-card/50 border border-border">
                <TabsTrigger value="tournaments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Trophy" className="w-4 h-4 mr-2" />
                  Турниры
                </TabsTrigger>
                <TabsTrigger value="teams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Users" className="w-4 h-4 mr-2" />
                  Команды
                </TabsTrigger>
                <TabsTrigger value="streams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Radio" className="w-4 h-4 mr-2" />
                  Трансляции
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                  Регистрация
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tournaments" className="mt-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {tournaments.map((tournament) => (
                    <Card key={tournament.id} className="bg-card/50 border-border hover:border-primary/50 transition-all group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                              {tournament.name}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground mt-2">
                              <Icon name="Calendar" className="w-4 h-4 inline mr-1" />
                              {tournament.date}
                            </CardDescription>
                          </div>
                          <Badge className={tournament.status === 'Активен' ? 'bg-accent/20 text-accent border border-accent/50' : 'bg-secondary/20 text-secondary border border-secondary/50'}>
                            {tournament.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Icon name="Award" className="w-5 h-5 text-primary" />
                            <span className="text-lg font-semibold text-primary">{tournament.prize}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Icon name="Users" className="w-4 h-4" />
                            <span>{tournament.teams} команд</span>
                          </div>
                        </div>
                        <Button className="w-full bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground">
                          Подробнее
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="teams" className="mt-8">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">Рейтинг команд</CardTitle>
                    <CardDescription>Топ команды текущего сезона</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
                              <span className="text-xl font-bold text-primary">#{team.rank}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{team.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {team.wins}W - {team.losses}L
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                            <Icon name="Eye" className="w-4 h-4 mr-2" />
                            Профиль
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="streams" className="mt-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {streams.map((stream) => (
                    <Card key={stream.id} className="bg-card/50 border-border hover:border-accent/50 transition-all overflow-hidden group">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon name="Play" className="w-20 h-20 text-primary/50 group-hover:text-primary/80 transition-colors" />
                        </div>
                        <Badge className="absolute top-4 left-4 bg-accent text-white border-0 animate-glow-pulse">
                          <Icon name="Radio" className="w-3 h-3 mr-1" />
                          {stream.status}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{stream.title}</CardTitle>
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline" className="border-secondary text-secondary">
                            {stream.game}
                          </Badge>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Icon name="Eye" className="w-4 h-4" />
                            <span className="text-sm font-semibold">{stream.viewers}</span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="register" className="mt-8">
                <Card className="max-w-2xl mx-auto bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">Регистрация команды</CardTitle>
                    <CardDescription>Заполните форму для участия в турнире</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="teamName">Название команды</Label>
                      <Input
                        id="teamName"
                        placeholder="Введите название команды"
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="captain">Капитан команды</Label>
                      <Input
                        id="captain"
                        placeholder="Ваш никнейм"
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="team@example.com"
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="players">Состав команды</Label>
                      <Input
                        id="players"
                        placeholder="5 игроков через запятую"
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-border border border-primary">
                      <Icon name="Send" className="w-4 h-4 mr-2" />
                      Отправить заявку
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <footer className="border-t border-primary/20 py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/50">
                  <Icon name="Swords" className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-primary">CYBER ARENA</span>
              </div>
              <div className="flex space-x-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">О нас</a>
                <a href="#" className="hover:text-primary transition-colors">Правила</a>
                <a href="#" className="hover:text-primary transition-colors">Контакты</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
