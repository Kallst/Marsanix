import { Team } from '../../domain/entities/Team';
import { TeamName } from '../../domain/value-objects/TeamName';
import { TeamRepository } from '../../domain/repositories/TeamRepository';
import { PlayerAlreadyInTeamError } from '../../domain/exceptions/PlayerAlreadyInTeamError';
import { CreateTeamDTO } from '../dtos/CreateTeamDTO';
import { TeamDTO } from '../../domain/entities/Team';

export class CreateTeam {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(data: CreateTeamDTO): Promise<TeamDTO> {
    const alreadyInTeam = await this.teamRepository.isUserInAnyTeam(data.creatorUserId);
    if (alreadyInTeam) {
      throw new PlayerAlreadyInTeamError(data.creatorUserId);
    }

    const team = new Team(
      crypto.randomUUID(),
      new TeamName(data.name),
      [data.creatorUserId],
    );

    await this.teamRepository.save(team);

    return team.toDTO();
  }
}