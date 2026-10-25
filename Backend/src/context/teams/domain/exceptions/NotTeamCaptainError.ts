export class NotTeamCaptainError extends Error {
  constructor(teamId: string) {
    super(`Solo el capitán del equipo ${teamId} puede realizar esta acción`);
    this.name = 'NotTeamCaptainError';
  }
}