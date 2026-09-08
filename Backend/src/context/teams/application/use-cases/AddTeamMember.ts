import { TeamRepository } from '../../domain/repositories/TeamRepository';
import { Team, TeamDTO } from '../../domain/entities/Team';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';
import { PlayerAlreadyInTeamError } from '../../domain/exceptions/PlayerAlreadyInTeamError';
import { TeamMemberLimitExceededError } from '../../domain/exceptions/TeamMemberLimitExceededError';

const MAX_MEMBERS = 5; // ajustar según la plantilla del videojuego (F03) más adelante

export class AddTeamMember {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(teamId: string, userId: string): Promise<TeamDTO> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }

    const alreadyInTeam = await this.teamRepository.isUserInAnyTeam(userId);
    if (alreadyInTeam) {
      throw new PlayerAlreadyInTeamError(userId);
    }

    if (team.memberIds.length >= MAX_MEMBERS) {
      throw new TeamMemberLimitExceededError(teamId, MAX_MEMBERS);
    }

    const updatedTeam = new Team(team.id, team.name, [...team.memberIds, userId]);
    await this.teamRepository.save(updatedTeam);

    return updatedTeam.toDTO();
  }
}