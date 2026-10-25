import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenService } from '../../domain/repositories/UserRepository';
import { InvalidTokenError } from '../../domain/exceptions/InvalidTokenError';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: NonNullable<SignOptions['expiresIn']> = '1d',
  ) {}

  generate(userId: string): string {
    return jwt.sign({ sub: userId }, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): string {
    try {
      const payload = jwt.verify(token, this.secret, { algorithms: ['HS256'] });
      if (typeof payload === 'object' && typeof payload.sub === 'string') {
        return payload.sub;
      }
    } catch {
      // cualquier fallo de verificación se trata como token inválido
    }
    throw new InvalidTokenError();
  }
}