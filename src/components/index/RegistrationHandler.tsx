import { useToast } from '@/hooks/use-toast';

interface TeamForm {
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

interface IndividualForm {
  nickname: string;
  telegram: string;
  preferredRoles: string[];
  hasFriends: boolean;
  friend1Nickname: string;
  friend1Telegram: string;
  friend1Roles: string[];
  friend2Nickname: string;
  friend2Telegram: string;
  friend2Roles: string[];
}

interface RegistrationHandlerProps {
  registerUrl: string;
  loadApprovedTeams: () => void;
  loadIndividualPlayers: () => void;
}

export const useRegistrationHandler = ({
  registerUrl,
  loadApprovedTeams,
  loadIndividualPlayers
}: RegistrationHandlerProps) => {
  const { toast } = useToast();

  const handleTeamRegister = async (teamForm: TeamForm) => {
    if (!teamForm.teamName || !teamForm.captainNick || !teamForm.captainTelegram || !teamForm.password) {
      toast({ title: 'Заполните обязательные поля', variant: 'destructive' });
      return false;
    }

    if (teamForm.password !== teamForm.confirmPassword) {
      toast({ title: 'Пароли не совпадают', variant: 'destructive' });
      return false;
    }

    if (teamForm.password.length < 6) {
      toast({ title: 'Пароль должен быть не менее 6 символов', variant: 'destructive' });
      return false;
    }

    const players = [
      { nickname: teamForm.captainNick, telegram: teamForm.captainTelegram, role: 'Капитан' },
      teamForm.topNick && { nickname: teamForm.topNick, telegram: teamForm.topTelegram, role: 'TOP' },
      teamForm.jungleNick && { nickname: teamForm.jungleNick, telegram: teamForm.jungleTelegram, role: 'JUNGLE' },
      teamForm.midNick && { nickname: teamForm.midNick, telegram: teamForm.midTelegram, role: 'MID' },
      teamForm.adcNick && { nickname: teamForm.adcNick, telegram: teamForm.adcTelegram, role: 'ADC' },
      teamForm.supportNick && { nickname: teamForm.supportNick, telegram: teamForm.supportTelegram, role: 'SUPPORT' },
      teamForm.sub1Nick && { nickname: teamForm.sub1Nick, telegram: teamForm.sub1Telegram, role: 'Запасной 1' },
      teamForm.sub2Nick && { nickname: teamForm.sub2Nick, telegram: teamForm.sub2Telegram, role: 'Запасной 2' }
    ].filter(Boolean);

    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'team',
          teamName: teamForm.teamName.trim(),
          captainNick: teamForm.captainNick.trim(),
          captainTelegram: teamForm.captainTelegram.trim(),
          password: teamForm.password,
          players
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Команда зарегистрирована!', description: 'Ожидайте подтверждения' });
        loadApprovedTeams();
        return true;
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось зарегистрировать команду', variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось зарегистрировать команду', variant: 'destructive' });
      return false;
    }
  };

  const handleIndividualRegister = async (individualForm: IndividualForm) => {
    if (!individualForm.nickname || !individualForm.telegram || individualForm.preferredRoles.length === 0) {
      toast({ title: 'Заполните все поля и выберите роли', variant: 'destructive' });
      return false;
    }

    const friends = [];
    if (individualForm.hasFriends) {
      if (individualForm.friend1Nickname && individualForm.friend1Telegram && individualForm.friend1Roles.length > 0) {
        friends.push({
          nickname: individualForm.friend1Nickname.trim(),
          telegram: individualForm.friend1Telegram.trim(),
          preferredRoles: individualForm.friend1Roles
        });
      }
      if (individualForm.friend2Nickname && individualForm.friend2Telegram && individualForm.friend2Roles.length > 0) {
        friends.push({
          nickname: individualForm.friend2Nickname.trim(),
          telegram: individualForm.friend2Telegram.trim(),
          preferredRoles: individualForm.friend2Roles
        });
      }
    }

    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'individual',
          nickname: individualForm.nickname.trim(),
          telegram: individualForm.telegram.trim(),
          preferredRoles: individualForm.preferredRoles,
          friends
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Регистрация отправлена!', description: 'Ожидайте подтверждения' });
        loadIndividualPlayers();
        return true;
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось зарегистрироваться', variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось зарегистрироваться', variant: 'destructive' });
      return false;
    }
  };

  return {
    handleTeamRegister,
    handleIndividualRegister
  };
};
