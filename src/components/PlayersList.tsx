import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Player {
  id: number;
  nickname: string;
  telegram: string;
  preferredRoles: string[];
  friend1Nickname?: string;
  friend1Telegram?: string;
  friend1Roles?: string[];
  friend2Nickname?: string;
  friend2Telegram?: string;
  friend2Roles?: string[];
}

interface PlayersListProps {
  individualPlayers: Player[];
  registrationOpen: boolean;
  loadIndividualPlayers: () => void;
}

const roleColors: { [key: string]: string } = {
  any: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  top: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  jungle: 'bg-green-500/20 text-green-400 border-green-500/50',
  mid: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  adc: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  support: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
};

const roleLabels: { [key: string]: string } = {
  any: 'Любая',
  top: 'Топ',
  jungle: 'Лес',
  mid: 'Мид',
  adc: 'АДК',
  support: 'Саппорт',
};

export const PlayersList = ({
  individualPlayers,
  registrationOpen,
  loadIndividualPlayers
}: PlayersListProps) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | null>(null);

  const filteredPlayers = selectedRoleFilter
    ? individualPlayers.filter(player => player.preferredRoles.includes(selectedRoleFilter))
    : individualPlayers;

  const roles = ['any', 'top', 'jungle', 'mid', 'adc', 'support'];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground">Свободные игроки</h2>
        <Button 
          variant="outline" 
          className="border-primary/50 text-primary hover:bg-primary/10"
          onClick={loadIndividualPlayers}
        >
          <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedRoleFilter === null ? 'default' : 'outline'}
            onClick={() => setSelectedRoleFilter(null)}
            className={selectedRoleFilter === null ? 'bg-secondary text-white' : 'border-border'}
            size="sm"
          >
            Все роли
          </Button>
          {roles.map(role => (
            <Button
              key={role}
              variant={selectedRoleFilter === role ? 'default' : 'outline'}
              onClick={() => setSelectedRoleFilter(role)}
              className={selectedRoleFilter === role ? 'bg-secondary text-white' : 'border-border'}
              size="sm"
            >
              {roleLabels[role]}
            </Button>
          ))}
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                <Icon name="Users" className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {selectedRoleFilter ? 'Нет игроков с этой ролью' : 'Пока нет зарегистрированных игроков'}
              </h3>
              <p className="text-muted-foreground">
                {selectedRoleFilter ? 'Попробуйте выбрать другую роль' : 'Игроки появятся здесь после регистрации'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPlayers.map((player) => (
            <Card key={player.id} className="bg-card/50 border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="User" className="w-5 h-5 text-primary flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-foreground text-ellipsis-nick">{player.nickname}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground text-ellipsis-nick">{player.telegram}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border border-primary/50 ml-2">
                      Свободен
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Предпочитаемые роли:</p>
                    <div className="flex flex-wrap gap-2">
                      {player.preferredRoles.map((role, idx) => (
                        <Badge key={idx} className={roleColors[role] || 'bg-secondary/20 text-secondary border border-secondary/50'}>
                          {roleLabels[role] || role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {(player.friend1Nickname || player.friend2Nickname) && (
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Предпочитает играть с:</p>
                      <div className="space-y-2">
                        {player.friend1Nickname && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Icon name="UserPlus" className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground text-ellipsis-nick">{player.friend1Nickname}</span>
                            {player.friend1Roles && player.friend1Roles.length > 0 && (
                              <div className="flex gap-1">
                                {player.friend1Roles.map((role: string) => (
                                  <Badge key={role} className="text-xs" variant="outline">
                                    {roleLabels[role] || role}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {player.friend2Nickname && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Icon name="UserPlus" className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground text-ellipsis-nick">{player.friend2Nickname}</span>
                            {player.friend2Roles && player.friend2Roles.length > 0 && (
                              <div className="flex gap-1">
                                {player.friend2Roles.map((role: string) => (
                                  <Badge key={role} className="text-xs" variant="outline">
                                    {roleLabels[role] || role}
                                  </Badge>
                                ))}
                              </div>
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
    </div>
  );
};