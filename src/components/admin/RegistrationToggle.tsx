import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RegistrationToggleProps {
  registrationOpen: boolean;
  onToggleRegistration: (open: boolean) => void;
}

export const RegistrationToggle = ({ registrationOpen, onToggleRegistration }: RegistrationToggleProps) => {
  return (
    <Card className="bg-background/50 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Регистрация</CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              id="registration-toggle"
              checked={registrationOpen}
              onCheckedChange={onToggleRegistration}
            />
            <Label htmlFor="registration-toggle" className="text-sm cursor-pointer">
              {registrationOpen ? 'Открыта' : 'Закрыта'}
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {registrationOpen 
            ? 'Капитаны могут регистрировать команды и вносить изменения' 
            : 'Регистрация закрыта. Капитаны не могут создавать или редактировать команды'}
        </p>
      </CardContent>
    </Card>
  );
};
