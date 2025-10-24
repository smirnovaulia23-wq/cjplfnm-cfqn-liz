import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Team {
  id: number;
  team_name: string;
}

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
}

interface ScheduleAdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToken: string;
  teamsUrl: string;
  scheduleUrl: string;
}

export const ScheduleAdminPanel = ({
  open,
  onOpenChange,
  sessionToken,
  teamsUrl,
  scheduleUrl
}: ScheduleAdminPanelProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [newMatch, setNewMatch] = useState({
    match_date: '',
    match_time: '',
    team1_id: '',
    team2_id: '',
    round: ''
  });

  const [editMatch, setEditMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (open) {
      loadTeams();
      loadMatches();
    }
  }, [open]);

  const loadTeams = async () => {
    try {
      const response = await fetch(`${teamsUrl}?status=approved`, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки команд:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const response = await fetch(scheduleUrl, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки матчей:', error);
    }
  };

  const handleCreateMatch = async () => {
    if (!newMatch.match_date || !newMatch.match_time || !newMatch.team1_id || !newMatch.team2_id || !newMatch.round) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    if (newMatch.team1_id === newMatch.team2_id) {
      toast({ title: 'Команды должны быть разными', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const team1 = teams.find(t => t.id === parseInt(newMatch.team1_id));
      const team2 = teams.find(t => t.id === parseInt(newMatch.team2_id));

      const response = await fetch(scheduleUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': sessionToken
        },
        body: JSON.stringify({
          match_date: newMatch.match_date,
          match_time: newMatch.match_time,
          team1_id: parseInt(newMatch.team1_id),
          team2_id: parseInt(newMatch.team2_id),
          team1_name: team1?.team_name || '',
          team2_name: team2?.team_name || '',
          round: newMatch.round,
          status: 'waiting'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Матч создан!' });
        setNewMatch({
          match_date: '',
          match_time: '',
          team1_id: '',
          team2_id: '',
          round: ''
        });
        loadMatches();
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось создать матч', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать матч', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMatch = async () => {
    if (!editMatch) return;

    setLoading(true);
    try {
      const response = await fetch(scheduleUrl, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': sessionToken
        },
        body: JSON.stringify({
          id: editMatch.id,
          status: editMatch.status,
          winner_team_id: editMatch.winner_team_id,
          score_team1: editMatch.score_team1,
          score_team2: editMatch.score_team2
        })
      });

      if (response.ok) {
        toast({ title: 'Матч обновлён!' });
        setEditMatch(null);
        loadMatches();
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось обновить матч', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить матч', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Calendar" className="w-5 h-5" />
            Управление расписанием
          </DialogTitle>
          <DialogDescription>
            Создавайте и редактируйте матчи турнира
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Создать новый матч</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Дата матча</Label>
                  <Input
                    type="date"
                    value={newMatch.match_date}
                    onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Время матча</Label>
                  <Input
                    type="time"
                    value={newMatch.match_time}
                    onChange={(e) => setNewMatch({ ...newMatch, match_time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Раунд/Стадия</Label>
                <Input
                  placeholder="Например: Групповой этап, 1/4 финала"
                  value={newMatch.round}
                  onChange={(e) => setNewMatch({ ...newMatch, round: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Команда 1</Label>
                  <Select value={newMatch.team1_id} onValueChange={(value) => setNewMatch({ ...newMatch, team1_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите команду" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Команда 2</Label>
                  <Select value={newMatch.team2_id} onValueChange={(value) => setNewMatch({ ...newMatch, team2_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите команду" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateMatch} disabled={loading} className="w-full">
                <Icon name="Plus" className="w-4 h-4 mr-2" />
                Создать матч
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Список матчей</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {matches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Матчи ещё не созданы</p>
              ) : (
                matches.map(match => (
                  <Card key={match.id} className="border-secondary/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{match.round}</Badge>
                          {getStatusBadge(match.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {match.match_date} в {match.match_time}
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{match.team1_name}</span>
                          {match.status === 'completed' && <Badge>{match.score_team1}</Badge>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{match.team2_name}</span>
                          {match.status === 'completed' && <Badge>{match.score_team2}</Badge>}
                        </div>
                      </div>

                      {editMatch?.id === match.id ? (
                        <div className="space-y-3 mt-3 pt-3 border-t">
                          <div>
                            <Label>Статус</Label>
                            <Select value={editMatch.status} onValueChange={(value: any) => setEditMatch({ ...editMatch, status: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="waiting">Ожидание</SelectItem>
                                <SelectItem value="live">В эфире</SelectItem>
                                <SelectItem value="playing">Играют</SelectItem>
                                <SelectItem value="completed">Завершён</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {editMatch.status === 'completed' && (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label>Счёт команды 1</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={editMatch.score_team1 || 0}
                                    onChange={(e) => setEditMatch({ ...editMatch, score_team1: parseInt(e.target.value) })}
                                  />
                                </div>
                                <div>
                                  <Label>Счёт команды 2</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={editMatch.score_team2 || 0}
                                    onChange={(e) => setEditMatch({ ...editMatch, score_team2: parseInt(e.target.value) })}
                                  />
                                </div>
                              </div>

                              <div>
                                <Label>Победитель</Label>
                                <Select 
                                  value={editMatch.winner_team_id?.toString() || ''} 
                                  onValueChange={(value) => setEditMatch({ ...editMatch, winner_team_id: parseInt(value) })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите победителя" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={match.team1_id.toString()}>{match.team1_name}</SelectItem>
                                    <SelectItem value={match.team2_id.toString()}>{match.team2_name}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}

                          <div className="flex gap-2">
                            <Button onClick={handleUpdateMatch} disabled={loading} size="sm" className="flex-1">
                              Сохранить
                            </Button>
                            <Button onClick={() => setEditMatch(null)} variant="outline" size="sm">
                              Отмена
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => setEditMatch(match)} variant="outline" size="sm" className="w-full">
                          <Icon name="Edit" className="w-4 h-4 mr-2" />
                          Редактировать
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};