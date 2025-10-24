import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

interface SuperAdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToken: string;
  authUrl: string;
  teamsUrl: string;
}

export const SuperAdminPanel = ({
  open,
  onOpenChange,
  sessionToken,
  authUrl,
  teamsUrl
}: SuperAdminPanelProps) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      loadAdmins();
    }
  }, [open]);

  const loadAdmins = async () => {
    try {
      const response = await fetch(`${authUrl}?action=list_admins`, {
        headers: {
          'X-Auth-Token': sessionToken
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminUsername || !newAdminPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': sessionToken
        },
        body: JSON.stringify({
          action: 'create_admin',
          username: newAdminUsername,
          password: newAdminPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании администратора');
      }

      toast({
        title: 'Успешно',
        description: 'Администратор добавлен'
      });

      setNewAdminUsername('');
      setNewAdminPassword('');
      loadAdmins();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAdmin = async (adminId: number, username: string) => {
    if (username === 'Xuna') {
      toast({
        title: 'Ошибка',
        description: 'Нельзя удалить супер-администратора',
        variant: 'destructive'
      });
      return;
    }

    if (!confirm(`Удалить администратора ${username}?`)) {
      return;
    }

    try {
      const response = await fetch(authUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': sessionToken
        },
        body: JSON.stringify({
          action: 'delete_admin',
          adminId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при удалении');
      }

      toast({
        title: 'Успешно',
        description: 'Администратор удален'
      });

      loadAdmins();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleClearAllApplications = async () => {
    if (!confirm('⚠️ ВНИМАНИЕ! Вы уверены, что хотите удалить ВСЕ заявки (команды и игроки)? Это действие необратимо!')) {
      return;
    }

    if (!confirm('Подтвердите ещё раз: удалить все заявки для подготовки к новому турниру?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(teamsUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': sessionToken
        },
        body: JSON.stringify({
          action: 'clear_all'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при удалении заявок');
      }

      toast({
        title: 'Успешно',
        description: `Удалено заявок: ${data.deletedTeams} команд, ${data.deletedPlayers} игроков`
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Shield" className="w-6 h-6 text-primary" />
            Управление администрацией
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-background/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Добавить администратора</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="admin-username">Имя пользователя</Label>
                <Input
                  id="admin-username"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  placeholder="Введите имя администратора"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Пароль</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleAddAdmin}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              >
                <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                Добавить администратора
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Список администраторов</span>
                <Badge variant="outline" className="border-secondary text-secondary">
                  {admins.length} админ.
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {admins.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Users" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Нет администраторов</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="p-4 rounded-lg bg-card border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Icon 
                            name={admin.username === 'Xuna' ? 'Crown' : 'UserCog'} 
                            className="w-5 h-5 text-primary" 
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            {admin.username}
                            {admin.username === 'Xuna' && (
                              <Badge className="bg-primary/20 text-primary border border-primary/50">
                                Адм
                              </Badge>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Создан: {new Date(admin.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      
                      {admin.username !== 'Xuna' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/50 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                        >
                          <Icon name="Trash2" className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-destructive/10 border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <Icon name="AlertTriangle" className="w-5 h-5" />
                Опасная зона
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Это действие удалит ВСЕ заявки (команды и игроков) из базы данных. 
                Используйте для подготовки к новому турниру.
              </p>
              <Button
                onClick={handleClearAllApplications}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full"
              >
                <Icon name="Trash2" className="w-4 h-4 mr-2" />
                {isDeleting ? 'Удаление...' : 'Удалить все заявки'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuperAdminPanel;