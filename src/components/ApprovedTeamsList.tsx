import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface Team {
  id: number;
  team_name: string;
  captain_nick: string;
  captain_telegram: string;
}

interface ApprovedTeamsListProps {
  teams: Team[];
}

export const ApprovedTeamsList = ({ teams }: ApprovedTeamsListProps) => {
  if (teams.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="Users" className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Пока нет одобренных команд
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Icon name="Users" className="w-6 h-6" />
          Зарегистрированные команды ({teams.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">№</TableHead>
                <TableHead className="font-semibold">Название команды</TableHead>
                <TableHead className="font-semibold">Капитан</TableHead>
                <TableHead className="font-semibold">Telegram капитана</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {team.team_name}
                  </TableCell>
                  <TableCell>{team.captain_nick}</TableCell>
                  <TableCell>
                    <a 
                      href={`https://t.me/${team.captain_telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {team.captain_telegram}
                      <Icon name="ExternalLink" className="w-3 h-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
