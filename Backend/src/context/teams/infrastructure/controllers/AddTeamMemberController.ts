import { Request, Response } from 'express';
import { AddTeamMember } from '../../application/use-cases/AddTeamMember';
import { TeamNotFoundError } from '../../domain/exceptions/TeamNotFoundError';
import { PlayerAlreadyInTeamError } from '../../domain/exceptions/PlayerAlreadyInTeamError';
import { TeamMemberLimitExceededError } from '../../domain/exceptions/TeamMemberLimitExceededError';

export class AddTeamMemberController {
  constructor(private readonly addTeamMember: AddTeamMember) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.params;
      const { userId } = req.body;
      const team = await this.addTeamMember.execute(teamId, userId);
      res.status(200).json(team);
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof PlayerAlreadyInTeamError || error instanceof TeamMemberLimitExceededError) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}