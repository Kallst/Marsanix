export class NotATeamMemberError extends Error {
  constructor(teamId: string, userId: string) {
    super(`El usuario ${userId} no es integrante del equipo ${teamId}`);
    this.name = 'NotATeamMemberError';
  }
}