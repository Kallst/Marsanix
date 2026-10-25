import { TeamName } from '../value-objects/TeamName';
import { NotTeamCaptainError } from '../exceptions/NotTeamCaptainError';
import { NotATeamMemberError } from '../exceptions/NotATeamMemberError';

export interface TeamDTO {
  id: string;
  name: string;
  captainId: string;
  memberIds: string[];
}

export class Team {
  constructor(
    public readonly id: string,
    public readonly name: TeamName,
    public readonly memberIds: string[],
    public readonly captainId: string,
  ) {}

  ensureCaptain(userId: string): void {
    if (this.captainId !== userId) {
      throw new NotTeamCaptainError(this.id);
    }
  }

  withMembers(memberIds: string[]): Team {
    return new Team(this.id, this.name, memberIds, this.captainId);
  }

  withCaptain(captainId: string): Team {
    if (!this.memberIds.includes(captainId)) {
      throw new NotATeamMemberError(this.id, captainId);
    }
    return new Team(this.id, this.name, this.memberIds, captainId);
  }

  toDTO(): TeamDTO {
    return {
      id: this.id,
      name: this.name.toString(),
      captainId: this.captainId,
      memberIds: this.memberIds,
    };
  }
}