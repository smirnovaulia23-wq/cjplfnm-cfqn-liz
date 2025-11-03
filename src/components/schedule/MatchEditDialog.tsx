import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface MatchEditDialogProps {
  editMatch: Match | null;
  loading: boolean;
  onEditMatchChange: (updates: Partial<Match>) => void;
  onUpdateMatch: () => void;
  onClose: () => void;
}

export const MatchEditDialog = ({
  editMatch,
  loading,
  onEditMatchChange,
  onUpdateMatch,
  onClose
}: MatchEditDialogProps) => {
  if (!editMatch) return null;

  return (
    <Dialog open={!!editMatch} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Редактировать матч</DialogTitle>
          <DialogDescription>
            {editMatch.team1_name} vs {editMatch.team2_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Статус матча</Label>
            <Select 
              value={editMatch.status} 
              onValueChange={(value) => onEditMatchChange({ status: value as Match['status'] })}
            >
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Счёт {editMatch.team1_name}</Label>
              <Input
                type="number"
                min="0"
                value={editMatch.score_team1 || ''}
                onChange={(e) => onEditMatchChange({ score_team1: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>Счёт {editMatch.team2_name}</Label>
              <Input
                type="number"
                min="0"
                value={editMatch.score_team2 || ''}
                onChange={(e) => onEditMatchChange({ score_team2: parseInt(e.target.value) || undefined })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Победитель</Label>
            <Select 
              value={editMatch.winner_team_id?.toString() || 'none'} 
              onValueChange={(value) => onEditMatchChange({ 
                winner_team_id: value === 'none' ? undefined : parseInt(value) 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не определён</SelectItem>
                <SelectItem value={editMatch.team1_id.toString()}>{editMatch.team1_name}</SelectItem>
                <SelectItem value={editMatch.team2_id.toString()}>{editMatch.team2_name}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={onUpdateMatch} 
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Icon name="Save" className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
