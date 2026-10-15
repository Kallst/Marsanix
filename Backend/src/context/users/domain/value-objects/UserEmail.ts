const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEmail {
  private readonly value: string;

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalized)) {
      throw new Error('El correo electrónico no tiene un formato válido');
    }

    if (normalized.length > 255) {
      throw new Error('El correo electrónico no puede superar los 255 caracteres');
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }
}