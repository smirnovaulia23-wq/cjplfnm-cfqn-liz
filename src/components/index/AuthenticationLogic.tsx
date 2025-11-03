import { useToast } from '@/hooks/use-toast';

interface AuthenticationLogicProps {
  setIsLoggedIn: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setIsSuperAdmin: (value: boolean) => void;
  setSessionToken: (value: string) => void;
  setUsername: (value: string) => void;
  setUserRole: (value: string) => void;
  setTeamId: (value: number | null) => void;
  setShowLoginDialog: (value: boolean) => void;
  setShowAdminPanel: (value: boolean) => void;
  setShowSuperAdminPanel: (value: boolean) => void;
  loadPendingTeams: () => void;
  authUrl: string;
  userAuthUrl: string;
}

export const useAuthentication = ({
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
  loadPendingTeams,
  authUrl,
  userAuthUrl
}: AuthenticationLogicProps) => {
  const { toast } = useToast();

  const handleLogin = async (telegram: string, password: string) => {
    try {
      const adminResponse = await fetch(authUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
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

      const userResponse = await fetch(userAuthUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
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
        } else {
          setUsername(userData.nickname);
        }
        
        setShowLoginDialog(false);
        toast({ title: 'Вход выполнен', description: `Добро пожаловать, ${userData.userType === 'team_captain' ? userData.captainNick : userData.nickname}!` });
      } else {
        toast({ title: 'Ошибка', description: userData.error || 'Неверный логин или пароль', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось выполнить вход', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setSessionToken('');
    setUsername('');
    setUserRole('');
    setTeamId(null);
    toast({ title: 'Выход выполнен' });
  };

  return { handleLogin, handleLogout };
};
