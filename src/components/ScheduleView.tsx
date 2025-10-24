import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface Match {
  id: number;
  match_date: string;
  match_time: string;
  team1_name: string;
  team2_name: string;
  status: 'waiting' | 'live' | 'playing' | 'completed';
  winner_team_id?: number;
  score_team1?: number;
  score_team2?: number;
  round: string;
}

interface ScheduleViewProps {
  backendUrl: string;
}

export const ScheduleView = ({ backendUrl }: ScheduleViewProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await fetch(`${backendUrl}/matches`, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Ожидание</Badge>;
      case 'live':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 animate-pulse">В эфире</Badge>;
      case 'playing':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Играют</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/30">Завершён</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const groupByDate = (matches: Match[]) => {
    const grouped: Record<string, Match[]> = {};
    matches.forEach(match => {
      if (!grouped[match.match_date]) {
        grouped[match.match_date] = [];
      }
      grouped[match.match_date].push(match);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="border-secondary/30 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <Icon name="Calendar" className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Расписание матчей пока не опубликовано</p>
        </CardContent>
      </Card>
    );
  }

  const groupedMatches = groupByDate(matches);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Расписание матчей</h2>
          <p className="text-sm text-muted-foreground">Все запланированные и прошедшие игры</p>
        </div>
      </div>

      {Object.entries(groupedMatches).map(([date, dateMatches]) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-2 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10">
            <Icon name="Calendar" className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{formatDate(date)}</h3>
          </div>

          {dateMatches.map((match) => (
            <Card key={match.id} className="border-secondary/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                      {match.round}
                    </Badge>
                    {getStatusBadge(match.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Clock" className="w-4 h-4" />
                    {match.match_time}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-semibold ${match.winner_team_id === match.id && match.status === 'completed' ? 'text-primary' : 'text-foreground'}`}>
                        {match.team1_name}
                      </span>
                      {match.status === 'completed' && match.score_team1 !== undefined && (
                        <Badge variant="secondary" className="font-bold">{match.score_team1}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Icon name="Swords" className="w-4 h-4" />
                      <span>VS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${match.winner_team_id !== match.id && match.status === 'completed' ? 'text-primary' : 'text-foreground'}`}>
                        {match.team2_name}
                      </span>
                      {match.status === 'completed' && match.score_team2 !== undefined && (
                        <Badge variant="secondary" className="font-bold">{match.score_team2}</Badge>
                      )}
                    </div>
                  </div>
                  
                  {match.status === 'completed' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Trophy" className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};