import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface TeamFormData {
  teamName: string;
  captainNick: string;
  captainTelegram: string;
  password: string;
  confirmPassword: string;
  topNick: string;
  topTelegram: string;
  jungleNick: string;
  jungleTelegram: string;
  midNick: string;
  midTelegram: string;
  adcNick: string;
  adcTelegram: string;
  supportNick: string;
  supportTelegram: string;
  sub1Nick: string;
  sub1Telegram: string;
  sub2Nick: string;
  sub2Telegram: string;
}

interface IndividualFormData {
  nickname: string;
  telegram: string;
  preferredRoles: string[];
  hasFriends: boolean;
  friend1Nickname: string;
  friend1Telegram: string;
  friend1Role: string;
  friend2Nickname: string;
  friend2Telegram: string;
  friend2Role: string;
}

interface RegistrationFormsProps {
  teamForm: TeamFormData;
  setTeamForm: (form: TeamFormData) => void;
  individualForm: IndividualFormData;
  setIndividualForm: (form: IndividualFormData) => void;
  registrationOpen: boolean;
  handleTeamRegistration: (e: React.FormEvent) => void;
  handleIndividualRegistration: (e: React.FormEvent) => void;
  toggleRole: (role: string) => void;
}

const roleColors: { [key: string]: string } = {
  top: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  jungle: 'bg-green-500/20 text-green-400 border-green-500/50',
  mid: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  adc: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  support: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
};

export const RegistrationForms = ({
  teamForm,
  setTeamForm,
  individualForm,
  setIndividualForm,
  registrationOpen,
  handleTeamRegistration,
  handleIndividualRegistration,
  toggleRole
}: RegistrationFormsProps) => {
  return (
    <Tabs defaultValue="team" className="max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="team" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">Регистрация команды</span>
          <span className="sm:hidden">Команда</span>
        </TabsTrigger>
        <TabsTrigger value="individual" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">Индивидуальная регистрация</span>
          <span className="sm:hidden">Индивид.</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="team">
        <form onSubmit={handleTeamRegistration}>
          <Card className="bg-card/50 border-border">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-primary">Регистрация команды</CardTitle>
                  <CardDescription className="mt-2">Заполните данные для участия в турнире</CardDescription>
                </div>
                <Badge className={registrationOpen ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-accent/20 text-accent border border-accent/50'}>
                  {registrationOpen ? 'Регистрация открыта' : 'Регистрация закрыта'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">Название команды *</Label>
                <Input
                  value={teamForm.teamName}
                  onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
                  placeholder="Введите название команды"
                  className="bg-background border-border focus:border-primary h-12"
                  required
                  disabled={!registrationOpen}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Ник капитана *</Label>
                  <Input
                    value={teamForm.captainNick}
                    onChange={(e) => setTeamForm({ ...teamForm, captainNick: e.target.value })}
                    placeholder="IvanGamer"
                    className="bg-background border-border focus:border-primary"
                    required
                    disabled={!registrationOpen}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Telegram капитана *</Label>
                  <Input
                    value={teamForm.captainTelegram}
                    onChange={(e) => setTeamForm({ ...teamForm, captainTelegram: e.target.value })}
                    placeholder="@username"
                    className="bg-background border-border focus:border-primary"
                    required
                    disabled={!registrationOpen}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">Пароль для входа</Label>
                <p className="text-sm text-muted-foreground">Используйте Telegram капитана для входа</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Пароль *</Label>
                    <Input
                      type="password"
                      value={teamForm.password}
                      onChange={(e) => setTeamForm({ ...teamForm, password: e.target.value })}
                      placeholder="Минимум 6 символов"
                      className="bg-background border-border focus:border-primary"
                      required
                      disabled={!registrationOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Подтверждение пароля *</Label>
                    <Input
                      type="password"
                      value={teamForm.confirmPassword}
                      onChange={(e) => setTeamForm({ ...teamForm, confirmPassword: e.target.value })}
                      placeholder="Повторите пароль"
                      className="bg-background border-border focus:border-primary"
                      required
                      disabled={!registrationOpen}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">Состав команды</Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Топ *</Label>
                    <Input value={teamForm.topNick} onChange={(e) => setTeamForm({ ...teamForm, topNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telegram топа *</Label>
                    <Input value={teamForm.topTelegram} onChange={(e) => setTeamForm({ ...teamForm, topTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Лес *</Label>
                    <Input value={teamForm.jungleNick} onChange={(e) => setTeamForm({ ...teamForm, jungleNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telegram леса *</Label>
                    <Input value={teamForm.jungleTelegram} onChange={(e) => setTeamForm({ ...teamForm, jungleTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Мид *</Label>
                    <Input value={teamForm.midNick} onChange={(e) => setTeamForm({ ...teamForm, midNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telegram мида *</Label>
                    <Input value={teamForm.midTelegram} onChange={(e) => setTeamForm({ ...teamForm, midTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">АДК *</Label>
                    <Input value={teamForm.adcNick} onChange={(e) => setTeamForm({ ...teamForm, adcNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telegram АДК *</Label>
                    <Input value={teamForm.adcTelegram} onChange={(e) => setTeamForm({ ...teamForm, adcTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Саппорт *</Label>
                    <Input value={teamForm.supportNick} onChange={(e) => setTeamForm({ ...teamForm, supportNick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telegram саппорта *</Label>
                    <Input value={teamForm.supportTelegram} onChange={(e) => setTeamForm({ ...teamForm, supportTelegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" required disabled={!registrationOpen} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Запасной 1</Label>
                    <Input value={teamForm.sub1Nick} onChange={(e) => setTeamForm({ ...teamForm, sub1Nick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telegram запасного 1</Label>
                    <Input value={teamForm.sub1Telegram} onChange={(e) => setTeamForm({ ...teamForm, sub1Telegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Запасной 2</Label>
                    <Input value={teamForm.sub2Nick} onChange={(e) => setTeamForm({ ...teamForm, sub2Nick: e.target.value })} placeholder="Ник игрока" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telegram запасного 2</Label>
                    <Input value={teamForm.sub2Telegram} onChange={(e) => setTeamForm({ ...teamForm, sub2Telegram: e.target.value })} placeholder="@username" className="bg-background border-border focus:border-primary" disabled={!registrationOpen} />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12" disabled={!registrationOpen}>
                <Icon name="Send" className="w-4 h-4 mr-2" />
                Отправить заявку
              </Button>
            </CardContent>
          </Card>
        </form>
      </TabsContent>

      <TabsContent value="individual">
        <form onSubmit={handleIndividualRegistration}>
          <Card className="bg-card/50 border-border">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-primary">Индивидуальная регистрация</CardTitle>
                  <CardDescription className="mt-2">Зарегистрируйтесь как свободный игрок</CardDescription>
                </div>
                <Badge className={registrationOpen ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-accent/20 text-accent border border-accent/50'}>
                  {registrationOpen ? 'Регистрация открыта' : 'Регистрация закрыта'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Ваш игровой ник *</Label>
                  <Input
                    value={individualForm.nickname}
                    onChange={(e) => setIndividualForm({ ...individualForm, nickname: e.target.value })}
                    placeholder="ProGamer123"
                    className="bg-background border-border focus:border-primary"
                    required
                    disabled={!registrationOpen}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Ваш Telegram *</Label>
                  <Input
                    value={individualForm.telegram}
                    onChange={(e) => setIndividualForm({ ...individualForm, telegram: e.target.value })}
                    placeholder="@username"
                    className="bg-background border-border focus:border-primary"
                    required
                    disabled={!registrationOpen}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">Предпочитаемые роли * (выберите до 3)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['top', 'jungle', 'mid', 'adc', 'support'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      disabled={!registrationOpen}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        individualForm.preferredRoles.includes(role)
                          ? roleColors[role] + ' border-current'
                          : 'border-border bg-background/50 text-muted-foreground hover:border-primary/50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="font-medium capitalize">
                        {role === 'top' && 'Топ'}
                        {role === 'jungle' && 'Лес'}
                        {role === 'mid' && 'Мид'}
                        {role === 'adc' && 'АДК'}
                        {role === 'support' && 'Саппорт'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFriends"
                    checked={individualForm.hasFriends}
                    onCheckedChange={(checked) => 
                      setIndividualForm({ ...individualForm, hasFriends: checked as boolean })
                    }
                    disabled={!registrationOpen}
                  />
                  <Label htmlFor="hasFriends" className="text-sm font-medium text-foreground cursor-pointer">
                    Хочу играть с друзьями
                  </Label>
                </div>

                {individualForm.hasFriends && (
                  <div className="space-y-4 p-4 bg-background/50 rounded-lg border border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Ник друга 1</Label>
                        <Input
                          value={individualForm.friend1Nickname}
                          onChange={(e) => setIndividualForm({ ...individualForm, friend1Nickname: e.target.value })}
                          placeholder="Ник игрока"
                          className="bg-background border-border focus:border-primary"
                          disabled={!registrationOpen}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Telegram друга 1</Label>
                        <Input
                          value={individualForm.friend1Telegram}
                          onChange={(e) => setIndividualForm({ ...individualForm, friend1Telegram: e.target.value })}
                          placeholder="@username"
                          className="bg-background border-border focus:border-primary"
                          disabled={!registrationOpen}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Ник друга 2</Label>
                        <Input
                          value={individualForm.friend2Nickname}
                          onChange={(e) => setIndividualForm({ ...individualForm, friend2Nickname: e.target.value })}
                          placeholder="Ник игрока"
                          className="bg-background border-border focus:border-primary"
                          disabled={!registrationOpen}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Telegram друга 2</Label>
                        <Input
                          value={individualForm.friend2Telegram}
                          onChange={(e) => setIndividualForm({ ...individualForm, friend2Telegram: e.target.value })}
                          placeholder="@username"
                          className="bg-background border-border focus:border-primary"
                          disabled={!registrationOpen}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12" disabled={!registrationOpen}>
                <Icon name="Send" className="w-4 h-4 mr-2" />
                Зарегистрироваться
              </Button>
            </CardContent>
          </Card>
        </form>
      </TabsContent>
    </Tabs>
  );
};
