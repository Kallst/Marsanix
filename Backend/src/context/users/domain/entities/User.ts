import { UserEmail } from '../value-objects/UserEmail';

export class User {
  public readonly name: string;

  constructor(
    public readonly id: string,
    name: string,
    public readonly email: UserEmail,
    public readonly passwordHash: string,
  ) {
    this.name = User.validateName(name);
  }

  changeName(name: string): User {
    return new User(this.id, name, this.email, this.passwordHash);
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      throw new Error('El nombre del usuario debe tener al menos 2 caracteres');
    }

    if (trimmed.length > 100) {
      throw new Error('El nombre del usuario no puede superar los 100 caracteres');
    }

    return trimmed;
  }
}