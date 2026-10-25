import { Request, Response } from 'express';
import { GetUserProfile } from '../../application/use-cases/GetUserProfile';
import { UserNotFoundError } from '../../domain/exceptions/UserNotFoundError';

export class GetUserProfileController {
  constructor(private readonly getUserProfile: GetUserProfile) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    if (typeof userId !== 'string') {
      res.status(400).json({ message: 'userId es requerido' });
      return;
    }

    try {
      const user = await this.getUserProfile.execute(userId);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}