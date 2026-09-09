import { GameTemplateRepository } from '../../domain/repositories/GameTemplateRepository';
import { GameTemplateDTO } from '../../domain/entities/GameTemplate';
import { GameTemplateNotFoundError } from '../../domain/exceptions/GameTemplateNotFoundError';

export class GetGameTemplate {
  constructor(private readonly gameTemplateRepository: GameTemplateRepository) {}

  async execute(id: string): Promise<GameTemplateDTO> {
    const gameTemplate = await this.gameTemplateRepository.findById(id);
    if (!gameTemplate) {
      throw new GameTemplateNotFoundError(id);
    }
    return gameTemplate.toDTO();
  }
}