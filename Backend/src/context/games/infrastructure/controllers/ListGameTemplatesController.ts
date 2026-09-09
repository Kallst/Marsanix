import { Request, Response } from 'express';
import { ListGameTemplates } from '../../application/use-cases/ListGameTemplates';

export class ListGameTemplatesController {
  constructor(private readonly listGameTemplates: ListGameTemplates) {}

  handle = async (_req: Request, res: Response): Promise<void> => {
    try {
      const gameTemplates = await this.listGameTemplates.execute();
      res.status(200).json(gameTemplates);
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}