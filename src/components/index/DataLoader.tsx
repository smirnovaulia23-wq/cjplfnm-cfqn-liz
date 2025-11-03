export const useDataLoader = (teamsUrl: string, settingsUrl: string) => {
  const loadApprovedTeams = async () => {
    try {
      const response = await fetch(`${teamsUrl}?status=approved`, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data.teams || [];
    } catch (error) {
      return [];
    }
  };

  const loadPendingTeams = async () => {
    try {
      const response = await fetch(`${teamsUrl}?status=pending`, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data.teams || [];
    } catch (error) {
      return [];
    }
  };

  const loadIndividualPlayers = async () => {
    try {
      const response = await fetch(`${teamsUrl}?type=individual`, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (!response.ok) {
        return { approved: [], pending: [] };
      }
      const data = await response.json();
      const approved = (data.players || []).filter((p: any) => p.status === 'approved');
      const pending = (data.players || []).filter((p: any) => p.status === 'pending');
      return { approved, pending };
    } catch (error) {
      return { approved: [], pending: [] };
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch(settingsUrl, {
        mode: 'cors',
        credentials: 'omit'
      });
      if (!response.ok) {
        return {
          registrationOpen: true,
          challongeUrl: '',
          homeTitle: 'League of Legends: Wild Rift',
          homeSubtitle: 'Турнир 5x5',
          homeDescription: 'Соберите команду и докажите своё мастерство в «Диком ущелье»',
          tournamentInfo: {}
        };
      }
      const data = await response.json();
      
      let tournamentInfo = {};
      try {
        tournamentInfo = JSON.parse(data.settings?.tournament_info || '{}');
      } catch {
        tournamentInfo = {};
      }

      return {
        registrationOpen: data.settings?.registration_open === 'true',
        challongeUrl: data.settings?.challonge_url || '',
        homeTitle: data.settings?.home_title || 'League of Legends: Wild Rift',
        homeSubtitle: data.settings?.home_subtitle || 'Турнир 5x5',
        homeDescription: data.settings?.home_description || 'Соберите команду и докажите своё мастерство в «Диком ущелье»',
        tournamentInfo
      };
    } catch (error) {
      return {
        registrationOpen: true,
        challongeUrl: '',
        homeTitle: 'League of Legends: Wild Rift',
        homeSubtitle: 'Турнир 5x5',
        homeDescription: 'Соберите команду и докажите своё мастерство в «Диком ущелье»',
        tournamentInfo: {}
      };
    }
  };

  return {
    loadApprovedTeams,
    loadPendingTeams,
    loadIndividualPlayers,
    loadSettings
  };
};
