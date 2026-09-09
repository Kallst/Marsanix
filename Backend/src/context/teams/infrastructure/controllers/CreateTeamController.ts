import { Request, Response } from 'express';
import { CreateTeam } from '../../application/use-cases/CreateTeam';
import { PlayerAlreadyInTeamError } from '../../domain/exceptions/PlayerAlreadyInTeamError';

export class CreateTeamController {
  constructor(private readonly createTeam: CreateTeam) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, creatorUserId } = req.body;
      const team = await this.createTeam.execute({ name, creatorUserId });
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof PlayerAlreadyInTeamError) {
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