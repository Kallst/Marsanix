export class CaptainCannotLeaveTeamError extends Error {
  constructor(teamId: string) {
    super(`El capitán del equipo ${teamId} no puede ser quitado; primero debe transferir la capitanía`);
    this.name = 'CaptainCannotLeaveTeamError';
  }
}