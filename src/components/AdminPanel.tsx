import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Team {
  id: number;
  teamName: string;
  captainNick: string;
  captainTelegram: string;
  status: string;
  createdAt: string;
}

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingTeams: Team[];
  registrationOpen: boolean;
  onToggleRegistration: (open: boolean) => void;
  onApproveTeam: (teamId: number) => void;
  onRejectTeam: (teamId: number) => void;
  userRole: string;
}

export const AdminPanel = ({
  open,
  onOpenChange,
  pendingTeams,
  registrationOpen,
  onToggleRegistration,
  onApproveTeam,
  onRejectTeam,
  userRole
}: AdminPanelProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-primary">Админ-панель</DialogTitle>
            {userRole === 'super_admin' && (
              <Badge className="bg-accent/20 text-accent border border-accent/50">
                Супер Админ
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="bg-background/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Настройки регистрации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="registration-toggle">Регистрация команд</Label>
                  <p className="text-sm text-muted-foreground">
                    {registrationOpen ? 'Регистрация открыта' : 'Регистрация закрыта'}
                  </p>
                </div>
                <Switch
                  id="registration-toggle"
                  checked={registrationOpen}
                  onCheckedChange={onToggleRegistration}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Заявки на регистрацию</CardTitle>
                <Badge variant="outline" className="border-secondary text-secondary">
                  {pendingTeams.length} заявок
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pendingTeams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Нет новых заявок</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTeams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 rounded-lg bg-card border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{team.teamName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Капитан: {team.captainNick} ({team.captainTelegram})
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Подано: {new Date(team.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => onApproveTeam(team.id)}
                        >
                          <Icon name="Check" className="w-4 h-4 mr-1" />
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-accent/50 text-accent hover:bg-accent/10"
                          onClick={() => onRejectTeam(team.id)}
                        >
                          <Icon name="X" className="w-4 h-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
