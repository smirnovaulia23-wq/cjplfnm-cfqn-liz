import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TeamEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: number;
  sessionToken: string;
  onSuccess: () => void;
}

export const TeamEditDialog = ({ open, onOpenChange, teamId, sessionToken, onSuccess }: TeamEditDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teamData, setTeamData] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (open && teamId) {
      loadTeamData();
    }
  }, [open, teamId]);

  const loadTeamData = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/35199dac-d68a-4536-959b-4aad2fb7e7ad?teamId=${teamId}`);
      const data = await response.json();
      if (data.team) {
        setTeamData(data.team);
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить данные команды', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/35199dac-d68a-4536-959b-4aad2fb7e7ad', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken
        },
        body: JSON.stringify({ teamId, ...teamData, action: 'update' })
      });
      const data = await response.json();

      if (data.success) {
        toast({ 
          title: 'Данные отправлены на проверку', 
          description: 'Ваша команда будет рассмотрена администрацией' 
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось обновить данные', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить данные', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!deletePassword) {
      toast({
        title: 'Ошибка',
        description: 'Введите пароль команды',
        variant: 'destructive'
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('https://functions.poehali.dev/35199dac-d68a-4536-959b-4aad2fb7e7ad', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: teamId,
          password: deletePassword,
          type: 'team'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Команда удалена',
          description: 'Ваша команда успешно удалена из турнира'
        });
        setShowDeleteDialog(false);
        onOpenChange(false);
        onSuccess();
        window.location.reload();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверный пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить команду',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!teamData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Редактирование команды</DialogTitle>
          <DialogDescription>Обновите информацию о вашей команде</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <Label className="text-base font-semibold text-foreground">Название команды</Label>
            <Input
              value={teamData.teamName || ''}
              placeholder="Название команды"
              className="bg-background border-border cursor-not-allowed opacity-60"
              disabled
            />
            <p className="text-xs text-muted-foreground">Название команды нельзя изменить. Обратитесь к администрации.</p>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold text-foreground">Состав команды</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Топ - Ник</Label>
                <Input
                  value={teamData.topNick || ''}
                  onChange={(e) => setTeamData({ ...teamData, topNick: e.target.value })}
                  placeholder="Ник игрока"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Топ - Telegram</Label>
                <Input
                  value={teamData.topTelegram || ''}
                  onChange={(e) => setTeamData({ ...teamData, topTelegram: e.target.value })}
                  placeholder="@username"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Лес - Ник</Label>
                <Input
                  value={teamData.jungleNick || ''}
                  onChange={(e) => setTeamData({ ...teamData, jungleNick: e.target.value })}
                  placeholder="Ник игрока"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Лес - Telegram</Label>
                <Input
                  value={teamData.jungleTelegram || ''}
                  onChange={(e) => setTeamData({ ...teamData, jungleTelegram: e.target.value })}
                  placeholder="@username"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Мид - Ник</Label>
                <Input
                  value={teamData.midNick || ''}
                  onChange={(e) => setTeamData({ ...teamData, midNick: e.target.value })}
                  placeholder="Ник игрока"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Мид - Telegram</Label>
                <Input
                  value={teamData.midTelegram || ''}
                  onChange={(e) => setTeamData({ ...teamData, midTelegram: e.target.value })}
                  placeholder="@username"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">АДК - Ник</Label>
                <Input
                  value={teamData.adcNick || ''}
                  onChange={(e) => setTeamData({ ...teamData, adcNick: e.target.value })}
                  placeholder="Ник игрока"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">АДК - Telegram</Label>
                <Input
                  value={teamData.adcTelegram || ''}
                  onChange={(e) => setTeamData({ ...teamData, adcTelegram: e.target.value })}
                  placeholder="@username"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Саппорт - Ник</Label>
                <Input
                  value={teamData.supportNick || ''}
                  onChange={(e) => setTeamData({ ...teamData, supportNick: e.target.value })}
                  placeholder="Ник игрока"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Саппорт - Telegram</Label>
                <Input
                  value={teamData.supportTelegram || ''}
                  onChange={(e) => setTeamData({ ...teamData, supportTelegram: e.target.value })}
                  placeholder="@username"
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Запасной 1 - Ник</Label>
                <Input
                  value={teamData.sub1Nick || ''}
                  onChange={(e) => setTeamData({ ...teamData, sub1Nick: e.target.value })}
                  placeholder="Ник игрока (необязательно)"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Запасной 1 - Telegram</Label>
                <Input
                  value={teamData.sub1Telegram || ''}
                  onChange={(e) => setTeamData({ ...teamData, sub1Telegram: e.target.value })}
                  placeholder="@username (необязательно)"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Запасной 2 - Ник</Label>
                <Input
                  value={teamData.sub2Nick || ''}
                  onChange={(e) => setTeamData({ ...teamData, sub2Nick: e.target.value })}
                  placeholder="Ник игрока (необязательно)"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Запасной 2 - Telegram</Label>
                <Input
                  value={teamData.sub2Telegram || ''}
                  onChange={(e) => setTeamData({ ...teamData, sub2Telegram: e.target.value })}
                  placeholder="@username (необязательно)"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              <Icon name="Save" className="w-4 h-4 mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Отмена
            </Button>
          </div>
          
          <div className="pt-6 border-t border-border">
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Icon name="Trash2" className="w-4 h-4 mr-2" />
              Удалить команду
            </Button>
          </div>
        </form>
      </DialogContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Удалить команду?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Введите пароль команды для подтверждения удаления. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Пароль команды"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeletePassword('');
              setShowDeleteDialog(false);
            }}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              disabled={isDeleting || !deletePassword}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Удаление...' : 'Удалить команду'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default TeamEditDialog;