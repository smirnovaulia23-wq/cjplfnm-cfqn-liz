import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  oldData?: any;
  topNick?: string;
  topTelegram?: string;
  jungleNick?: string;
  jungleTelegram?: string;
  midNick?: string;
  midTelegram?: string;
  adcNick?: string;
  adcTelegram?: string;
  supportNick?: string;
  supportTelegram?: string;
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

interface PendingApplicationsProps {
  pendingTeams: Team[];
  pendingPlayers: Player[];
  onApproveTeam: (teamId: number) => void;
  onRejectTeam: (teamId: number) => void;
  onApprovePlayer: (playerId: number) => void;
  onRejectPlayer: (playerId: number) => void;
}

export const PendingApplications = ({
  pendingTeams,
  pendingPlayers,
  onApproveTeam,
  onRejectTeam,
  onApprovePlayer,
  onRejectPlayer
}: PendingApplicationsProps) => {
  const renderFieldComparison = (label: string, oldValue: string | undefined, newValue: string | undefined) => {
    if (!oldValue || oldValue === newValue) return null;
    return (
      <div className="flex items-start gap-2 text-sm">
        <span className="text-muted-foreground min-w-[120px]">{label}:</span>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="line-through text-red-500">{oldValue}</span>
            <Icon name="ArrowRight" className="w-3 h-3 text-muted-foreground" />
            <span className="text-green-500">{newValue}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
                    <div className="flex-1 space-y-3">
                      <div>
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
                          Подана: {new Date(team.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      
                      {team.isEdited && team.oldData && (
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="FileEdit" className="w-4 h-4 text-accent" />
                            <span className="text-sm font-semibold text-accent">Изменённые данные:</span>
                          </div>
                          {renderFieldComparison('Название', team.oldData.teamName, team.teamName)}
                          {renderFieldComparison('Капитан - Ник', team.oldData.captainNick, team.captainNick)}
                          {renderFieldComparison('Капитан - Telegram', team.oldData.captainTelegram, team.captainTelegram)}
                          {renderFieldComparison('Топ - Ник', team.oldData.topNick, team.topNick)}
                          {renderFieldComparison('Топ - Telegram', team.oldData.topTelegram, team.topTelegram)}
                          {renderFieldComparison('Лес - Ник', team.oldData.jungleNick, team.jungleNick)}
                          {renderFieldComparison('Лес - Telegram', team.oldData.jungleTelegram, team.jungleTelegram)}
                          {renderFieldComparison('Мид - Ник', team.oldData.midNick, team.midNick)}
                          {renderFieldComparison('Мид - Telegram', team.oldData.midTelegram, team.midTelegram)}
                          {renderFieldComparison('АДК - Ник', team.oldData.adcNick, team.adcNick)}
                          {renderFieldComparison('АДК - Telegram', team.oldData.adcTelegram, team.adcTelegram)}
                          {renderFieldComparison('Саппорт - Ник', team.oldData.supportNick, team.supportNick)}
                          {renderFieldComparison('Саппорт - Telegram', team.oldData.supportTelegram, team.supportTelegram)}
                          {renderFieldComparison('Запасной 1 - Ник', team.oldData.sub1Nick, team.sub1Nick)}
                          {renderFieldComparison('Запасной 1 - Telegram', team.oldData.sub1Telegram, team.sub1Telegram)}
                          {renderFieldComparison('Запасной 2 - Ник', team.oldData.sub2Nick, team.sub2Nick)}
                          {renderFieldComparison('Запасной 2 - Telegram', team.oldData.sub2Telegram, team.sub2Telegram)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onApproveTeam(team.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Icon name="Check" className="w-4 h-4 mr-2" />
                      Одобрить
                    </Button>
                    <Button
                      onClick={() => onRejectTeam(team.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Icon name="X" className="w-4 h-4 mr-2" />
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
            <CardTitle className="text-lg">Заявки игроков на модерацию</CardTitle>
            <Badge variant="outline" className="border-secondary text-secondary">
              {pendingPlayers.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingPlayers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет новых заявок</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-4 rounded-lg bg-card border border-border space-y-3"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{player.nickname}</h3>
                    <p className="text-sm text-muted-foreground">{player.telegram}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Подана: {new Date(player.createdAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Предпочитаемые роли:</p>
                    <div className="flex flex-wrap gap-2">
                      {player.preferredRoles && player.preferredRoles.length > 0 ? (
                        player.preferredRoles.map((role, idx) => (
                          <Badge key={idx} variant="secondary">
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Не указаны</span>
                      )}
                    </div>
                  </div>

                  {player.hasFriends && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <p className="text-sm font-medium text-foreground">Друзья:</p>
                      {player.friend1Nickname && (
                        <div className="text-sm">
                          <p className="font-medium">{player.friend1Nickname}</p>
                          <p className="text-muted-foreground text-xs">{player.friend1Telegram}</p>
                          {player.friend1Roles && player.friend1Roles.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {player.friend1Roles.map((role, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {player.friend2Nickname && (
                        <div className="text-sm mt-2">
                          <p className="font-medium">{player.friend2Nickname}</p>
                          <p className="text-muted-foreground text-xs">{player.friend2Telegram}</p>
                          {player.friend2Roles && player.friend2Roles.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {player.friend2Roles.map((role, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onApprovePlayer(player.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Icon name="Check" className="w-4 h-4 mr-2" />
                      Одобрить
                    </Button>
                    <Button
                      onClick={() => onRejectPlayer(player.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Icon name="X" className="w-4 h-4 mr-2" />
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};