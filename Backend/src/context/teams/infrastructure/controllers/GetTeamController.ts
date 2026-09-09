import { Request, Response } from 'express';
import { GetTeam } from '../../application/use-cases/GetTeam';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';

export class GetTeamController {
  constructor(private readonly getTeam: GetTeam) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await this.getTeam.execute(req.params.teamId);
      res.status(200).json(team);
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}