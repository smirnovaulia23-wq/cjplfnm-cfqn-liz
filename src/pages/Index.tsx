import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import LoginDialog from '@/components/LoginDialog';
import AdminPanel from '@/components/AdminPanel';
import TeamEditDialog from '@/components/TeamEditDialog';

const BACKEND_URLS = {
  auth: 'https://functions.poehali.dev/87a1a191-aacc-478d-8869-478b7969f36c',
  userAuth: 'https://functions.poehali.dev/6593734f-22cc-4ee2-b697-635b5817a9bd',
  teams: 'https://functions.poehali.dev/35199dac-d68a-4536-959b-4aad2fb7e7ad',
  settings: 'https://functions.poehali.dev/9f1de6c4-8e50-4131-b3c0-0253597bdbdf'
};

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('register');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [teamId, setTeamId] = useState<number | null>(null);
  const [showTeamEditDialog, setShowTeamEditDialog] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [approvedTeams, setApprovedTeams] = useState<any[]>([]);
  const [pendingTeams, setPendingTeams] = useState<any[]>([]);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [teamForm, setTeamForm] = useState({
    teamName: '',
    captainNick: '',
    captainTelegram: '',
    password: '',
    confirmPassword: '',
    topNick: '',
    topTelegram: '',
    jungleNick: '',
    jungleTelegram: '',
    midNick: '',
    midTelegram: '',
    adcNick: '',
    adcTelegram: '',
    supportNick: '',
    supportTelegram: '',
    sub1Nick: '',
    sub1Telegram: '',
    sub2Nick: '',
    sub2Telegram: ''
  });
  
  const [individualForm, setIndividualForm] = useState({
    nickname: '',
    telegram: '',
    preferredRoles: [] as string[]
  });
  const { toast } = useToast();

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

  useEffect(() => {
    loadApprovedTeams();
    loadSettings();
    if (isLoggedIn) {
      loadPendingTeams();
    }
  }, [isLoggedIn]);

  const loadApprovedTeams = async () => {
    try {
      const response = await fetch(`${BACKEND_URLS.teams}?status=approved`);
      const data = await response.json();
      setApprovedTeams(data.teams || []);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadPendingTeams = async () => {
    try {
      const response = await fetch(`${BACKEND_URLS.teams}?status=pending`);
      const data = await response.json();
      setPendingTeams(data.teams || []);
    } catch (error) {
      console.error('Error loading pending teams:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch(BACKEND_URLS.settings);
      const data = await response.json();
      setRegistrationOpen(data.settings?.registration_open === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleLogin = async (telegram: string, password: string) => {
    try {
      const adminResponse = await fetch(BACKEND_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: telegram, password })
      });
      const adminData = await adminResponse.json();

      if (adminData.success) {
        setIsLoggedIn(true);
        setIsAdmin(true);
        setUsername(adminData.username);
        setUserRole(adminData.role);
        setShowLoginDialog(false);
        setShowAdminPanel(true);
        toast({ title: 'Вход выполнен', description: `Добро пожаловать, ${adminData.username}!` });
        loadPendingTeams();
        return;
      }

      const userResponse = await fetch(BACKEND_URLS.userAuth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', telegram, password })
      });
      const userData = await userResponse.json();

      if (userData.success) {
        setIsLoggedIn(true);
        setIsAdmin(false);
        setSessionToken(userData.token);
        setUserRole(userData.userType);
        
        if (userData.userType === 'team_captain') {
          setUsername(userData.captainNick);
          setTeamId(userData.teamId);
          toast({ 
            title: 'Вход выполнен', 
            description: `Добро пожаловать, ${userData.captainNick}! Команда: ${userData.teamName}` 
          });
        } else {
          setUsername(userData.nickname);
          toast({ 
            title: 'Вход выполнен', 
            description: `Добро пожаловать, ${userData.nickname}!` 
          });
        }
        
        setShowLoginDialog(false);
      } else {
        toast({ title: 'Ошибка входа', description: userData.error || 'Неверный логин или пароль', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось выполнить вход', variant: 'destructive' });
    }
  };

  const handleToggleRegistration = async (open: boolean) => {
    try {
      await fetch(BACKEND_URLS.settings, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'registration_open', value: open ? 'true' : 'false' })
      });
      setRegistrationOpen(open);
      toast({ title: 'Настройки обновлены', description: `Регистрация ${open ? 'открыта' : 'закрыта'}` });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить настройки', variant: 'destructive' });
    }
  };

  const handleApproveTeam = async (teamId: number) => {
    try {
      await fetch(BACKEND_URLS.teams, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, status: 'approved' })
      });
      toast({ title: 'Команда одобрена', description: 'Команда добавлена в список участников' });
      loadPendingTeams();
      loadApprovedTeams();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось одобрить команду', variant: 'destructive' });
    }
  };

  const handleRejectTeam = async (teamId: number) => {
    try {
      await fetch(BACKEND_URLS.teams, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, status: 'rejected' })
      });
      toast({ title: 'Заявка отклонена', description: 'Команда не будет допущена к турниру' });
      loadPendingTeams();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось отклонить заявку', variant: 'destructive' });
    }
  };

  const handleTeamRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamForm.teamName || !teamForm.captainNick || !teamForm.captainTelegram ||
        !teamForm.password || !teamForm.confirmPassword ||
        !teamForm.topNick || !teamForm.topTelegram || !teamForm.jungleNick || !teamForm.jungleTelegram ||
        !teamForm.midNick || !teamForm.midTelegram || !teamForm.adcNick || !teamForm.adcTelegram ||
        !teamForm.supportNick || !teamForm.supportTelegram) {
      toast({ title: 'Заполните обязательные поля', description: 'Все поля отмеченные * обязательны', variant: 'destructive' });
      return;
    }

    if (teamForm.password !== teamForm.confirmPassword) {
      toast({ title: 'Ошибка', description: 'Пароли не совпадают', variant: 'destructive' });
      return;
    }

    if (teamForm.password.length < 6) {
      toast({ title: 'Ошибка', description: 'Пароль должен быть не менее 6 символов', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(BACKEND_URLS.teams, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      });
      const data = await response.json();

      if (data.success) {
        toast({ title: 'Заявка отправлена!', description: 'Ваша команда отправлена на одобрение администрации. Используйте свой Telegram для входа.' });
        setTeamForm({
          teamName: '',
          captainNick: '',
          captainTelegram: '',
          password: '',
          confirmPassword: '',
          topNick: '',
          topTelegram: '',
          jungleNick: '',
          jungleTelegram: '',
          midNick: '',
          midTelegram: '',
          adcNick: '',
          adcTelegram: '',
          supportNick: '',
          supportTelegram: '',
          sub1Nick: '',
          sub1Telegram: '',
          sub2Nick: '',
          sub2Telegram: ''
        });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось отправить заявку', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось отправить заявку', variant: 'destructive' });
    }
  };

  const handleIndividualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!individualForm.nickname || !individualForm.telegram) {
      toast({ title: 'Заполните обязательные поля', description: 'Ник и Telegram обязательны для заполнения', variant: 'destructive' });
      return;
    }

    if (individualForm.preferredRoles.length === 0) {
      toast({ title: 'Выберите роли', description: 'Выберите хотя бы одну предпочитаемую роль', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(BACKEND_URLS.teams, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...individualForm, type: 'individual' })
      });
      const data = await response.json();

      if (data.success) {
        toast({ title: 'Регистрация успешна!', description: 'Вы зарегистрированы как свободный игрок.' });
        setIndividualForm({
          nickname: '',
          telegram: '',
          preferredRoles: []
        });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось зарегистрироваться', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось отправить заявку', variant: 'destructive' });
    }
  };

  const toggleRole = (role: string) => {
    const roles = individualForm.preferredRoles;
    if (roles.includes(role)) {
      setIndividualForm({
        ...individualForm,
        preferredRoles: roles.filter(r => r !== role)
      });
    } else if (roles.length < 3) {
      setIndividualForm({
        ...individualForm,
        preferredRoles: [...roles, role]
      });
    } else {
      toast({ title: 'Максимум ролей', description: 'Можно выбрать не более 3 ролей', variant: 'destructive' });
    }
  };

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
                <div className="flex items-center gap-4">
                  <nav className="flex space-x-2">
                    <Button 
                      variant={selectedTab === 'register' ? 'default' : 'ghost'}
                      onClick={() => setSelectedTab('register')}
                      className={selectedTab === 'register' ? 'bg-secondary text-white hover:bg-secondary/90' : 'text-foreground hover:text-primary transition-colors'}
                    >
                      <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                      Регистрация
                    </Button>
                    <Button 
                      variant={selectedTab === 'teams' ? 'default' : 'ghost'}
                      onClick={() => setSelectedTab('teams')}
                      className={selectedTab === 'teams' ? 'bg-secondary text-white hover:bg-secondary/90' : 'text-foreground hover:text-primary transition-colors'}
                    >
                      <Icon name="Users" className="w-4 h-4 mr-2" />
                      Команды
                    </Button>
                  </nav>
                  {isLoggedIn ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {username}
                      </span>
                      {isAdmin && (
                        <Button
                          onClick={() => setShowAdminPanel(true)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
                        >
                          <Icon name="Settings" className="w-4 h-4 mr-2" />
                          Админ-панель
                        </Button>
                      )}
                      {userRole === 'team_captain' && teamId && (
                        <Button
                          onClick={() => setShowTeamEditDialog(true)}
                          className="bg-secondary text-white hover:bg-secondary/90"
                        >
                          <Icon name="Edit" className="w-4 h-4 mr-2" />
                          Моя команда
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsLoggedIn(false);
                          setIsAdmin(false);
                          setUsername('');
                          setUserRole('');
                          setSessionToken('');
                          setTeamId(null);
                          toast({ title: 'Выход выполнен' });
                        }}
                        className="border-primary/50 text-primary hover:bg-primary/10"
                      >
                        <Icon name="LogOut" className="w-4 h-4 mr-2" />
                        Выход
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowLoginDialog(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
                    >
                      <Icon name="LogIn" className="w-4 h-4 mr-2" />
                      Вход
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>
        </div>

        <section className="py-8 relative z-10">
          <div className="container mx-auto px-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">

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
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-foreground">Зарегистрированные команды</h2>
                    <Button 
                      variant="outline" 
                      className="border-primary/50 text-primary hover:bg-primary/10"
                      onClick={loadApprovedTeams}
                    >
                      <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
                      Обновить
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="relative">
                      <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по названию команды или капитану..."
                        className="pl-10 bg-card/50 border-border focus:border-primary h-12"
                      />
                    </div>
                  </div>

                  {approvedTeams.length === 0 ? (
                    <Card className="bg-card/50 border-border">
                      <CardContent className="p-6">
                        <div className="text-center py-16">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                            <Icon name="Inbox" className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Пока нет одобренных команд</h3>
                          <p className="text-muted-foreground">
                            Команды появятся здесь после одобрения администрацией
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {approvedTeams.map((team, index) => (
                        <Card key={team.id} className="bg-card/50 border-border hover:border-primary/50 transition-all">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
                                    <span className="text-xl font-bold text-primary">#{index + 1}</span>
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold text-foreground">{team.teamName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      Капитан: {team.captainNick}
                                      {(!registrationOpen || isLoggedIn) && (
                                        <span> • {team.captainTelegram}</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-primary/20 text-primary border border-primary/50">
                                    Одобрено
                                  </Badge>
                                  {!isLoggedIn && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-primary/50 text-primary hover:bg-primary/10"
                                      onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                                    >
                                      <Icon name={expandedTeam === team.id ? "ChevronUp" : "ChevronDown"} className="w-4 h-4 mr-1" />
                                      Подробнее
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {(expandedTeam === team.id || isLoggedIn) && (
                                <div className="pt-4 border-t border-border/50 space-y-3">
                                  <h4 className="font-semibold text-foreground mb-3">Состав команды:</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                                      <p className="text-xs text-muted-foreground mb-1">Топ</p>
                                      <p className="font-medium text-foreground">{team.topNick}</p>
                                      {(!registrationOpen || isLoggedIn) && (
                                        <p className="text-xs text-muted-foreground mt-1">{team.topTelegram}</p>
                                      )}
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                                      <p className="text-xs text-muted-foreground mb-1">Лес</p>
                                      <p className="font-medium text-foreground">{team.jungleNick}</p>
                                      {(!registrationOpen || isLoggedIn) && (
                                        <p className="text-xs text-muted-foreground mt-1">{team.jungleTelegram}</p>
                                      )}
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                                      <p className="text-xs text-muted-foreground mb-1">Мид</p>
                                      <p className="font-medium text-foreground">{team.midNick}</p>
                                      {(!registrationOpen || isLoggedIn) && (
                                        <p className="text-xs text-muted-foreground mt-1">{team.midTelegram}</p>
                                      )}
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                                      <p className="text-xs text-muted-foreground mb-1">АДК</p>
                                      <p className="font-medium text-foreground">{team.adcNick}</p>
                                      {(!registrationOpen || isLoggedIn) && (
                                        <p className="text-xs text-muted-foreground mt-1">{team.adcTelegram}</p>
                                      )}
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                                      <p className="text-xs text-muted-foreground mb-1">Саппорт</p>
                                      <p className="font-medium text-foreground">{team.supportNick}</p>
                                      {(!registrationOpen || isLoggedIn) && (
                                        <p className="text-xs text-muted-foreground mt-1">{team.supportTelegram}</p>
                                      )}
                                    </div>
                                    {team.sub1Nick && (
                                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Запасной 1</p>
                                        <p className="font-medium text-foreground">{team.sub1Nick}</p>
                                        {(!registrationOpen || isLoggedIn) && team.sub1Telegram && (
                                          <p className="text-xs text-muted-foreground mt-1">{team.sub1Telegram}</p>
                                        )}
                                      </div>
                                    )}
                                    {team.sub2Nick && (
                                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Запасной 2</p>
                                        <p className="font-medium text-foreground">{team.sub2Nick}</p>
                                        {(!registrationOpen || isLoggedIn) && team.sub2Telegram && (
                                          <p className="text-xs text-muted-foreground mt-1">{team.sub2Telegram}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
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
                <Tabs defaultValue="team" className="max-w-3xl mx-auto">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="team">Регистрация команды</TabsTrigger>
                    <TabsTrigger value="individual">Индивидуальная регистрация</TabsTrigger>
                  </TabsList>

                  <TabsContent value="team">
                    <form onSubmit={handleTeamRegistration}>
                      <Card className="bg-card/50 border-border">
                        <CardHeader className="border-b border-border/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-2xl text-primary">Регистрация команды</CardTitle>
                              <CardDescription className="mt-2">Заполните данные для участия в турнире</CardDescription>
                            </div>
                            <Badge className={registrationOpen ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-accent/20 text-accent border border-accent/50'}>
                              {registrationOpen ? 'Регистрация открыта' : 'Регистрация закрыта'}
                            </Badge>
                          </div>
                        </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-foreground">Название команды *</Label>
                        <Input
                          value={teamForm.teamName}
                          onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
                          placeholder="Введите название команды"
                          className="bg-background border-border focus:border-primary h-12"
                          required
                          disabled={!registrationOpen}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Ник капитана *</Label>
                          <Input
                            value={teamForm.captainNick}
                            onChange={(e) => setTeamForm({ ...teamForm, captainNick: e.target.value })}
                            placeholder="IvanGamer"
                            className="bg-background border-border focus:border-primary"
                            required
                            disabled={!registrationOpen}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Telegram капитана *</Label>
                          <Input
                            value={teamForm.captainTelegram}
                            onChange={(e) => setTeamForm({ ...teamForm, captainTelegram: e.target.value })}
                            placeholder="@username"
                            className="bg-background border-border focus:border-primary"
                            required
                            disabled={!registrationOpen}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-foreground">Пароль для входа</Label>
                        <p className="text-sm text-muted-foreground">Используйте Telegram капитана для входа</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Пароль *</Label>
                            <Input
                              type="password"
                              value={teamForm.password}
                              onChange={(e) => setTeamForm({ ...teamForm, password: e.target.value })}
                              placeholder="Минимум 6 символов"
                              className="bg-background border-border focus:border-primary"
                              required
                              disabled={!registrationOpen}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Подтвердите пароль *</Label>
                            <Input
                              type="password"
                              value={teamForm.confirmPassword}
                              onChange={(e) => setTeamForm({ ...teamForm, confirmPassword: e.target.value })}
                              placeholder="Повторите пароль"
                              className="bg-background border-border focus:border-primary"
                              required
                              disabled={!registrationOpen}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-foreground">Состав команды</Label>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Топ *</Label>
                            <Input value={teamForm.topNick} onChange={(e) => setTeamForm({ ...teamForm, topNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram топа *</Label>
                            <Input value={teamForm.topTelegram} onChange={(e) => setTeamForm({ ...teamForm, topTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Лес *</Label>
                            <Input value={teamForm.jungleNick} onChange={(e) => setTeamForm({ ...teamForm, jungleNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram леса *</Label>
                            <Input value={teamForm.jungleTelegram} onChange={(e) => setTeamForm({ ...teamForm, jungleTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Мид *</Label>
                            <Input value={teamForm.midNick} onChange={(e) => setTeamForm({ ...teamForm, midNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram мида *</Label>
                            <Input value={teamForm.midTelegram} onChange={(e) => setTeamForm({ ...teamForm, midTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">АДК *</Label>
                            <Input value={teamForm.adcNick} onChange={(e) => setTeamForm({ ...teamForm, adcNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram АДК *</Label>
                            <Input value={teamForm.adcTelegram} onChange={(e) => setTeamForm({ ...teamForm, adcTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Саппорт *</Label>
                            <Input value={teamForm.supportNick} onChange={(e) => setTeamForm({ ...teamForm, supportNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram саппорта *</Label>
                            <Input value={teamForm.supportTelegram} onChange={(e) => setTeamForm({ ...teamForm, supportTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Запасной 1</Label>
                            <Input value={teamForm.sub1Nick} onChange={(e) => setTeamForm({ ...teamForm, sub1Nick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram запасного 1</Label>
                            <Input value={teamForm.sub1Telegram} onChange={(e) => setTeamForm({ ...teamForm, sub1Telegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Запасной 2</Label>
                            <Input value={teamForm.sub2Nick} onChange={(e) => setTeamForm({ ...teamForm, sub2Nick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram запасного 2</Label>
                            <Input value={teamForm.sub2Telegram} onChange={(e) => setTeamForm({ ...teamForm, sub2Telegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-secondary to-accent text-white hover:opacity-90 h-12 text-lg font-semibold" disabled={!registrationOpen}>
                        <Icon name="Send" className="w-5 h-5 mr-2" />
                        Отправить заявку
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>

              <TabsContent value="individual">
                <form onSubmit={handleIndividualRegistration}>
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl text-primary">Индивидуальная регистрация</CardTitle>
                          <CardDescription className="mt-2">Зарегистрируйтесь как свободный игрок</CardDescription>
                        </div>
                        <Badge className={registrationOpen ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-accent/20 text-accent border border-accent/50'}>
                          {registrationOpen ? 'Регистрация открыта' : 'Регистрация закрыта'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-foreground">Основная информация</Label>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Игровой ник *</Label>
                            <Input
                              value={individualForm.nickname}
                              onChange={(e) => setIndividualForm({ ...individualForm, nickname: e.target.value })}
                              placeholder="Ваш игровой ник"
                              className="bg-background border-border focus:border-primary"
                              required
                              disabled={!registrationOpen}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Telegram *</Label>
                            <Input
                              value={individualForm.telegram}
                              onChange={(e) => setIndividualForm({ ...individualForm, telegram: e.target.value })}
                              placeholder="@username"
                              className="bg-background border-border focus:border-primary"
                              required
                              disabled={!registrationOpen}
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Предпочитаемые роли * (выберите от 1 до 3)
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Выбрано: {individualForm.preferredRoles.length}/3
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { value: 'any', label: 'Любая', icon: 'Sparkles' },
                              { value: 'top', label: 'Топ', icon: 'Shield' },
                              { value: 'jungle', label: 'Лес', icon: 'Trees' },
                              { value: 'mid', label: 'Мид', icon: 'Zap' },
                              { value: 'adc', label: 'АДК', icon: 'Target' },
                              { value: 'support', label: 'Саппорт', icon: 'Heart' }
                            ].map((role) => (
                              <Button
                                key={role.value}
                                type="button"
                                variant={individualForm.preferredRoles.includes(role.value) ? 'default' : 'outline'}
                                onClick={() => toggleRole(role.value)}
                                disabled={!registrationOpen}
                                className={
                                  individualForm.preferredRoles.includes(role.value)
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'border-border hover:bg-primary/10'
                                }
                              >
                                <Icon name={role.icon as any} className="w-4 h-4 mr-2" />
                                {role.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-secondary to-accent text-white hover:opacity-90 h-12 text-lg font-semibold" disabled={!registrationOpen}>
                        <Icon name="UserPlus" className="w-5 h-5 mr-2" />
                        Зарегистрироваться
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>
            </Tabs>
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

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />

      <AdminPanel
        open={showAdminPanel}
        onOpenChange={setShowAdminPanel}
        pendingTeams={pendingTeams}
        registrationOpen={registrationOpen}
        onToggleRegistration={handleToggleRegistration}
        onApproveTeam={handleApproveTeam}
        onRejectTeam={handleRejectTeam}
        userRole={userRole}
      />

      {teamId && (
        <TeamEditDialog
          open={showTeamEditDialog}
          onOpenChange={setShowTeamEditDialog}
          teamId={teamId}
          sessionToken={sessionToken}
          onSuccess={() => {
            loadApprovedTeams();
            toast({ title: 'Успешно', description: 'Данные команды обновлены' });
          }}
        />
      )}
    </div>
  );
};

export default Index;