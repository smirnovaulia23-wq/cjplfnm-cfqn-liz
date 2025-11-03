import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SchedulePublishToggleProps {
  published: boolean;
  loading: boolean;
  onTogglePublish: () => void;
}

export const SchedulePublishToggle = ({ published, loading, onTogglePublish }: SchedulePublishToggleProps) => {
  return (
    <Card className="bg-background/50 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Публикация расписания</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {published ? 'Расписание видно всем пользователям' : 'Расписание видно только администраторам'}
          </p>
          <Button
            onClick={onTogglePublish}
            disabled={loading}
            className={published ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            <Icon name={published ? 'EyeOff' : 'Eye'} className="w-4 h-4 mr-2" />
            {published ? 'Скрыть' : 'Опубликовать'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
