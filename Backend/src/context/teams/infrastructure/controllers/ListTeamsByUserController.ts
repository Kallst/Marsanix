import { Request, Response } from 'express';
import { ListTeamsByUser } from '../../application/use-cases/TeamUseCases';

export class ListTeamsByUserController {
  constructor(private readonly listTeamsByUser: ListTeamsByUser) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    if (typeof userId !== 'string') {
      res.status(400).json({ message: 'userId es requerido' });
      return;
    }

    try {
      const teams = await this.listTeamsByUser.execute(userId);
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}