import { Request, Response } from 'express';
import { ListTeamsByUser } from '../../application/use-cases/ListTeamsByUser';

export class ListTeamsByUserController {
  constructor(private readonly listTeamsByUser: ListTeamsByUser) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const teams = await this.listTeamsByUser.execute(req.params.userId);
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}