import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TournamentHeaderProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  userRole: string;
  username: string;
  teamId: number | null;
  setShowLoginDialog: (show: boolean) => void;
  setShowAdminPanel: (show: boolean) => void;
  setShowSuperAdminPanel?: (show: boolean) => void;
  setShowTeamEditDialog: (show: boolean) => void;
  setShowTeamManagementDialog: (show: boolean) => void;
  onLogout: () => void;
}

export const TournamentHeader = ({
  selectedTab,
  setSelectedTab,
  isLoggedIn,
  isAdmin,
  isSuperAdmin = false,
  userRole,
  username,
  teamId,
  setShowLoginDialog,
  setShowAdminPanel,
  setShowSuperAdminPanel,
  setShowTeamEditDialog,
  setShowTeamManagementDialog,
  onLogout
}: TournamentHeaderProps) => {
  return (
    <header className="relative z-10 border-b border-secondary/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://cdn.poehali.dev/files/eac5fadf-b016-4656-a234-d2674a27b6d9.png" 
              alt="Go Tournament Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Go Tournament</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Турнирная платформа</p>
            </div>
          </div>
          
          <nav className="hidden sm:flex items-center space-x-2">
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
            <Button 
              variant={selectedTab === 'players' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('players')}
              className={selectedTab === 'players' ? 'bg-secondary text-white hover:bg-secondary/90' : 'text-foreground hover:text-primary transition-colors'}
            >
              <Icon name="UserCircle" className="w-4 h-4 mr-2" />
              Свободные игроки
            </Button>
            <Button 
              variant={selectedTab === 'tournament' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('tournament')}
              className={selectedTab === 'tournament' ? 'bg-secondary text-white hover:bg-secondary/90' : 'text-foreground hover:text-primary transition-colors'}
            >
              <Icon name="Trophy" className="w-4 h-4 mr-2" />
              Турнир
            </Button>

          </nav>
          {isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {username}
              </span>
              {isAdmin ? (
                <>
                  <Button
                    onClick={() => setShowAdminPanel(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    size="sm"
                  >
                    <Icon name="Settings" className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Админ-панель</span>
                  </Button>
                  {isSuperAdmin && setShowSuperAdminPanel && (
                    <Button
                      onClick={() => setShowSuperAdminPanel(true)}
                      className="bg-secondary text-white hover:bg-secondary/90"
                      size="sm"
                    >
                      <Icon name="Shield" className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Администрация</span>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => userRole === 'team_captain' ? setShowTeamEditDialog(true) : setShowTeamManagementDialog(true)}
                  className="bg-secondary text-white hover:bg-secondary/90"
                  size="sm"
                >
                  <Icon name="Settings" className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Моя команда</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <Icon name="LogOut" className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Выход</span>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setShowLoginDialog(true)}
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <Icon name="LogIn" className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Войти</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};