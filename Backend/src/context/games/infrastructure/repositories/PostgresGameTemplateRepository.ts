import { Pool } from 'pg';
import { GameTemplate } from '../../domain/entities/GameTemplate';
import { GameName } from '../../domain/value-objects/GameName';
import { GameRules } from '../../domain/value-objects/GameRules';
import { GameTemplateRepository } from '../../domain/repositories/GameTemplateRepository';

interface GameTemplateRow {
  id: string;
  name: string;
  team_size: number;
  max_members: number;
  rules: {
    allowedSeriesLengths: number[];
    supportedPlatforms: string[];
    resultProvider: string;
  };
}

const COLUMNS = 'id, name, team_size, max_members, rules';

function toEntity(row: GameTemplateRow): GameTemplate {
  return new GameTemplate(
    row.id,
    new GameName(row.name),
    new GameRules({
      teamSize: row.team_size,
      maxMembers: row.max_members,
      allowedSeriesLengths: row.rules.allowedSeriesLengths,
      supportedPlatforms: row.rules.supportedPlatforms,
      resultProvider: row.rules.resultProvider,
    }),
  );
}

export class PostgresGameTemplateRepository implements GameTemplateRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<GameTemplate | null> {
    const result = await this.pool.query(`SELECT ${COLUMNS} FROM game_templates WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return null;
    }
    return toEntity(result.rows[0]);
  }

  async findByName(name: string): Promise<GameTemplate | null> {
    const result = await this.pool.query(`SELECT ${COLUMNS} FROM game_templates WHERE name = $1`, [name]);
    if (result.rowCount === 0) {
      return null;
    }
    return toEntity(result.rows[0]);
  }

  async findAll(): Promise<GameTemplate[]> {
    const result = await this.pool.query(`SELECT ${COLUMNS} FROM game_templates`);
    return result.rows.map(toEntity);
  }

  async save(gameTemplate: GameTemplate): Promise<void> {
    const { rules } = gameTemplate;
    await this.pool.query(
      `INSERT INTO game_templates (id, name, team_size, max_members, rules)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         team_size = EXCLUDED.team_size,
         max_members = EXCLUDED.max_members,
         rules = EXCLUDED.rules`,
      [
        gameTemplate.id,
        gameTemplate.name.toString(),
        rules.teamSize,
        rules.maxMembers,
        JSON.stringify({
          allowedSeriesLengths: rules.allowedSeriesLengths,
          supportedPlatforms: rules.supportedPlatforms,
          resultProvider: rules.resultProvider,
        }),
      ],
    );
  }
}