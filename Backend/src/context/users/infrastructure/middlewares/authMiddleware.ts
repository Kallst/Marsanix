import { NextFunction, Request, RequestHandler, Response } from 'express';
import { TokenService } from '../../domain/repositories/UserRepository';
import { InvalidTokenError } from '../../domain/exceptions/InvalidTokenError';

const BEARER_PREFIX = 'Bearer ';

export function createAuthenticate(tokenService: TokenService): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith(BEARER_PREFIX)) {
      res.status(401).json({ message: 'Token de autenticación requerido' });
      return;
    }

    try {
      res.locals.userId = tokenService.verify(header.slice(BEARER_PREFIX.length));
      next();
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}

export const requireSameUser: RequestHandler = (req, res, next) => {
  if (res.locals.userId !== req.params.userId) {
    res.status(403).json({ message: 'No tienes permiso para acceder a este usuario' });
    return;
  }
  next();
};