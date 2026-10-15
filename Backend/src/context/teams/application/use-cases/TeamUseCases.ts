import { Team, TeamDTO } from '../../domain/entities/Team';
import { TeamName } from '../../domain/value-objects/TeamName';
import { TeamRepository } from '../../domain/repositories/TeamRepository';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';
import { PlayerAlreadyInTeamError } from '../../domain/exceptions/PlayerAlreadyInTeamError';
import { TeamMemberLimitExceededError } from '../../domain/exceptions/TeamMemberLimitExceededError';
import { CreateTeamDTO } from '../dtos/CreateTeamDTO';

const MAX_MEMBERS = 5; // ajustar según la plantilla del videojuego (F03) más adelante

export class CreateTeam {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(data: CreateTeamDTO): Promise<TeamDTO> {
    const alreadyInTeam = await this.teamRepository.isUserInAnyTeam(data.creatorUserId);
    if (alreadyInTeam) {
      throw new PlayerAlreadyInTeamError(data.creatorUserId);
    }

    const team = new Team(crypto.randomUUID(), new TeamName(data.name), [data.creatorUserId]);
    await this.teamRepository.save(team);
    return team.toDTO();
  }
}

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

export class ListTeamsByUser {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(userId: string): Promise<TeamDTO[]> {
    const teams = await this.teamRepository.findByUserId(userId);
    return teams.map((team) => team.toDTO());
  }
}