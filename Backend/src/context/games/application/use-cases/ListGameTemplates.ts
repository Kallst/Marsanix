import { GameTemplateRepository } from '../../domain/repositories/GameTemplateRepository';
import { GameTemplateDTO } from '../../domain/entities/GameTemplate';

export class ListGameTemplates {
  constructor(private readonly gameTemplateRepository: GameTemplateRepository) {}

  async execute(): Promise<GameTemplateDTO[]> {
    const gameTemplates = await this.gameTemplateRepository.findAll();
    return gameTemplates.map((gt) => gt.toDTO());
  }
}