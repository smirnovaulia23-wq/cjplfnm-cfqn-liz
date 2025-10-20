import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const MobileNavigation = ({ selectedTab, setSelectedTab }: MobileNavigationProps) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 px-2 py-2">
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={selectedTab === 'register' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('register')}
          className={selectedTab === 'register' ? 'bg-secondary text-white' : 'text-foreground'}
          size="sm"
        >
          <Icon name="UserPlus" className="w-4 h-4 mr-1" />
          <span className="text-xs">Регистрация</span>
        </Button>
        <Button
          variant={selectedTab === 'teams' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('teams')}
          className={selectedTab === 'teams' ? 'bg-secondary text-white' : 'text-foreground'}
          size="sm"
        >
          <Icon name="Users" className="w-4 h-4 mr-1" />
          <span className="text-xs">Команды</span>
        </Button>
        <Button
          variant={selectedTab === 'players' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('players')}
          className={selectedTab === 'players' ? 'bg-secondary text-white' : 'text-foreground'}
          size="sm"
        >
          <Icon name="UserCircle" className="w-4 h-4 mr-1" />
          <span className="text-xs">Игроки</span>
        </Button>
      </div>
    </div>
  );
};
