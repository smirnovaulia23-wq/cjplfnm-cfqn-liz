import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Team {
  id: number;
  teamName: string;
  captainNick: string;
  captainTelegram: string;
  topNick: string;
  topTelegram: string;
  jungleNick: string;
  jungleTelegram: string;
  midNick: string;
  midTelegram: string;
  adcNick: string;
  adcTelegram: string;
  supportNick: string;
  supportTelegram: string;
  sub1Nick?: string;
  sub1Telegram?: string;
  sub2Nick?: string;
  sub2Telegram?: string;
}

interface TeamsListProps {
  approvedTeams: Team[];
  isLoggedIn: boolean;
  registrationOpen: boolean;
  loadApprovedTeams: () => void;
  teamsBackendUrl: string;
}

export const TeamsList = ({
  approvedTeams,
  isLoggedIn,
  registrationOpen,
  loadApprovedTeams,
  teamsBackendUrl
}: TeamsListProps) => {
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState<number | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = (teamId: number) => {
    setDeleteTeamId(teamId);
    setDeletePassword('');
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTeamId || !deletePassword) {
      toast({
        title: 'Ошибка',
        description: 'Введите пароль команды',
        variant: 'destructive'
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(teamsBackendUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: deleteTeamId,
          password: deletePassword,
          type: 'team'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Команда удалена',
          description: 'Ваша команда успешно удалена из турнира'
        });
        setShowDeleteDialog(false);
        setDeletePassword('');
        setDeleteTeamId(null);
        loadApprovedTeams();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверный пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить команду',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 flex-shrink-0">
                        <span className="text-lg sm:text-xl font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground text-ellipsis-nick">{team.teamName}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/20 text-primary border border-primary/50">
                        Одобрено
                      </Badge>
                      {!isLoggedIn && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary/50 text-primary hover:bg-primary/10"
                            onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                          >
                            <Icon name={expandedTeam === team.id ? "ChevronUp" : "ChevronDown"} className="w-4 h-4 mr-1" />
                            Подробнее
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeleteClick(team.id)}
                          >
                            <Icon name="Trash2" className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="text-ellipsis-nick block sm:inline">Капитан: {team.captainNick}</span>
                    {(!registrationOpen || isLoggedIn) && (
                      <span className="text-ellipsis-nick block sm:inline"> • {team.captainTelegram}</span>
                    )}
                  </div>

                  {(expandedTeam === team.id || isLoggedIn) && (
                    <div className="pt-4 border-t border-border/50 space-y-3">
                      <h4 className="font-semibold text-foreground mb-3">Состав команды:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-background/50 border border-border min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Топ</p>
                          <p className="font-medium text-foreground text-ellipsis-nick">{team.topNick}</p>
                          {(!registrationOpen || isLoggedIn) && (
                            <p className="text-xs text-muted-foreground mt-1 text-ellipsis-nick">{team.topTelegram}</p>
                          )}
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Лес</p>
                          <p className="font-medium text-foreground text-ellipsis-nick">{team.jungleNick}</p>
                          {(!registrationOpen || isLoggedIn) && (
                            <p className="text-xs text-muted-foreground mt-1 text-ellipsis-nick">{team.jungleTelegram}</p>
                          )}
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Мид</p>
                          <p className="font-medium text-foreground text-ellipsis-nick">{team.midNick}</p>
                          {(!registrationOpen || isLoggedIn) && (
                            <p className="text-xs text-muted-foreground mt-1 text-ellipsis-nick">{team.midTelegram}</p>
                          )}
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">АДК</p>
                          <p className="font-medium text-foreground text-ellipsis-nick">{team.adcNick}</p>
                          {(!registrationOpen || isLoggedIn) && (
                            <p className="text-xs text-muted-foreground mt-1 text-ellipsis-nick">{team.adcTelegram}</p>
                          )}
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Саппорт</p>
                          <p className="font-medium text-foreground text-ellipsis-nick">{team.supportNick}</p>
                          {(!registrationOpen || isLoggedIn) && (
                            <p className="text-xs text-muted-foreground mt-1 text-ellipsis-nick">{team.supportTelegram}</p>
                          )}
                        </div>
                        {team.sub1Nick && (
                          <div className="p-3 rounded-lg bg-background/50 border border-border min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">Запасной 1</p>
                            <p className="font-medium text-foreground text-ellipsis-nick">{team.sub1Nick}</p>
                            {(!registrationOpen || isLoggedIn) && team.sub1Telegram && (
                              <p className="text-xs text-muted-foreground mt-1 text-ellipsis-nick">{team.sub1Telegram}</p>
                            )}
                          </div>
                        )}
                        {team.sub2Nick && (
                          <div className="p-3 rounded-lg bg-background/50 border border-border min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">Запасной 2</p>
                            <p className="font-medium text-foreground text-ellipsis-nick">{team.sub2Nick}</p>
                            {(!registrationOpen || isLoggedIn) && team.sub2Telegram && (
                              <p className="text-xs text-muted-foreground mt-1 text-ellipsis-nick">{team.sub2Telegram}</p>
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Удалить команду</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Введите пароль команды для подтверждения удаления. Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Пароль команды"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting || !deletePassword}
            >
              {isDeleting ? 'Удаление...' : 'Удалить команду'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};