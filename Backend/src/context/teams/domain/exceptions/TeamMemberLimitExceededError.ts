export class TeamMemberLimitExceededError extends Error {
  constructor(teamId: string, limit: number) {
    super(`El equipo ${teamId} alcanzó el límite de ${limit} integrantes`);
    this.name = 'TeamMemberLimitExceededError';
  }
}