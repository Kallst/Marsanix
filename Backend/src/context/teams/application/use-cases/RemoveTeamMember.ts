import { TeamRepository } from '../../domain/repositories/TeamRepository';
import { Team, TeamDTO } from '../../domain/entities/Team';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';

export class RemoveTeamMember {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(teamId: string, userId: string): Promise<TeamDTO> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }

    const updatedTeam = new Team(
      team.id,
      team.name,
      team.memberIds.filter((id) => id !== userId),
    );

    await this.teamRepository.save(updatedTeam);

    return updatedTeam.toDTO();
  }
}