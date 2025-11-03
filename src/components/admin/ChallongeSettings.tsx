import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface ChallongeSettingsProps {
  challongeUrl?: string;
  onChallongeUrlChange?: (url: string) => void;
}

export const ChallongeSettings = ({ challongeUrl, onChallongeUrlChange }: ChallongeSettingsProps) => {
  const [tempChallongeUrl, setTempChallongeUrl] = useState(challongeUrl || '');
  const [useIframeMode, setUseIframeMode] = useState(false);

  return (
    <Card className="bg-background/50 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Турнирная сетка Challonge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder={useIframeMode ? "q3oa03t9" : "https://challonge.com/q3oa03t9"}
              value={tempChallongeUrl}
              onChange={(e) => setTempChallongeUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                if (onChallongeUrlChange) {
                  let urlToSave = tempChallongeUrl;
                  if (useIframeMode && !tempChallongeUrl.includes('challonge.com')) {
                    urlToSave = `https://challonge.com/${tempChallongeUrl}`;
                  }
                  onChallongeUrlChange(urlToSave);
                }
              }}
              className="bg-primary hover:bg-primary/80"
            >
              <Icon name="Save" className="w-4 h-4 mr-2" />
              Подключить
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="iframe-mode"
              checked={useIframeMode}
              onCheckedChange={setUseIframeMode}
            />
            <Label htmlFor="iframe-mode" className="text-sm cursor-pointer">
              Использовать iframe режим (только ID турнира)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            {useIframeMode 
              ? "Введите только ID турнира (например: q3oa03t9). Виджет отобразится через встроенный iframe."
              : "Вставьте полную ссылку на турнир Challonge. Сетка будет обновляться автоматически каждые 30 секунд."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
