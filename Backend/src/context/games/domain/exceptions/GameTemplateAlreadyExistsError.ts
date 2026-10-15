export class GameTemplateAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Ya existe una plantilla para el videojuego ${name}`);
    this.name = 'GameTemplateAlreadyExistsError';
  }
}