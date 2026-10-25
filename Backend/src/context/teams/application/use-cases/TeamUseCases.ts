import { Team, TeamDTO } from '../../domain/entities/Team';
import { TeamName } from '../../domain/value-objects/TeamName';
import { TeamRepository } from '../../domain/repositories/TeamRepository';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';
import { PlayerAlreadyInTeamError } from '../../domain/exceptions/PlayerAlreadyInTeamError';
import { TeamMemberLimitExceededError } from '../../domain/exceptions/TeamMemberLimitExceededError';
import { CaptainCannotLeaveTeamError } from '../../domain/exceptions/CaptainCannotLeaveTeamError';
import { CreateTeamDTO } from '../dtos/CreateTeamDTO';

const MAX_MEMBERS = 5; // ajustar según la plantilla del videojuego (F03) más adelante

export class CreateTeam {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(data: CreateTeamDTO): Promise<TeamDTO> {
    const alreadyInTeam = await this.teamRepository.isUserInAnyTeam(data.creatorUserId);
    if (alreadyInTeam) {
      throw new PlayerAlreadyInTeamError(data.creatorUserId);
    }

    const team = new Team(crypto.randomUUID(), new TeamName(data.name), [data.creatorUserId], data.creatorUserId);
    await this.teamRepository.save(team);
    return team.toDTO();
  }
}

export class AddTeamMember {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(teamId: string, userId: string, requesterId: string): Promise<TeamDTO> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }
    team.ensureCaptain(requesterId);

    const alreadyInTeam = await this.teamRepository.isUserInAnyTeam(userId);
    if (alreadyInTeam) {
      throw new PlayerAlreadyInTeamError(userId);
    }

    if (team.memberIds.length >= MAX_MEMBERS) {
      throw new TeamMemberLimitExceededError(teamId, MAX_MEMBERS);
    }

    const updatedTeam = team.withMembers([...team.memberIds, userId]);
    await this.teamRepository.save(updatedTeam);
    return updatedTeam.toDTO();
  }
}

export class RemoveTeamMember {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(teamId: string, userId: string, requesterId: string): Promise<TeamDTO> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }
    team.ensureCaptain(requesterId);

    if (userId === team.captainId) {
      throw new CaptainCannotLeaveTeamError(teamId);
    }

    const updatedTeam = team.withMembers(team.memberIds.filter((id) => id !== userId));
    await this.teamRepository.save(updatedTeam);
    return updatedTeam.toDTO();
  }
}

export class TransferTeamCaptain {
  constructor(private readonly teamRepository: TeamRepository) {}

  async execute(teamId: string, newCaptainId: string, requesterId: string): Promise<TeamDTO> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }
    team.ensureCaptain(requesterId);

    const updatedTeam = team.withCaptain(newCaptainId);
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