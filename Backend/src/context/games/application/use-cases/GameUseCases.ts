import { GameTemplate, GameTemplateDTO } from '../../domain/entities/GameTemplate';
import { GameName } from '../../domain/value-objects/GameName';
import { GameRules } from '../../domain/value-objects/GameRules';
import { GameTemplateRepository } from '../../domain/repositories/GameTemplateRepository';
import { GameTemplateNotFoundError } from '../../domain/exceptions/GameTemplateNotFoundError';
import { GameTemplateAlreadyExistsError } from '../../domain/exceptions/GameTemplateAlreadyExistsError';
import { CreateGameTemplateDTO } from '../dtos/CreateGameTemplateDTO';
import { UpdateGameTemplateDTO } from '../dtos/UpdateGameTemplateDTO';

function buildRules(data: CreateGameTemplateDTO): GameRules {
  return new GameRules({
    teamSize: data.teamSize,
    maxMembers: data.maxMembers,
    allowedSeriesLengths: data.allowedSeriesLengths,
    supportedPlatforms: data.supportedPlatforms,
    resultProvider: data.resultProvider,
  });
}

export class CreateGameTemplate {
  constructor(private readonly gameTemplateRepository: GameTemplateRepository) {}

  async execute(data: CreateGameTemplateDTO): Promise<GameTemplateDTO> {
    const name = new GameName(data.name);
    const rules = buildRules(data);

    const existing = await this.gameTemplateRepository.findByName(name.toString());
    if (existing) {
      throw new GameTemplateAlreadyExistsError(name.toString());
    }

    const gameTemplate = new GameTemplate(crypto.randomUUID(), name, rules);
    await this.gameTemplateRepository.save(gameTemplate);
    return gameTemplate.toDTO();
  }
}

export class UpdateGameTemplate {
  constructor(private readonly gameTemplateRepository: GameTemplateRepository) {}

  async execute(id: string, data: UpdateGameTemplateDTO): Promise<GameTemplateDTO> {
    const existing = await this.gameTemplateRepository.findById(id);
    if (!existing) {
      throw new GameTemplateNotFoundError(id);
    }

    const name = new GameName(data.name);
    const rules = buildRules(data);

    const sameName = await this.gameTemplateRepository.findByName(name.toString());
    if (sameName && sameName.id !== id) {
      throw new GameTemplateAlreadyExistsError(name.toString());
    }

    const updated = new GameTemplate(id, name, rules);
    await this.gameTemplateRepository.save(updated);
    return updated.toDTO();
  }
}

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

export class ListGameTemplates {
  constructor(private readonly gameTemplateRepository: GameTemplateRepository) {}

  async execute(): Promise<GameTemplateDTO[]> {
    const gameTemplates = await this.gameTemplateRepository.findAll();
    return gameTemplates.map((gt) => gt.toDTO());
  }
}