import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface MatchCreateFormProps {
  newMatch: {
    match_date: string;
    match_time: string;
    team1_name: string;
    team2_name: string;
    round: string;
  };
  loading: boolean;
  onMatchChange: (field: string, value: string) => void;
  onCreateMatch: () => void;
}

export const MatchCreateForm = ({ newMatch, loading, onMatchChange, onCreateMatch }: MatchCreateFormProps) => {
  return (
    <Card className="bg-background/50 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Создать новый матч</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Дата</Label>
            <Input
              type="date"
              value={newMatch.match_date}
              onChange={(e) => onMatchChange('match_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Время</Label>
            <Input
              type="time"
              value={newMatch.match_time}
              onChange={(e) => onMatchChange('match_time', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Команда 1</Label>
            <Input
              placeholder="Название команды 1"
              value={newMatch.team1_name}
              onChange={(e) => onMatchChange('team1_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Команда 2</Label>
            <Input
              placeholder="Название команды 2"
              value={newMatch.team2_name}
              onChange={(e) => onMatchChange('team2_name', e.target.value)}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Раунд</Label>
            <Input
              placeholder="Например: 1/8 финала"
              value={newMatch.round}
              onChange={(e) => onMatchChange('round', e.target.value)}
            />
          </div>
        </div>
        <Button 
          onClick={onCreateMatch} 
          disabled={loading}
          className="w-full mt-4 bg-primary hover:bg-primary/90"
        >
          <Icon name="Plus" className="w-4 h-4 mr-2" />
          Создать матч
        </Button>
      </CardContent>
    </Card>
  );
};
