import { TeamRepository } from '../../domain/repositories/TeamRepository';
import { TeamDTO } from '../../domain/entities/Team';

export class ListTeamsByUser {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(userId: string): Promise<TeamDTO[]> {
    const teams = await this.teamRepository.findByUserId(userId);
    return teams.map((team) => team.toDTO());
  }
}