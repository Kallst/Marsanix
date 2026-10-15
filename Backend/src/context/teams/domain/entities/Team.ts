import { TeamName } from '../value-objects/TeamName';

export interface TeamDTO {
  id: string;
  name: string;
  memberIds: string[];
}

export class Team {
  constructor(
    public readonly id: string,
    public readonly name: TeamName,
    public readonly memberIds: string[],
  ) {}

  toDTO(): TeamDTO {
    return {
      id: this.id,
      name: this.name.toString(),
      memberIds: this.memberIds,
    };
  }
}