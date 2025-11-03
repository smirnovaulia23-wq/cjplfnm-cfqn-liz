import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface HomeTabProps {
  homeTitle: string;
  homeSubtitle: string;
  homeDescription: string;
  registrationOpen: boolean;
  isSuperAdmin: boolean;
  tournamentInfo: any;
  onRegisterClick: () => void;
  onEditHomeClick: () => void;
}

export const HomeTab = ({
  homeTitle,
  homeSubtitle,
  homeDescription,
  registrationOpen,
  isSuperAdmin,
  tournamentInfo,
  onRegisterClick,
  onEditHomeClick
}: HomeTabProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center py-8 relative">
        <h1 className="text-5xl font-bold text-primary mb-2">{homeTitle}</h1>
        <p className="text-2xl text-muted-foreground mb-4">{homeSubtitle}</p>
        <p className="text-lg text-foreground/80">{homeDescription}</p>
        {registrationOpen && (
          <Button
            onClick={onRegisterClick}
            size="lg"
            className="mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6"
          >
            <Icon name="UserPlus" className="w-5 h-5 mr-2" />
            Зарегистрироваться
          </Button>
        )}
        {isSuperAdmin && (
          <Button
            onClick={onEditHomeClick}
            variant="outline"
            size="sm"
            className="absolute top-0 right-0"
          >
            <Icon name="Edit" className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        )}
      </div>

      {Object.keys(tournamentInfo).length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournamentInfo.date && (
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Icon name="Calendar" className="w-5 h-5 mr-2" />
                  Дата проведения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{tournamentInfo.date}</p>
              </CardContent>
            </Card>
          )}

          {tournamentInfo.format && (
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Icon name="Users" className="w-5 h-5 mr-2" />
                  Формат
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{tournamentInfo.format}</p>
              </CardContent>
            </Card>
          )}

          {tournamentInfo.prize && (
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Icon name="Trophy" className="w-5 h-5 mr-2" />
                  Призовой фонд
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{tournamentInfo.prize}</p>
              </CardContent>
            </Card>
          )}

          {tournamentInfo.rules && (
            <Card className="bg-card/50 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Icon name="FileText" className="w-5 h-5 mr-2" />
                  Правила
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{tournamentInfo.rules}</p>
              </CardContent>
            </Card>
          )}

          {tournamentInfo.contact && (
            <Card className="bg-card/50 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Icon name="MessageCircle" className="w-5 h-5 mr-2" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{tournamentInfo.contact}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
