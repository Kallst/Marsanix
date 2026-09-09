import { GameName } from '../value-objects/GameName';

export interface GameTemplateDTO {
  id: string;
  name: string;
  teamSize: number;
}

export class GameTemplate {
  constructor(
    public readonly id: string,
    public readonly name: GameName,
    public readonly teamSize: number,
  ) {}

  toDTO(): GameTemplateDTO {
    return {
      id: this.id,
      name: this.name.toString(),
      teamSize: this.teamSize,
    };
  }
}