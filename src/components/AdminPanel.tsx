import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChallongeSettings } from './admin/ChallongeSettings';
import { RegistrationToggle } from './admin/RegistrationToggle';
import { PendingApplications } from './admin/PendingApplications';
import { ApprovedApplications } from './admin/ApprovedApplications';

interface Team {
  id: number;
  teamName: string;
  captainNick: string;
  captainTelegram: string;
  status: string;
  createdAt: string;
  isEdited?: boolean;
}

interface Player {
  id: number;
  nickname: string;
  telegram: string;
  preferredRoles: string[];
  status: string;
  createdAt: string;
  hasFriends?: boolean;
  friend1Nickname?: string;
  friend1Telegram?: string;
  friend1Roles?: string[];
  friend2Nickname?: string;
  friend2Telegram?: string;
  friend2Roles?: string[];
}

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingTeams: Team[];
  pendingPlayers: Player[];
  approvedTeams?: Team[];
  approvedPlayers?: Player[];
  registrationOpen: boolean;
  onToggleRegistration: (open: boolean) => void;
  onApproveTeam: (teamId: number) => void;
  onRejectTeam: (teamId: number) => void;
  onApprovePlayer: (playerId: number) => void;
  onRejectPlayer: (playerId: number) => void;
  onDeleteApprovedTeam?: (teamId: number) => void;
  onDeleteApprovedPlayer?: (playerId: number) => void;
  onEditApprovedTeam?: (teamId: number) => void;
  userRole: string;
  challongeUrl?: string;
  onChallongeUrlChange?: (url: string) => void;
}

export const AdminPanel = ({
  open,
  onOpenChange,
  pendingTeams,
  pendingPlayers,
  approvedTeams = [],
  approvedPlayers = [],
  registrationOpen,
  onToggleRegistration,
  onApproveTeam,
  onRejectTeam,
  onApprovePlayer,
  onRejectPlayer,
  onDeleteApprovedTeam,
  onDeleteApprovedPlayer,
  onEditApprovedTeam,
  userRole,
  challongeUrl,
  onChallongeUrlChange
}: AdminPanelProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Панель модерации</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <ChallongeSettings 
            challongeUrl={challongeUrl}
            onChallongeUrlChange={onChallongeUrlChange}
          />

          <RegistrationToggle 
            registrationOpen={registrationOpen}
            onToggleRegistration={onToggleRegistration}
          />

          <PendingApplications 
            pendingTeams={pendingTeams}
            pendingPlayers={pendingPlayers}
            onApproveTeam={onApproveTeam}
            onRejectTeam={onRejectTeam}
            onApprovePlayer={onApprovePlayer}
            onRejectPlayer={onRejectPlayer}
          />

          <ApprovedApplications 
            approvedTeams={approvedTeams}
            approvedPlayers={approvedPlayers}
            onDeleteApprovedTeam={onDeleteApprovedTeam}
            onDeleteApprovedPlayer={onDeleteApprovedPlayer}
            onEditApprovedTeam={onEditApprovedTeam}
            userRole={userRole}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
