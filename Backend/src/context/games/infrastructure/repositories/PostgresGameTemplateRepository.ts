import { Pool } from 'pg';
import { GameTemplate } from '../../domain/entities/GameTemplate';
import { GameName } from '../../domain/value-objects/GameName';
import { GameTemplateRepository } from '../../domain/repositories/GameTemplateRepository';

export class PostgresGameTemplateRepository implements GameTemplateRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<GameTemplate | null> {
    const result = await this.pool.query(
      'SELECT id, name, team_size FROM game_templates WHERE id = $1',
      [id],
    );
    if (result.rowCount === 0) {
      return null;
    }
    const row = result.rows[0];
    return new GameTemplate(row.id, new GameName(row.name), row.team_size);
  }

  async findByName(name: string): Promise<GameTemplate | null> {
    const result = await this.pool.query(
      'SELECT id, name, team_size FROM game_templates WHERE name = $1',
      [name],
    );
    if (result.rowCount === 0) {
      return null;
    }
    const row = result.rows[0];
    return new GameTemplate(row.id, new GameName(row.name), row.team_size);
  }

  async findAll(): Promise<GameTemplate[]> {
    const result = await this.pool.query('SELECT id, name, team_size FROM game_templates');
    return result.rows.map((row) => new GameTemplate(row.id, new GameName(row.name), row.team_size));
  }

  async save(gameTemplate: GameTemplate): Promise<void> {
    await this.pool.query(
      `INSERT INTO game_templates (id, name, team_size) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, team_size = EXCLUDED.team_size`,
      [gameTemplate.id, gameTemplate.name.toString(), gameTemplate.teamSize],
    );
  }
}