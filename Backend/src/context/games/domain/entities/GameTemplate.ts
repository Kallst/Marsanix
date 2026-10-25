import { GameName } from '../value-objects/GameName';
import { GameRules } from '../value-objects/GameRules';

export interface GameTemplateDTO {
  id: string;
  name: string;
  teamSize: number;
  maxMembers: number;
  allowedSeriesLengths: number[];
  supportedPlatforms: string[];
  resultProvider: string;
}

export class GameTemplate {
  constructor(
    public readonly id: string,
    public readonly name: GameName,
    public readonly rules: GameRules,
  ) {}

  get teamSize(): number {
    return this.rules.teamSize;
  }

  get maxMembers(): number {
    return this.rules.maxMembers;
  }

  toDTO(): GameTemplateDTO {
    return {
      id: this.id,
      name: this.name.toString(),
      teamSize: this.rules.teamSize,
      maxMembers: this.rules.maxMembers,
      allowedSeriesLengths: [...this.rules.allowedSeriesLengths],
      supportedPlatforms: [...this.rules.supportedPlatforms],
      resultProvider: this.rules.resultProvider,
    };
  }
}