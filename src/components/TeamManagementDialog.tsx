import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface TeamManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backendUrl: string;
  teamId?: number;
  sessionToken?: string;
  isAdmin?: boolean;
}

export const TeamManagementDialog = ({ open, onOpenChange, backendUrl, teamId, sessionToken, isAdmin }: TeamManagementDialogProps) => {
  const [step, setStep] = useState<'login' | 'manage'>(isAdmin && teamId ? 'manage' : 'login');
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && isAdmin && teamId) {
      loadTeamData();
    }
  }, [open, isAdmin, teamId]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}?teamId=${teamId}`);
      const data = await response.json();
      
      if (data.team) {
        setTeamData(data.team);
        setStep('manage');
      } else {
        toast({ 
          title: 'Ошибка', 
          description: 'Команда не найдена',
          variant: 'destructive'
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось загрузить данные команды',
        variant: 'destructive'
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!teamName.trim() || !password.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Введите название команды и пароль',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}?action=team-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, password })
      });

      const data = await response.json();
      
      if (data.success && data.team) {
        setTeamData(data.team);
        setStep('manage');
        toast({ 
          title: 'Успешно', 
          description: 'Добро пожаловать в панель управления командой!' 
        });
      } else {
        toast({ 
          title: 'Ошибка', 
          description: data.error || 'Неверное название команды или пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось войти. Попробуйте позже.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isAdmin && sessionToken) {
        headers['X-Auth-Token'] = sessionToken;
      }

      const body: any = {
        action: 'update',
        teamId: teamData.id,
        ...teamData
      };
      
      if (!isAdmin) {
        body.password = password;
      }

      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({ 
          title: 'Успешно', 
          description: 'Данные команды обновлены!' 
        });
      } else {
        toast({ 
          title: 'Ошибка', 
          description: data.error || 'Не удалось обновить данные',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось обновить данные. Попробуйте позже.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('login');
    setTeamName('');
    setPassword('');
    setTeamData(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            {step === 'login' ? 'Вход в управление командой' : 'Управление командой'}
          </DialogTitle>
        </DialogHeader>

        {step === 'login' ? (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Название команды</Label>
              <Input
                id="team-name"
                type="text"
                placeholder="Введите название команды"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-password">Пароль</Label>
              <Input
                id="team-password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" className="w-4 h-4 mr-2" />
                  Войти
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-background/50 rounded-lg border border-border">
              {isAdmin ? (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Название команды</Label>
                  <Input
                    value={teamData.teamName}
                    onChange={(e) => setTeamData({...teamData, teamName: e.target.value})}
                    className="text-lg font-semibold"
                  />
                </div>
              ) : (
                <h3 className="font-semibold text-lg mb-2">{teamData.teamName}</h3>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Статус: <span className="text-foreground font-medium">
                  {teamData.status === 'approved' ? '✅ Одобрена' : '⏳ На рассмотрении'}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Капитан команды</h4>
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label>Никнейм капитана</Label>
                  <Input
                    value={teamData.captainNick}
                    onChange={(e) => setTeamData({...teamData, captainNick: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telegram капитана</Label>
                  <Input
                    value={teamData.captainTelegram}
                    onChange={(e) => setTeamData({...teamData, captainTelegram: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Состав команды</h4>
              <div className="grid gap-3">
                {['top', 'jungle', 'mid', 'adc', 'support'].map((role) => (
                  <div key={role} className="p-3 bg-background/30 rounded border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                      {role === 'top' ? 'Топ' : role === 'jungle' ? 'Лес' : role === 'mid' ? 'Мид' : role === 'adc' ? 'АДК' : 'Саппорт'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Никнейм"
                        value={teamData[`${role}Nick`]}
                        onChange={(e) => setTeamData({...teamData, [`${role}Nick`]: e.target.value})}
                      />
                      <Input
                        placeholder="Telegram"
                        value={teamData[`${role}Telegram`]}
                        onChange={(e) => setTeamData({...teamData, [`${role}Telegram`]: e.target.value})}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Запасные игроки</h4>
              <div className="grid gap-3">
                {[1, 2].map((num) => (
                  <div key={num} className="p-3 bg-background/30 rounded border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Запасной {num}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Никнейм"
                        value={teamData[`sub${num}Nick`] || ''}
                        onChange={(e) => setTeamData({...teamData, [`sub${num}Nick`]: e.target.value})}
                      />
                      <Input
                        placeholder="Telegram"
                        value={teamData[`sub${num}Telegram`] || ''}
                        onChange={(e) => setTeamData({...teamData, [`sub${num}Telegram`]: e.target.value})}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleUpdateTeam} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" className="w-4 h-4 mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TeamManagementDialog;