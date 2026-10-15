import { Team } from '../entities/Team';

export interface TeamRepository {
  findById(id: string): Promise<Team | null>;
  findByUserId(userId: string): Promise<Team[]>;
  isUserInAnyTeam(userId: string): Promise<boolean>;
  save(team: Team): Promise<void>;
}