import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenService } from '../../domain/repositories/UserRepository';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: NonNullable<SignOptions['expiresIn']> = '1d',
  ) {}

  generate(userId: string): string {
    return jwt.sign({ sub: userId }, this.secret, { expiresIn: this.expiresIn });
  }
}