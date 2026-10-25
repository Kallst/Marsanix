import bcrypt from 'bcrypt';
import { PasswordHasher } from '../../domain/repositories/UserRepository';

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  }

  compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}