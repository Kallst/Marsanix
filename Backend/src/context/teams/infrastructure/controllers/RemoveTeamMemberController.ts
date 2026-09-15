import { Request, Response } from 'express';
import { RemoveTeamMember } from '../../application/use-cases/TeamUseCases';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';

export class RemoveTeamMemberController {
  constructor(private readonly removeTeamMember: RemoveTeamMember) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const { teamId, userId } = req.params;

    if (typeof teamId !== 'string' || typeof userId !== 'string') {
      res.status(400).json({ message: 'teamId y userId son requeridos' });
      return;
    }

    try {
      const team = await this.removeTeamMember.execute(teamId, userId);
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