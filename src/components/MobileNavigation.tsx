import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const MobileNavigation = ({ selectedTab, setSelectedTab }: MobileNavigationProps) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 px-1 py-2">
      <div className="grid grid-cols-5 gap-1">
        <Button
          variant={selectedTab === 'home' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('home')}
          className={`${selectedTab === 'home' ? 'bg-secondary text-white' : 'text-foreground'} flex flex-col items-center justify-center h-auto py-1.5 px-1`}
          size="sm"
        >
          <Icon name="Home" className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Главная</span>
        </Button>
        <Button
          variant={selectedTab === 'register' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('register')}
          className={`${selectedTab === 'register' ? 'bg-secondary text-white' : 'text-foreground'} flex flex-col items-center justify-center h-auto py-1.5 px-1`}
          size="sm"
        >
          <Icon name="UserPlus" className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Регистр.</span>
        </Button>
        <Button
          variant={selectedTab === 'teams' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('teams')}
          className={`${selectedTab === 'teams' ? 'bg-secondary text-white' : 'text-foreground'} flex flex-col items-center justify-center h-auto py-1.5 px-1`}
          size="sm"
        >
          <Icon name="Users" className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Команды</span>
        </Button>
        <Button
          variant={selectedTab === 'players' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('players')}
          className={`${selectedTab === 'players' ? 'bg-secondary text-white' : 'text-foreground'} flex flex-col items-center justify-center h-auto py-1.5 px-1`}
          size="sm"
        >
          <Icon name="UserCircle" className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Игроки</span>
        </Button>
        <Button
          variant={selectedTab === 'tournament' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('tournament')}
          className={`${selectedTab === 'tournament' ? 'bg-secondary text-white' : 'text-foreground'} flex flex-col items-center justify-center h-auto py-1.5 px-1`}
          size="sm"
        >
          <Icon name="Trophy" className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Турнир</span>
        </Button>
      </div>
    </div>
  );
};