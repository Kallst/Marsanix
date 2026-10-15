export class PlayerAlreadyInTeamError extends Error {
  constructor(userId: string) {
    super(`El jugador ${userId} ya pertenece a un equipo`);
    this.name = 'PlayerAlreadyInTeamError';
  }
}