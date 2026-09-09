import { Request, Response } from 'express';
import { CreateGameTemplate } from '../../application/use-cases/CreateGameTemplate';
import { GameTemplateAlreadyExistsError } from '../../domain/exceptions/GameTemplateAlreadyExistsError';

export class CreateGameTemplateController {
  constructor(private readonly createGameTemplate: CreateGameTemplate) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, teamSize } = req.body;
      const gameTemplate = await this.createGameTemplate.execute({ name, teamSize });
      res.status(201).json(gameTemplate);
    } catch (error) {
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