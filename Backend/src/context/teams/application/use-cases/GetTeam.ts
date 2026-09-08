import { TeamRepository } from '../../domain/repositories/TeamRepository';
import { TeamDTO } from '../../domain/entities/Team';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';

export class GetTeam {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(teamId: string): Promise<TeamDTO> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }

    return team.toDTO();
  }
}