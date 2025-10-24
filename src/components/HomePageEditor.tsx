import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface TournamentInfo {
  tournamentName: string;
  tournamentNameImage: string;
  prizeFund: string;
  prizeFundImage: string;
  prizeCount: string;
  prizeCountImage: string;
  streamLinks: string;
  streamLinksImage: string;
  sponsor: string;
  sponsorImage: string;
  startDate: string;
  startDateImage: string;
  registrationEnd: string;
  registrationEndImage: string;
  rules: string;
  regulationsLink: string;
}

interface HomePageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settingsUrl: string;
  adminToken: string;
}

export const HomePageEditor = ({ open, onOpenChange, settingsUrl, adminToken }: HomePageEditorProps) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo>({
    tournamentName: '',
    tournamentNameImage: '',
    prizeFund: '',
    prizeFundImage: '',
    prizeCount: '',
    prizeCountImage: '',
    streamLinks: '',
    streamLinksImage: '',
    sponsor: '',
    sponsorImage: '',
    startDate: '',
    startDateImage: '',
    registrationEnd: '',
    registrationEndImage: '',
    rules: '',
    regulationsLink: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      const response = await fetch(settingsUrl);
      if (!response.ok) return;
      
      const data = await response.json();
      setTitle(data.settings?.home_title || 'League of Legends: Wild Rift');
      setSubtitle(data.settings?.home_subtitle || 'Турнир 5x5');
      setDescription(data.settings?.home_description || 'Соберите команду и докажите своё мастерство в «Диком ущелье»');
      
      try {
        const info = JSON.parse(data.settings?.tournament_info || '{}');
        setTournamentInfo({
          tournamentName: info.tournamentName || '',
          tournamentNameImage: info.tournamentNameImage || '',
          prizeFund: info.prizeFund || '',
          prizeFundImage: info.prizeFundImage || '',
          prizeCount: info.prizeCount || '',
          prizeCountImage: info.prizeCountImage || '',
          streamLinks: info.streamLinks || '',
          streamLinksImage: info.streamLinksImage || '',
          sponsor: info.sponsor || '',
          sponsorImage: info.sponsorImage || '',
          startDate: info.startDate || '',
          startDateImage: info.startDateImage || '',
          registrationEnd: info.registrationEnd || '',
          registrationEndImage: info.registrationEndImage || '',
          rules: info.rules || '',
          regulationsLink: info.regulationsLink || ''
        });
      } catch {
        setTournamentInfo({
          tournamentName: '',
          tournamentNameImage: '',
          prizeFund: '',
          prizeFundImage: '',
          prizeCount: '',
          prizeCountImage: '',
          streamLinks: '',
          streamLinksImage: '',
          sponsor: '',
          sponsorImage: '',
          startDate: '',
          startDateImage: '',
          registrationEnd: '',
          registrationEndImage: '',
          rules: '',
          regulationsLink: ''
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const updates = [
        { key: 'home_title', value: title },
        { key: 'home_subtitle', value: subtitle },
        { key: 'home_description', value: description },
        { key: 'tournament_info', value: tournamentInfo }
      ];

      for (const update of updates) {
        const response = await fetch(settingsUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': adminToken
          },
          body: JSON.stringify(update)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при сохранении');
        }
      }

      toast({ title: 'Сохранено', description: 'Настройки главной страницы обновлены' });
      onOpenChange(false);
    } catch (error) {
      console.error('Save error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось сохранить настройки',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTournamentInfo = (field: keyof TournamentInfo, value: string) => {
    setTournamentInfo({ ...tournamentInfo, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Редактор главной страницы</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="bg-background/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Заголовок страницы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Основной заголовок</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="League of Legends: Wild Rift"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Подзаголовок</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Турнир 5x5"
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Соберите команду и докажите своё мастерство в «Диком ущелье»"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Информационные блоки</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                💡 Для каждого блока можно добавить картинку. Вставьте ссылку на изображение в поле "Картинка (URL)". 
                Изображения будут отображаться слева от текста.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tournamentName">Название турнира</Label>
                  <Input
                    id="tournamentName"
                    value={tournamentInfo.tournamentName}
                    onChange={(e) => updateTournamentInfo('tournamentName', e.target.value)}
                    placeholder="Кубок League of Legends: Wild Rift"
                  />
                </div>
                <div>
                  <Label htmlFor="tournamentNameImage">Картинка для "Название турнира" (URL)</Label>
                  <Input
                    id="tournamentNameImage"
                    value={tournamentInfo.tournamentNameImage}
                    onChange={(e) => updateTournamentInfo('tournamentNameImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="prizeFund">Призовой фонд</Label>
                  <Input
                    id="prizeFund"
                    value={tournamentInfo.prizeFund}
                    onChange={(e) => updateTournamentInfo('prizeFund', e.target.value)}
                    placeholder="100 000 ₽"
                  />
                </div>
                <div>
                  <Label htmlFor="prizeFundImage">Картинка для "Призовой фонд" (URL)</Label>
                  <Input
                    id="prizeFundImage"
                    value={tournamentInfo.prizeFundImage}
                    onChange={(e) => updateTournamentInfo('prizeFundImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="prizeCount">Количество призовых мест</Label>
                  <Input
                    id="prizeCount"
                    value={tournamentInfo.prizeCount}
                    onChange={(e) => updateTournamentInfo('prizeCount', e.target.value)}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="prizeCountImage">Картинка для "Количество призовых мест" (URL)</Label>
                  <Input
                    id="prizeCountImage"
                    value={tournamentInfo.prizeCountImage}
                    onChange={(e) => updateTournamentInfo('prizeCountImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="streamLinks">Стрим-трансляции</Label>
                  <Textarea
                    id="streamLinks"
                    value={tournamentInfo.streamLinks}
                    onChange={(e) => updateTournamentInfo('streamLinks', e.target.value)}
                    placeholder="Ссылки на стримы (каждая с новой строки)"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="streamLinksImage">Картинка для "Стрим-трансляции" (URL)</Label>
                  <Input
                    id="streamLinksImage"
                    value={tournamentInfo.streamLinksImage}
                    onChange={(e) => updateTournamentInfo('streamLinksImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sponsor">Спонсор</Label>
                  <Input
                    id="sponsor"
                    value={tournamentInfo.sponsor}
                    onChange={(e) => updateTournamentInfo('sponsor', e.target.value)}
                    placeholder="Компания XYZ"
                  />
                </div>
                <div>
                  <Label htmlFor="sponsorImage">Картинка для "Спонсор" (URL)</Label>
                  <Input
                    id="sponsorImage"
                    value={tournamentInfo.sponsorImage}
                    onChange={(e) => updateTournamentInfo('sponsorImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Начало турнира</Label>
                  <Input
                    id="startDate"
                    value={tournamentInfo.startDate}
                    onChange={(e) => updateTournamentInfo('startDate', e.target.value)}
                    placeholder="15 ноября 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="startDateImage">Картинка для "Начало турнира" (URL)</Label>
                  <Input
                    id="startDateImage"
                    value={tournamentInfo.startDateImage}
                    onChange={(e) => updateTournamentInfo('startDateImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="registrationEnd">Окончание регистрации</Label>
                  <Input
                    id="registrationEnd"
                    value={tournamentInfo.registrationEnd}
                    onChange={(e) => updateTournamentInfo('registrationEnd', e.target.value)}
                    placeholder="10 ноября 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="registrationEndImage">Картинка для "Окончание регистрации" (URL)</Label>
                  <Input
                    id="registrationEndImage"
                    value={tournamentInfo.registrationEndImage}
                    onChange={(e) => updateTournamentInfo('registrationEndImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="streamLinks">Стрим-трансляции</Label>
                <Textarea
                  id="streamLinks"
                  value={tournamentInfo.streamLinks}
                  onChange={(e) => updateTournamentInfo('streamLinks', e.target.value)}
                  placeholder="Ссылки на стримы (каждая с новой строки)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="rules">Основные правила и условия</Label>
                <Textarea
                  id="rules"
                  value={tournamentInfo.rules}
                  onChange={(e) => updateTournamentInfo('rules', e.target.value)}
                  placeholder="Перечислите основные правила турнира"
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="regulationsLink">Ссылка на регламент</Label>
                <Input
                  id="regulationsLink"
                  value={tournamentInfo.regulationsLink}
                  onChange={(e) => updateTournamentInfo('regulationsLink', e.target.value)}
                  placeholder="https://example.com/regulations.pdf"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={saveSettings}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Icon name="Save" className="w-4 h-4 mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};