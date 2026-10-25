import { Request, Response } from 'express';
import { UpdateGameTemplate } from '../../application/use-cases/GameUseCases';
import { GameTemplateAlreadyExistsError } from '../../domain/exceptions/GameTemplateAlreadyExistsError';
import { GameTemplateNotFoundError } from '../../domain/exceptions/GameTemplateNotFoundError';

export class UpdateGameTemplateController {
  constructor(private readonly updateGameTemplate: UpdateGameTemplate) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    if (typeof id !== 'string') {
      res.status(400).json({ message: 'id es requerido' });
      return;
    }

    try {
      const { name, teamSize, maxMembers, allowedSeriesLengths, supportedPlatforms, resultProvider } = req.body;
      const gameTemplate = await this.updateGameTemplate.execute(id, {
        name,
        teamSize,
        maxMembers,
        allowedSeriesLengths,
        supportedPlatforms,
        resultProvider,
      });
      res.status(200).json(gameTemplate);
    } catch (error) {
      if (error instanceof GameTemplateNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof GameTemplateAlreadyExistsError) {
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