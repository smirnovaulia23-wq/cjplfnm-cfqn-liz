import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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

interface Player {
  id: number;
  nickname: string;
  telegram: string;
  preferredRoles: string[];
  hasFriends?: boolean;
  friend1Nickname?: string;
  friend1Telegram?: string;
  friend1Roles?: string[];
  friend2Nickname?: string;
  friend2Telegram?: string;
  friend2Roles?: string[];
}

interface ApprovedApplicationsManagerProps {
  approvedTeams: Team[];
  individualPlayers: Player[];
  onRefresh: () => void;
  backendUrl: string;
  isAdmin?: boolean;
  sessionToken?: string;
}

export const ApprovedApplicationsManager = ({
  approvedTeams,
  individualPlayers,
  onRefresh,
  backendUrl,
  isAdmin = false,
  sessionToken = ''
}: ApprovedApplicationsManagerProps) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'team' | 'player'; id: number } | null>(null);
  const [action, setAction] = useState<'edit' | 'delete'>('edit');
  const { toast } = useToast();

  const handleAction = (type: 'team' | 'player', id: number, actionType: 'edit' | 'delete') => {
    setSelectedItem({ type, id });
    setAction(actionType);
    
    if (isAdmin) {
      handleAdminAction(type, id, actionType);
    } else {
      setShowPasswordDialog(true);
    }
  };

  const handleAdminAction = async (type: 'team' | 'player', id: number, actionType: 'edit' | 'delete') => {
    if (actionType === 'delete') {
      try {
        const response = await fetch(`${backendUrl}`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'X-Auth-Token': sessionToken
          },
          body: JSON.stringify({
            id,
            type,
            adminAction: true
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка при удалении');
        }

        toast({
          title: 'Успешно',
          description: 'Заявка удалена'
        });

        onRefresh();
      } catch (error: any) {
        toast({
          title: 'Ошибка',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  };

  const handleSubmitPassword = async () => {
    if (!selectedItem || !password) {
      toast({
        title: 'Ошибка',
        description: 'Введите пароль',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}`, {
        method: action === 'delete' ? 'DELETE' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedItem.id,
          password,
          type: selectedItem.type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при выполнении операции');
      }

      toast({
        title: 'Успешно',
        description: action === 'delete' ? 'Заявка удалена' : 'Изменения сохранены'
      });

      setShowPasswordDialog(false);
      setPassword('');
      setSelectedItem(null);
      onRefresh();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Неверный пароль',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Управление заявками</h2>
        <Button
          variant="outline"
          className="border-primary/50 text-primary hover:bg-primary/10"
          onClick={onRefresh}
        >
          <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Users" className="w-5 h-5" />
            Одобренные команды ({approvedTeams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedTeams.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Нет одобренных команд</p>
          ) : (
            <div className="space-y-3">
              {approvedTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-lg bg-background/50 border border-border flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{team.teamName}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      Капитан: {team.captainNick} • {team.captainTelegram}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary/10"
                      onClick={() => handleAction('team', team.id, 'edit')}
                    >
                      <Icon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => handleAction('team', team.id, 'delete')}
                    >
                      <Icon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" className="w-5 h-5" />
            Одобренные свободные игроки ({individualPlayers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {individualPlayers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Нет одобренных игроков</p>
          ) : (
            <div className="space-y-3">
              {individualPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-4 rounded-lg bg-background/50 border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{player.nickname}</h4>
                      <p className="text-sm text-muted-foreground truncate">{player.telegram}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {player.preferredRoles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                      
                      {player.hasFriends && (player.friend1Nickname || player.friend2Nickname) && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Друзья:</p>
                          <div className="space-y-2">
                            {player.friend1Nickname && (
                              <div className="flex items-center gap-2 text-sm flex-wrap">
                                <Icon name="UserPlus" className="w-3 h-3 text-muted-foreground" />
                                <span className="text-foreground">{player.friend1Nickname}</span>
                                {player.friend1Telegram && (
                                  <span className="text-muted-foreground text-xs">({player.friend1Telegram})</span>
                                )}
                                {player.friend1Roles && player.friend1Roles.length > 0 && (
                                  <div className="flex gap-1">
                                    {player.friend1Roles.map((role: string) => (
                                      <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            {player.friend2Nickname && (
                              <div className="flex items-center gap-2 text-sm flex-wrap">
                                <Icon name="UserPlus" className="w-3 h-3 text-muted-foreground" />
                                <span className="text-foreground">{player.friend2Nickname}</span>
                                {player.friend2Telegram && (
                                  <span className="text-muted-foreground text-xs">({player.friend2Telegram})</span>
                                )}
                                {player.friend2Roles && player.friend2Roles.length > 0 && (
                                  <div className="flex gap-1">
                                    {player.friend2Roles.map((role: string) => (
                                      <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                        onClick={() => handleAction('player', player.id, 'edit')}
                      >
                        <Icon name="Edit" className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => handleAction('player', player.id, 'delete')}
                      >
                        <Icon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === 'delete' ? 'Удаление заявки' : 'Редактирование заявки'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Введите пароль для подтверждения</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль заявки"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword('');
                setSelectedItem(null);
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmitPassword}
              className={action === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {action === 'delete' ? 'Удалить' : 'Продолжить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovedApplicationsManager;