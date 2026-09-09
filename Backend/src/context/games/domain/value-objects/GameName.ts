export class GameName {
  private readonly value: string;

  constructor(name: string) {
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      throw new Error('El nombre del videojuego debe tener al menos 2 caracteres');
    }

    if (trimmed.length > 50) {
      throw new Error('El nombre del videojuego no puede superar los 50 caracteres');
    }

    this.value = trimmed;
  }

  toString(): string {
    return this.value;
  }
}