import { Request, Response } from 'express';
import { UpdateUserProfile } from '../../application/use-cases/UpdateUserProfile';
import { UserNotFoundError } from '../../domain/exceptions/UserNotFoundError';

export class UpdateUserProfileController {
  constructor(private readonly updateUserProfile: UpdateUserProfile) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const { name } = req.body;

    if (typeof userId !== 'string' || typeof name !== 'string') {
      res.status(400).json({ message: 'userId y name son requeridos' });
      return;
    }

    try {
      const user = await this.updateUserProfile.execute(userId, { name });
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
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