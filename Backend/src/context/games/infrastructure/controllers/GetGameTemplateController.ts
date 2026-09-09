import { Request, Response } from 'express';
import { GetGameTemplate } from '../../application/use-cases/GetGameTemplate';
import { GameTemplateNotFoundError } from '../../domain/exceptions/GameTemplateNotFoundError';

export class GetGameTemplateController {
  constructor(private readonly getGameTemplate: GetGameTemplate) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const gameTemplate = await this.getGameTemplate.execute(req.params.id);
      res.status(200).json(gameTemplate);
    } catch (error) {
      if (error instanceof GameTemplateNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}