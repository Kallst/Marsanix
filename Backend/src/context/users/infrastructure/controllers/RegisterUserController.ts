import { Request, Response } from 'express';
import { RegisterUser } from '../../application/use-cases/RegisterUser';
import { UserAlreadyExistsError } from '../../domain/exceptions/UserAlreadyExistsError';

export class RegisterUserController {
  constructor(private readonly registerUser: RegisterUser) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const user = await this.registerUser.execute({ name, email, password });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        res.status(409).json({ message: error.message });
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