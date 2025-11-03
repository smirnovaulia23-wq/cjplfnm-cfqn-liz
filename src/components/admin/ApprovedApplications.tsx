import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

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

interface ApprovedApplicationsProps {
  approvedTeams: Team[];
  approvedPlayers: Player[];
  onDeleteApprovedTeam?: (teamId: number) => void;
  onDeleteApprovedPlayer?: (playerId: number) => void;
  onEditApprovedTeam?: (teamId: number) => void;
  userRole: string;
}

export const ApprovedApplications = ({
  approvedTeams,
  approvedPlayers,
  onDeleteApprovedTeam,
  onDeleteApprovedPlayer,
  onEditApprovedTeam,
  userRole
}: ApprovedApplicationsProps) => {
  const exportToExcel = () => {
    const data = approvedTeams.map((team, index) => ({
      '№': index + 1,
      'Название команды': team.teamName,
      'Капитан': team.captainNick,
      'Telegram': team.captainTelegram
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Команды');

    const colWidths = [
      { wch: 5 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 }
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `Команды_турнира_${new Date().toLocaleDateString('ru-RU')}.xlsx`);
  };

  return (
    <>
      <Card className="bg-background/50 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Одобренные команды</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-600 text-green-600">
                {approvedTeams.length}
              </Badge>
              {approvedTeams.length > 0 && (
                <Button 
                  onClick={exportToExcel}
                  size="sm"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Icon name="Download" className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {approvedTeams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Users" className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет одобренных команд</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-3 rounded-lg bg-card border border-green-600/30 hover:border-green-600/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{team.teamName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Капитан: {team.captainNick} ({team.captainTelegram})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {userRole === 'super_admin' && onEditApprovedTeam && (
                        <Button
                          onClick={() => onEditApprovedTeam(team.id)}
                          size="sm"
                          variant="outline"
                          className="border-primary/50 text-primary hover:bg-primary/10"
                        >
                          <Icon name="Edit" className="w-4 h-4" />
                        </Button>
                      )}
                      {onDeleteApprovedTeam && (
                        <Button
                          onClick={() => onDeleteApprovedTeam(team.id)}
                          size="sm"
                          variant="outline"
                          className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                          <Icon name="Trash2" className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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
            <CardTitle className="text-lg">Одобренные игроки</CardTitle>
            <Badge variant="outline" className="border-green-600 text-green-600">
              {approvedPlayers.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {approvedPlayers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="UserCircle" className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет одобренных игроков</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-3 rounded-lg bg-card border border-green-600/30 hover:border-green-600/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{player.nickname}</h3>
                      <p className="text-sm text-muted-foreground">{player.telegram}</p>
                      {player.preferredRoles && player.preferredRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {player.preferredRoles.map((role, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {player.hasFriends && (player.friend1Nickname || player.friend2Nickname) && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Друзья:</p>
                          {player.friend1Nickname && (
                            <p className="text-xs">
                              {player.friend1Nickname} ({player.friend1Telegram})
                              {player.friend1Roles && player.friend1Roles.length > 0 && (
                                <span className="text-muted-foreground"> - {player.friend1Roles.join(', ')}</span>
                              )}
                            </p>
                          )}
                          {player.friend2Nickname && (
                            <p className="text-xs">
                              {player.friend2Nickname} ({player.friend2Telegram})
                              {player.friend2Roles && player.friend2Roles.length > 0 && (
                                <span className="text-muted-foreground"> - {player.friend2Roles.join(', ')}</span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {onDeleteApprovedPlayer && (
                      <Button
                        onClick={() => onDeleteApprovedPlayer(player.id)}
                        size="sm"
                        variant="outline"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" className="w-4 h-4" />
                      </Button>
                    )}
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
