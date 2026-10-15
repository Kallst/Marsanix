export class UserPassword {
  private readonly value: string;

  constructor(password: string) {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    this.value = password;
  }

  toString(): string {
    return this.value;
  }
}