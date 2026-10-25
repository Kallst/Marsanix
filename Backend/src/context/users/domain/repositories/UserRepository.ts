import { User } from '../entities/User';
import { UserEmail } from '../value-objects/UserEmail';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: UserEmail): Promise<User | null>;
  save(user: User): Promise<void>;
}

// Puertos de servicios externos: la implementación (bcrypt / jsonwebtoken)
// vive en infrastructure/services y se inyecta en los casos de uso.
export interface PasswordHasher {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, passwordHash: string): Promise<boolean>;
}

export interface TokenService {
  generate(userId: string): string;
  verify(token: string): string;
}