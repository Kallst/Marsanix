import { GameTemplate } from '../../domain/entities/GameTemplate';
import { GameName } from '../../domain/value-objects/GameName';
import { GameTemplateRepository } from '../../domain/repositories/GameTemplateRepository';
import { GameTemplateAlreadyExistsError } from '../../domain/exceptions/GameTemplateAlreadyExistsError';
import { CreateGameTemplateDTO } from '../dtos/CreateGameTemplateDTO';
import { GameTemplateDTO } from '../../domain/entities/GameTemplate';

export class CreateGameTemplate {
  constructor(private readonly gameTemplateRepository: GameTemplateRepository) {}

  async execute(data: CreateGameTemplateDTO): Promise<GameTemplateDTO> {
    const existing = await this.gameTemplateRepository.findByName(data.name);
    if (existing) {
      throw new GameTemplateAlreadyExistsError(data.name);
    }

    const gameTemplate = new GameTemplate(
      crypto.randomUUID(),
      new GameName(data.name),
      data.teamSize,
    );

    await this.gameTemplateRepository.save(gameTemplate);

    return gameTemplate.toDTO();
  }
}