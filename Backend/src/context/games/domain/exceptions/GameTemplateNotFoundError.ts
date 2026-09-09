export class GameTemplateNotFoundError extends Error {
  constructor(id: string) {
    super(`Plantilla de videojuego con id ${id} no encontrada`);
    this.name = 'GameTemplateNotFoundError';
  }
}