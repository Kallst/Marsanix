import { GameTemplate } from '../entities/GameTemplate';

export interface GameTemplateRepository {
  findById(id: string): Promise<GameTemplate | null>;
  findByName(name: string): Promise<GameTemplate | null>;
  findAll(): Promise<GameTemplate[]>;
  save(gameTemplate: GameTemplate): Promise<void>;
}