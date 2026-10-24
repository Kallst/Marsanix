import { Request, Response } from 'express';
import { LoginUser } from '../../application/use-cases/LoginUser';
import { InvalidCredentialsError } from '../../domain/exceptions/InvalidCredentialsError';

export class LoginController {
  constructor(private readonly loginUser: LoginUser) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUser.execute({ email, password });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        res.status(401).json({ message: error.message });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}