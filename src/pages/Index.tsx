import { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoginDialog } from '@/components/LoginDialog';
import AdminPanel from '@/components/AdminPanel';
import TeamEditDialog from '@/components/TeamEditDialog';
import { TournamentHeader } from '@/components/TournamentHeader';
import { MobileNavigation } from '@/components/MobileNavigation';
import { TeamsList } from '@/components/TeamsList';
import { PlayersList } from '@/components/PlayersList';
import { RegistrationForms } from '@/components/RegistrationForms';
import SuperAdminPanel from '@/components/SuperAdminPanel';
import TeamManagementDialog from '@/components/TeamManagementDialog';
import Icon from '@/components/ui/icon';

const BACKEND_URLS = {
  auth: 'https://functions.poehali.dev/87a1a191-aacc-478d-8869-478b7969f36c',
  userAuth: 'https://functions.poehali.dev/6593734f-22cc-4ee2-b697-635b5817a9bd',
  teams: 'https://functions.poehali.dev/35199dac-d68a-4536-959b-4aad2fb7e7ad',
  settings: 'https://functions.poehali.dev/9f1de6c4-8e50-4131-b3c0-0253597bdbdf',
  register: 'https://functions.poehali.dev/aa5c695c-a493-4e80-8b18-578f26f15470'
};

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('register');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSuperAdminPanel, setShowSuperAdminPanel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [teamId, setTeamId] = useState<number | null>(null);
  const [showTeamEditDialog, setShowTeamEditDialog] = useState(false);
  const [showTeamManagementDialog, setShowTeamManagementDialog] = useState(false);
  const [approvedTeams, setApprovedTeams] = useState<any[]>([]);
  const [pendingTeams, setPendingTeams] = useState<any[]>([]);
  const [pendingPlayers, setPendingPlayers] = useState<any[]>([]);
  const [individualPlayers, setIndividualPlayers] = useState<any[]>([]);
  const [registrationOpen, setRegistrationOpen] = useState(true);
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
    preferredRoles: [] as string[],
    hasFriends: false,
    friend1Nickname: '',
    friend1Telegram: '',
    friend1Roles: [] as string[],
    friend2Nickname: '',
    friend2Telegram: '',
    friend2Roles: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    loadApprovedTeams();
    loadIndividualPlayers();
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

  const loadIndividualPlayers = async () => {
    try {
      const response = await fetch(`${BACKEND_URLS.teams}?type=individual`);
      const data = await response.json();
      const approved = (data.players || []).filter((p: any) => p.status === 'approved');
      const pending = (data.players || []).filter((p: any) => p.status === 'pending');
      setIndividualPlayers(approved);
      setPendingPlayers(pending);
    } catch (error) {
      console.error('Error loading individual players:', error);
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
        setIsSuperAdmin(adminData.username === 'Xuna');
        setSessionToken(adminData.token);
        setUsername(adminData.username);
        setUserRole(adminData.role);
        setShowLoginDialog(false);
        if (adminData.username === 'Xuna') {
          setShowSuperAdminPanel(true);
        } else {
          setShowAdminPanel(true);
        }
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
          setShowTeamEditDialog(true);
          toast({ 
            title: 'Вход выполнен', 
            description: `Добро пожаловать, ${userData.captainNick}! Команда: ${userData.teamName}` 
          });
        } else {
          setUsername(userData.nickname);
          setShowTeamManagementDialog(true);
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setUsername('');
    setUserRole('');
    setSessionToken('');
    setTeamId(null);
    toast({ title: 'Выход выполнен' });
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

  const handleApprovePlayer = async (playerId: number) => {
    try {
      await fetch(BACKEND_URLS.teams, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, status: 'approved' })
      });
      toast({ title: 'Игрок одобрен', description: 'Игрок добавлен в список свободных игроков' });
      loadIndividualPlayers();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось одобрить игрока', variant: 'destructive' });
    }
  };

  const handleRejectPlayer = async (playerId: number) => {
    try {
      await fetch(BACKEND_URLS.teams, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, status: 'rejected' })
      });
      toast({ title: 'Заявка отклонена', description: 'Игрок не будет допущен к турниру' });
      loadIndividualPlayers();
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
      const registerResponse = await fetch(BACKEND_URLS.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...teamForm, type: 'team' })
      });
      const registerData = await registerResponse.json();

      if (!registerData.success) {
        toast({ title: 'Ошибка', description: registerData.error || 'Не удалось сохранить регистрацию', variant: 'destructive' });
        return;
      }

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
        body: JSON.stringify({
          type: 'individual',
          nickname: individualForm.nickname,
          telegram: individualForm.telegram,
          preferredRoles: individualForm.preferredRoles,
          hasFriends: individualForm.hasFriends,
          friend1Nickname: individualForm.friend1Nickname,
          friend1Telegram: individualForm.friend1Telegram,
          friend1Roles: individualForm.friend1Roles,
          friend2Nickname: individualForm.friend2Nickname,
          friend2Telegram: individualForm.friend2Telegram,
          friend2Roles: individualForm.friend2Roles
        })
      });
      const data = await response.json();

      if (data.success) {
        toast({ title: 'Заявка отправлена!', description: 'Ваша заявка отправлена на модерацию администрации.' });
        setIndividualForm({
          nickname: '',
          telegram: '',
          preferredRoles: [],
          hasFriends: false,
          friend1Nickname: '',
          friend1Telegram: '',
          friend1Roles: [],
          friend2Nickname: '',
          friend2Telegram: '',
          friend2Roles: []
        });
        loadIndividualPlayers();
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
    <div className="min-h-screen go-board-pattern">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <TournamentHeader
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          userRole={userRole}
          username={username}
          teamId={teamId}
          setShowLoginDialog={setShowLoginDialog}
          setShowAdminPanel={setShowAdminPanel}
          setShowSuperAdminPanel={setShowSuperAdminPanel}
          setShowTeamEditDialog={setShowTeamEditDialog}
          setShowTeamManagementDialog={setShowTeamManagementDialog}
          onLogout={handleLogout}
        />

        <section className="py-8 relative z-10 pb-20 sm:pb-8">
          <div className="container mx-auto px-4">
            <MobileNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsContent value="register" className="mt-8">
                <RegistrationForms
                  teamForm={teamForm}
                  setTeamForm={setTeamForm}
                  individualForm={individualForm}
                  setIndividualForm={setIndividualForm}
                  registrationOpen={registrationOpen}
                  handleTeamRegistration={handleTeamRegistration}
                  handleIndividualRegistration={handleIndividualRegistration}
                  toggleRole={toggleRole}
                />
              </TabsContent>

              <TabsContent value="teams" className="mt-8">
                <TeamsList
                  approvedTeams={approvedTeams}
                  isLoggedIn={isLoggedIn}
                  registrationOpen={registrationOpen}
                  loadApprovedTeams={loadApprovedTeams}
                />
              </TabsContent>

              <TabsContent value="players" className="mt-8">
                <PlayersList
                  individualPlayers={individualPlayers}
                  registrationOpen={registrationOpen}
                  loadIndividualPlayers={loadIndividualPlayers}
                />
              </TabsContent>

              <TabsContent value="myteam" className="mt-8">
                <div className="max-w-2xl mx-auto text-center py-12">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon name="Settings" className="w-8 h-8 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Управление командой</h2>
                    <p className="text-muted-foreground mb-6">
                      Войдите с помощью названия команды и пароля, указанных при регистрации
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowTeamManagementDialog(true)}
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    <Icon name="LogIn" className="w-5 h-5 mr-2" />
                    Войти в управление командой
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />

      {isAdmin && (
        <AdminPanel
          open={showAdminPanel}
          onOpenChange={setShowAdminPanel}
          pendingTeams={pendingTeams}
          pendingPlayers={pendingPlayers}
          registrationOpen={registrationOpen}
          onApproveTeam={handleApproveTeam}
          onRejectTeam={handleRejectTeam}
          onApprovePlayer={handleApprovePlayer}
          onRejectPlayer={handleRejectPlayer}
          onToggleRegistration={handleToggleRegistration}
          userRole={userRole}
        />
      )}

      {isSuperAdmin && (
        <SuperAdminPanel
          open={showSuperAdminPanel}
          onOpenChange={setShowSuperAdminPanel}
          sessionToken={sessionToken}
          authUrl={BACKEND_URLS.auth}
        />
      )}

      {userRole === 'team_captain' && teamId && (
        <TeamEditDialog
          open={showTeamEditDialog}
          onOpenChange={setShowTeamEditDialog}
          teamId={teamId}
          sessionToken={sessionToken}
        />
      )}

      <TeamManagementDialog
        open={showTeamManagementDialog}
        onOpenChange={setShowTeamManagementDialog}
        backendUrl={BACKEND_URLS.teams}
      />
    </div>
  );
};

export default Index;