import { Request, Response } from 'express';
import { TransferTeamCaptain } from '../../application/use-cases/TeamUseCases';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';
import { NotTeamCaptainError } from '../../domain/exceptions/NotTeamCaptainError';
import { NotATeamMemberError } from '../../domain/exceptions/NotATeamMemberError';

export class TransferTeamCaptainController {
  constructor(private readonly transferTeamCaptain: TransferTeamCaptain) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const teamId = req.params.teamId;
    const { userId } = req.body;

    if (typeof teamId !== 'string' || typeof userId !== 'string') {
      res.status(400).json({ message: 'teamId y userId son requeridos' });
      return;
    }

    try {
      const team = await this.transferTeamCaptain.execute(teamId, userId, res.locals.userId);
      res.status(200).json(team);
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof NotTeamCaptainError) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error instanceof NotATeamMemberError) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}