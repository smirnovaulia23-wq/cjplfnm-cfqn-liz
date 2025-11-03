import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Match {
  id: number;
  match_date: string;
  match_time: string;
  team1_id: number;
  team2_id: number;
  team1_name: string;
  team2_name: string;
  status: 'waiting' | 'live' | 'playing' | 'completed';
  winner_team_id?: number;
  score_team1?: number;
  score_team2?: number;
  round: string;
  stream_url?: string;
}

interface MatchesListProps {
  matches: Match[];
  loading: boolean;
  onEditMatch: (match: Match) => void;
  onDeleteMatch: (matchId: number) => void;
  onClearAll: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'waiting':
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Ожидание</Badge>;
    case 'live':
      return <Badge variant="outline" className="bg-red-500/10 text-red-500 animate-pulse">В эфире</Badge>;
    case 'playing':
      return <Badge variant="outline" className="bg-green-500/10 text-green-500">Играют</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-gray-500/10 text-gray-500">Завершён</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const MatchesList = ({
  matches,
  loading,
  onEditMatch,
  onDeleteMatch,
  onClearAll
}: MatchesListProps) => {
  return (
    <Card className="bg-background/50 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Список матчей ({matches.length})</CardTitle>
          {matches.length > 0 && (
            <Button
              onClick={onClearAll}
              disabled={loading}
              variant="destructive"
              size="sm"
            >
              <Icon name="Trash2" className="w-4 h-4 mr-2" />
              Очистить всё
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Calendar" className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Матчи ещё не добавлены</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">{match.round}</span>
                      {getStatusBadge(match.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(match.match_date).toLocaleDateString('ru-RU')} в {match.match_time}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onEditMatch(match)}
                      size="sm"
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <Icon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteMatch(match.id)}
                      size="sm"
                      variant="outline"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <Icon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <span className={match.winner_team_id === match.team1_id ? 'text-green-500' : ''}>
                      {match.team1_name}
                    </span>
                    {match.score_team1 !== undefined && (
                      <Badge variant="secondary">{match.score_team1}</Badge>
                    )}
                  </div>
                  
                  <span className="text-muted-foreground text-base">vs</span>
                  
                  <div className="flex items-center gap-2">
                    {match.score_team2 !== undefined && (
                      <Badge variant="secondary">{match.score_team2}</Badge>
                    )}
                    <span className={match.winner_team_id === match.team2_id ? 'text-green-500' : ''}>
                      {match.team2_name}
                    </span>
                  </div>
                </div>

                {match.stream_url && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <a 
                      href={match.stream_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Icon name="Video" className="w-4 h-4" />
                      Ссылка на трансляцию
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
