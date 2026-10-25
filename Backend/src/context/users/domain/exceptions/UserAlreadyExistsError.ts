export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Ya existe un usuario registrado con el correo ${email}`);
    this.name = 'UserAlreadyExistsError';
  }
}