import { Request, Response } from 'express';
import { RemoveTeamMember } from '../../application/use-cases/RemoveTeamMember';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';

export class RemoveTeamMemberController {
  constructor(private readonly removeTeamMember: RemoveTeamMember) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId, userId } = req.params;
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