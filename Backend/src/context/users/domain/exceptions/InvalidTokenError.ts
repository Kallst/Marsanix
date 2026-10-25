export class InvalidTokenError extends Error {
  constructor() {
    super('Token inválido o expirado');
    this.name = 'InvalidTokenError';
  }
}