export class TeamNotFoundError extends Error {
  constructor(id: string) {
    super(`Equipo con id ${id} no encontrado`);
    this.name = 'TeamNotFoundError';
  }
}