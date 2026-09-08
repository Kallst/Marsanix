export class TeamName {
  private readonly value: string;

  constructor(name: string) {
    const trimmed = name.trim();

    if (trimmed.length < 3) {
      throw new Error('El nombre del equipo debe tener al menos 3 caracteres');
    }

    if (trimmed.length > 30) {
      throw new Error('El nombre del equipo no puede superar los 30 caracteres');
    }

    this.value = trimmed;
  }

  toString(): string {
    return this.value;
  }
}