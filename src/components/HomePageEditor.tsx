import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface InfoBlock {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
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
  const [infoBlocks, setInfoBlocks] = useState<InfoBlock[]>([]);
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
        const blocks = JSON.parse(data.settings?.home_info_blocks || '[]');
        setInfoBlocks(blocks);
      } catch {
        setInfoBlocks([]);
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
        { key: 'home_info_blocks', value: JSON.stringify(infoBlocks) }
      ];

      for (const update of updates) {
        await fetch(settingsUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': adminToken
          },
          body: JSON.stringify(update)
        });
      }

      toast({ title: 'Сохранено', description: 'Настройки главной страницы обновлены' });
      onOpenChange(false);
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось сохранить настройки',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const addInfoBlock = () => {
    const newBlock: InfoBlock = {
      id: Date.now().toString(),
      title: 'Новый блок',
      content: 'Описание блока',
      imageUrl: ''
    };
    setInfoBlocks([...infoBlocks, newBlock]);
  };

  const updateInfoBlock = (id: string, field: keyof InfoBlock, value: string) => {
    setInfoBlocks(infoBlocks.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const deleteInfoBlock = (id: string) => {
    setInfoBlocks(infoBlocks.filter(block => block.id !== id));
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Информационные блоки</CardTitle>
                <Button onClick={addInfoBlock} size="sm" className="bg-primary hover:bg-primary/90">
                  <Icon name="Plus" className="w-4 h-4 mr-2" />
                  Добавить блок
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {infoBlocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Нет информационных блоков</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {infoBlocks.map((block) => (
                    <div key={block.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold">Блок #{block.id.slice(-4)}</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteInfoBlock(block.id)}
                          className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                          <Icon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Заголовок блока</Label>
                        <Input
                          value={block.title}
                          onChange={(e) => updateInfoBlock(block.id, 'title', e.target.value)}
                          placeholder="Заголовок"
                        />
                      </div>
                      <div>
                        <Label>Содержание</Label>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateInfoBlock(block.id, 'content', e.target.value)}
                          placeholder="Текст блока"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>URL изображения</Label>
                        <Input
                          value={block.imageUrl}
                          onChange={(e) => updateInfoBlock(block.id, 'imageUrl', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        {block.imageUrl && (
                          <img 
                            src={block.imageUrl} 
                            alt={block.title}
                            className="mt-2 w-full h-32 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
