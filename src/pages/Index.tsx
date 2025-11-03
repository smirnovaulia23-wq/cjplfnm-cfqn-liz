import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import TournamentBracket from '@/components/TournamentBracket';
import { ScheduleView } from '@/components/ScheduleView';
import { ScheduleAdminPanel } from '@/components/ScheduleAdminPanel';
import { HomePageEditor } from '@/components/HomePageEditor';
import { HomeTab } from '@/components/index/HomeTab';
import { useAuthentication } from '@/components/index/AuthenticationLogic';
import { useDataLoader } from '@/components/index/DataLoader';
import { useRegistrationHandler } from '@/components/index/RegistrationHandler';
import Icon from '@/components/ui/icon';

const BACKEND_URLS = {
  auth: 'https://functions.poehali.dev/87a1a191-aacc-478d-8869-478b7969f36c',
  userAuth: 'https://functions.poehali.dev/6593734f-22cc-4ee2-b697-635b5817a9bd',
  teams: 'https://functions.poehali.dev/35199dac-d68a-4536-959b-4aad2fb7e7ad',
  settings: 'https://functions.poehali.dev/9f1de6c4-8e50-4131-b3c0-0253597bdbdf',
  register: 'https://functions.poehali.dev/aa5c695c-a493-4e80-8b18-578f26f15470',
  schedule: 'https://functions.poehali.dev/90fb9334-17bb-4511-9ac9-ccd72a79c3aa'
};

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('home');
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
  const [showScheduleAdminPanel, setShowScheduleAdminPanel] = useState(false);
  const [showHomePageEditor, setShowHomePageEditor] = useState(false);
  const [approvedTeams, setApprovedTeams] = useState<any[]>([]);
  const [pendingTeams, setPendingTeams] = useState<any[]>([]);
  const [pendingPlayers, setPendingPlayers] = useState<any[]>([]);
  const [individualPlayers, setIndividualPlayers] = useState<any[]>([]);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [challongeUrl, setChallongeUrl] = useState('');
  const [homeTitle, setHomeTitle] = useState('League of Legends: Wild Rift');
  const [homeSubtitle, setHomeSubtitle] = useState('Турнир 5x5');
  const [homeDescription, setHomeDescription] = useState('Соберите команду и докажите своё мастерство в «Диком ущелье»');
  const [tournamentInfo, setTournamentInfo] = useState<any>({});
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

  const dataLoader = useDataLoader(BACKEND_URLS.teams, BACKEND_URLS.settings);

  const loadApprovedTeamsData = async () => {
    const teams = await dataLoader.loadApprovedTeams();
    setApprovedTeams(teams);
  };

  const loadPendingTeamsData = async () => {
    const teams = await dataLoader.loadPendingTeams();
    setPendingTeams(teams);
  };

  const loadIndividualPlayersData = async () => {
    const { approved, pending } = await dataLoader.loadIndividualPlayers();
    setIndividualPlayers(approved);
    setPendingPlayers(pending);
  };

  const loadSettingsData = async () => {
    const settings = await dataLoader.loadSettings();
    setRegistrationOpen(settings.registrationOpen);
    setChallongeUrl(settings.challongeUrl);
    setHomeTitle(settings.homeTitle);
    setHomeSubtitle(settings.homeSubtitle);
    setHomeDescription(settings.homeDescription);
    setTournamentInfo(settings.tournamentInfo);
  };

  const { handleLogin, handleLogout } = useAuthentication({
    setIsLoggedIn,
    setIsAdmin,
    setIsSuperAdmin,
    setSessionToken,
    setUsername,
    setUserRole,
    setTeamId,
    setShowLoginDialog,
    setShowAdminPanel,
    setShowSuperAdminPanel,
    loadPendingTeams: loadPendingTeamsData,
    authUrl: BACKEND_URLS.auth,
    userAuthUrl: BACKEND_URLS.userAuth
  });

  const registrationHandler = useRegistrationHandler({
    registerUrl: BACKEND_URLS.register,
    loadApprovedTeams: loadApprovedTeamsData,
    loadIndividualPlayers: loadIndividualPlayersData
  });

  useEffect(() => {
    loadApprovedTeamsData();
    loadIndividualPlayersData();
    loadSettingsData();
    if (isLoggedIn) {
      loadPendingTeamsData();
    }
  }, [isLoggedIn]);

  const handleTeamRegister = async () => {
    const success = await registrationHandler.handleTeamRegister(teamForm);
    if (success) {
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
    }
  };

  const handleIndividualRegister = async () => {
    const success = await registrationHandler.handleIndividualRegister(individualForm);
    if (success) {
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
    }
  };

  const handleTeamFormChange = (field: string, value: any) => {
    setTeamForm(prev => ({ ...prev, [field]: value }));
  };

  const handleIndividualFormChange = (field: string, value: any) => {
    setIndividualForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamUpdate = async (teamData: any) => {
    if (!teamId) return;

    try {
      const response = await fetch(BACKEND_URLS.teams, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken
        },
        body: JSON.stringify({
          action: 'update_team',
          teamId,
          ...teamData
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Команда обновлена!' });
        setShowTeamEditDialog(false);
        loadApprovedTeamsData();
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось обновить команду', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить команду', variant: 'destructive' });
    }
  };

  const handleHeaderAction = () => {
    if (isLoggedIn) {
      if (isSuperAdmin) {
        setShowSuperAdminPanel(true);
      } else if (isAdmin) {
        setShowAdminPanel(true);
      } else if (userRole === 'team_captain') {
        setShowTeamEditDialog(true);
      }
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
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

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="hidden md:grid w-full grid-cols-5 mb-8 bg-card/50 backdrop-blur">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Home" className="w-4 h-4 mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" className="w-4 h-4 mr-2" />
              Команды
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="User" className="w-4 h-4 mr-2" />
              Игроки
            </TabsTrigger>
            <TabsTrigger value="bracket" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="GitBranch" className="w-4 h-4 mr-2" />
              Сетка
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Calendar" className="w-4 h-4 mr-2" />
              Расписание
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <HomeTab 
              homeTitle={homeTitle}
              homeSubtitle={homeSubtitle}
              homeDescription={homeDescription}
              registrationOpen={registrationOpen}
              isSuperAdmin={isSuperAdmin}
              tournamentInfo={tournamentInfo}
              onRegisterClick={() => setSelectedTab('teams')}
              onEditHomeClick={() => setShowHomePageEditor(true)}
            />
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            <TeamsList 
              approvedTeams={approvedTeams}
              registrationOpen={registrationOpen}
              isLoggedIn={isLoggedIn}
              loadApprovedTeams={loadApprovedTeamsData}
            />
            
            {registrationOpen && (
              <div className="mt-8">
                <RegistrationForms 
                  teamForm={teamForm}
                  individualForm={individualForm}
                  onTeamFormChange={handleTeamFormChange}
                  onIndividualFormChange={handleIndividualFormChange}
                  onTeamRegister={handleTeamRegister}
                  onIndividualRegister={handleIndividualRegister}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="players" className="mt-6">
            <PlayersList players={individualPlayers} />
          </TabsContent>

          <TabsContent value="bracket" className="mt-6">
            <TournamentBracket challongeUrl={challongeUrl} />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <ScheduleView 
              scheduleUrl={BACKEND_URLS.schedule}
              isAdmin={isAdmin}
              isSuperAdmin={isSuperAdmin}
            />
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} />

      <LoginDialog 
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />

      <AdminPanel 
        open={showAdminPanel}
        onOpenChange={setShowAdminPanel}
        sessionToken={sessionToken}
        teamsUrl={BACKEND_URLS.teams}
        settingsUrl={BACKEND_URLS.settings}
        onTeamsUpdate={() => {
          loadApprovedTeamsData();
          loadPendingTeamsData();
          loadIndividualPlayersData();
        }}
        onSettingsUpdate={loadSettingsData}
        pendingTeams={pendingTeams}
        pendingPlayers={pendingPlayers}
      />

      <SuperAdminPanel 
        open={showSuperAdminPanel}
        onOpenChange={setShowSuperAdminPanel}
        sessionToken={sessionToken}
        teamsUrl={BACKEND_URLS.teams}
        settingsUrl={BACKEND_URLS.settings}
        onTeamsUpdate={() => {
          loadApprovedTeamsData();
          loadPendingTeamsData();
          loadIndividualPlayersData();
        }}
        onSettingsUpdate={loadSettingsData}
        pendingTeams={pendingTeams}
        pendingPlayers={pendingPlayers}
      />

      {teamId && (
        <TeamEditDialog 
          open={showTeamEditDialog}
          onOpenChange={setShowTeamEditDialog}
          teamId={teamId}
          sessionToken={sessionToken}
          teamsUrl={BACKEND_URLS.teams}
          onUpdate={handleTeamUpdate}
        />
      )}

      {userRole === 'team_captain' && teamId && (
        <TeamManagementDialog 
          open={showTeamManagementDialog}
          onOpenChange={setShowTeamManagementDialog}
          teamId={teamId}
          sessionToken={sessionToken}
          teamsUrl={BACKEND_URLS.teams}
        />
      )}

      {(isAdmin || isSuperAdmin) && (
        <ScheduleAdminPanel 
          open={showScheduleAdminPanel}
          onOpenChange={setShowScheduleAdminPanel}
          sessionToken={sessionToken}
          scheduleUrl={BACKEND_URLS.schedule}
        />
      )}

      {isSuperAdmin && (
        <HomePageEditor 
          open={showHomePageEditor}
          onOpenChange={setShowHomePageEditor}
          sessionToken={sessionToken}
          settingsUrl={BACKEND_URLS.settings}
          currentTitle={homeTitle}
          currentSubtitle={homeSubtitle}
          currentDescription={homeDescription}
          currentTournamentInfo={tournamentInfo}
          onUpdate={loadSettingsData}
        />
      )}
    </div>
  );
};

export default Index;