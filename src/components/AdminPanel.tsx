import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Team {
  id: number;
  teamName: string;
  captainNick: string;
  captainTelegram: string;
  status: string;
  createdAt: string;
  isEdited?: boolean;
}

interface Player {
  id: number;
  nickname: string;
  telegram: string;
  preferredRoles: string[];
  status: string;
  createdAt: string;
  hasFriends?: boolean;
  friend1Nickname?: string;
  friend1Telegram?: string;
  friend1Roles?: string[];
  friend2Nickname?: string;
  friend2Telegram?: string;
  friend2Roles?: string[];
}

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingTeams: Team[];
  pendingPlayers: Player[];
  registrationOpen: boolean;
  onToggleRegistration: (open: boolean) => void;
  onApproveTeam: (teamId: number) => void;
  onRejectTeam: (teamId: number) => void;
  onApprovePlayer: (playerId: number) => void;
  onRejectPlayer: (playerId: number) => void;
  userRole: string;
}

export const AdminPanel = ({
  open,
  onOpenChange,
  pendingTeams,
  pendingPlayers,
  registrationOpen,
  onToggleRegistration,
  onApproveTeam,
  onRejectTeam,
  onApprovePlayer,
  onRejectPlayer,
  userRole
}: AdminPanelProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Панель модерации</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">

          <Card className="bg-background/50 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Заявки команд на модерацию</CardTitle>
                <Badge variant="outline" className="border-secondary text-secondary">
                  {pendingTeams.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pendingTeams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Нет новых заявок</p>
                </div>
              ) : (
<div className="space-y-4">
                  {pendingTeams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 rounded-lg bg-card border border-border space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-foreground">{team.teamName}</h3>
                            {team.isEdited && (
                              <Badge className="bg-accent/20 text-accent border-accent/50">
                                <Icon name="Edit" className="w-3 h-3 mr-1" />
                                Отредактирована
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Капитан: {team.captainNick} ({team.captainTelegram})
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Подано: {new Date(team.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-3">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Состав команды:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <div className="p-2 rounded bg-background/50 border border-border/50">
                            <p className="text-xs text-muted-foreground">Топ</p>
                            <p className="font-medium text-sm">{team.topNick}</p>
                            <p className="text-xs text-muted-foreground">{team.topTelegram}</p>
                          </div>
                          <div className="p-2 rounded bg-background/50 border border-border/50">
                            <p className="text-xs text-muted-foreground">Лес</p>
                            <p className="font-medium text-sm">{team.jungleNick}</p>
                            <p className="text-xs text-muted-foreground">{team.jungleTelegram}</p>
                          </div>
                          <div className="p-2 rounded bg-background/50 border border-border/50">
                            <p className="text-xs text-muted-foreground">Мид</p>
                            <p className="font-medium text-sm">{team.midNick}</p>
                            <p className="text-xs text-muted-foreground">{team.midTelegram}</p>
                          </div>
                          <div className="p-2 rounded bg-background/50 border border-border/50">
                            <p className="text-xs text-muted-foreground">АДК</p>
                            <p className="font-medium text-sm">{team.adcNick}</p>
                            <p className="text-xs text-muted-foreground">{team.adcTelegram}</p>
                          </div>
                          <div className="p-2 rounded bg-background/50 border border-border/50">
                            <p className="text-xs text-muted-foreground">Саппорт</p>
                            <p className="font-medium text-sm">{team.supportNick}</p>
                            <p className="text-xs text-muted-foreground">{team.supportTelegram}</p>
                          </div>
                          {team.sub1Nick && (
                            <div className="p-2 rounded bg-background/50 border border-border/50">
                              <p className="text-xs text-muted-foreground">Запасной 1</p>
                              <p className="font-medium text-sm">{team.sub1Nick}</p>
                              {team.sub1Telegram && (
                                <p className="text-xs text-muted-foreground">{team.sub1Telegram}</p>
                              )}
                            </div>
                          )}
                          {team.sub2Nick && (
                            <div className="p-2 rounded bg-background/50 border border-border/50">
                              <p className="text-xs text-muted-foreground">Запасной 2</p>
                              <p className="font-medium text-sm">{team.sub2Nick}</p>
                              {team.sub2Telegram && (
                                <p className="text-xs text-muted-foreground">{team.sub2Telegram}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => onApproveTeam(team.id)}
                        >
                          <Icon name="Check" className="w-4 h-4 mr-1" />
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-accent/50 text-accent hover:bg-accent/10"
                          onClick={() => onRejectTeam(team.id)}
                        >
                          <Icon name="X" className="w-4 h-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Заявки свободных игроков</CardTitle>
                <Badge variant="outline" className="border-secondary text-secondary">
                  {pendingPlayers.length} заявок
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pendingPlayers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Нет новых заявок от игроков</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="p-4 rounded-lg bg-card border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{player.nickname}</h4>
                          <p className="text-sm text-muted-foreground">{player.telegram}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {player.preferredRoles && player.preferredRoles.map((role) => (
                              <Badge key={role} variant="outline" className="border-primary/50 text-primary text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Подано: {new Date(player.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>

                      {player.hasFriends && (player.friend1Nickname || player.friend2Nickname) && (
                        <div className="pt-3 mt-3 border-t border-border/50">
                          <p className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                            <Icon name="Users" className="w-4 h-4" />
                            Хочет играть с друзьями:
                          </p>
                          <div className="space-y-3 pl-2">
                            {player.friend1Nickname && (
                              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                                <div className="flex items-center gap-2 text-sm mb-1">
                                  <Icon name="UserPlus" className="w-4 h-4 text-primary" />
                                  <span className="font-medium text-foreground">{player.friend1Nickname}</span>
                                  {player.friend1Telegram && (
                                    <span className="text-muted-foreground text-xs">({player.friend1Telegram})</span>
                                  )}
                                </div>
                                {player.friend1Roles && player.friend1Roles.length > 0 && (
                                  <div className="flex gap-1 mt-2 ml-6">
                                    {player.friend1Roles.map((role: string) => (
                                      <Badge key={role} variant="outline" className="text-xs border-primary/50 text-primary">{role}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            {player.friend2Nickname && (
                              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                                <div className="flex items-center gap-2 text-sm mb-1">
                                  <Icon name="UserPlus" className="w-4 h-4 text-primary" />
                                  <span className="font-medium text-foreground">{player.friend2Nickname}</span>
                                  {player.friend2Telegram && (
                                    <span className="text-muted-foreground text-xs">({player.friend2Telegram})</span>
                                  )}
                                </div>
                                {player.friend2Roles && player.friend2Roles.length > 0 && (
                                  <div className="flex gap-1 mt-2 ml-6">
                                    {player.friend2Roles.map((role: string) => (
                                      <Badge key={role} variant="outline" className="text-xs border-primary/50 text-primary">{role}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => onApprovePlayer(player.id)}
                        >
                          <Icon name="Check" className="w-4 h-4 mr-1" />
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-accent/50 text-accent hover:bg-accent/10"
                          onClick={() => onRejectPlayer(player.id)}
                        >
                          <Icon name="X" className="w-4 h-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;