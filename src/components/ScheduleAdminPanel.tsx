import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { SchedulePublishToggle } from './schedule/SchedulePublishToggle';
import { MatchCreateForm } from './schedule/MatchCreateForm';
import { MatchEditDialog } from './schedule/MatchEditDialog';
import { MatchesList } from './schedule/MatchesList';

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

interface ScheduleAdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToken: string;
  scheduleUrl: string;
}

export const ScheduleAdminPanel = ({
  open,
  onOpenChange,
  sessionToken,
  scheduleUrl
}: ScheduleAdminPanelProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const { toast } = useToast();

  const [newMatch, setNewMatch] = useState({
    match_date: '',
    match_time: '',
    team1_name: '',
    team2_name: '',
    round: ''
  });

  const [editMatch, setEditMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (open) {
      loadMatches();
      loadPublishedStatus();
    }
  }, [open]);

  const loadMatches = async () => {
    try {
      const response = await fetch(scheduleUrl, {
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'X-Admin-Token': sessionToken
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки матчей:', error);
    }
  };

  const loadPublishedStatus = async () => {
    try {
      const response = await fetch(`${scheduleUrl}?check_published=true`, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (response.ok) {
        const data = await response.json();
        setPublished(data.published);
      }
    } catch (error) {
      console.error('Ошибка загрузки статуса публикации:', error);
    }
  };

  const handleTogglePublish = async () => {
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
        body: JSON.stringify({ publish_schedule: !published })
      });

      if (response.ok) {
        setPublished(!published);
        toast({ 
          title: !published ? 'Расписание опубликовано!' : 'Расписание скрыто',
          description: !published ? 'Теперь все пользователи видят матчи' : 'Расписание видно только админам'
        });
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось изменить статус публикации', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось изменить статус публикации', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleMatchChange = (field: string, value: string) => {
    setNewMatch({ ...newMatch, [field]: value });
  };

  const handleCreateMatch = async () => {
    if (!newMatch.match_date || !newMatch.match_time || !newMatch.team1_name || !newMatch.team2_name || !newMatch.round) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
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
          team1_name: newMatch.team1_name.trim(),
          team2_name: newMatch.team2_name.trim(),
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
          team1_name: '',
          team2_name: '',
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

  const handleEditMatchChange = (updates: Partial<Match>) => {
    if (editMatch) {
      setEditMatch({ ...editMatch, ...updates });
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

  const handleDeleteMatch = async (matchId: number) => {
    if (!confirm('Удалить этот матч?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${scheduleUrl}?id=${matchId}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'X-Admin-Token': sessionToken
        }
      });

      if (response.ok) {
        toast({ title: 'Матч удалён!' });
        loadMatches();
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось удалить матч', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить матч', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Удалить ВСЕ матчи? Это действие необратимо!')) return;

    setLoading(true);
    try {
      const response = await fetch(`${scheduleUrl}?clear_all=true`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'X-Admin-Token': sessionToken
        }
      });

      if (response.ok) {
        toast({ title: 'Все матчи удалены!' });
        loadMatches();
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось очистить расписание', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось очистить расписание', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Управление расписанием</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <SchedulePublishToggle 
              published={published}
              loading={loading}
              onTogglePublish={handleTogglePublish}
            />

            <MatchCreateForm 
              newMatch={newMatch}
              loading={loading}
              onMatchChange={handleMatchChange}
              onCreateMatch={handleCreateMatch}
            />

            <MatchesList 
              matches={matches}
              loading={loading}
              onEditMatch={setEditMatch}
              onDeleteMatch={handleDeleteMatch}
              onClearAll={handleClearAll}
            />
          </div>
        </DialogContent>
      </Dialog>

      <MatchEditDialog 
        editMatch={editMatch}
        loading={loading}
        onEditMatchChange={handleEditMatchChange}
        onUpdateMatch={handleUpdateMatch}
        onClose={() => setEditMatch(null)}
      />
    </>
  );
};

export default ScheduleAdminPanel;
