import { Pool } from 'pg';
import { Team } from '../../domain/entities/Team';
import { TeamName } from '../../domain/value-objects/TeamName';
import { TeamRepository } from '../../domain/repositories/TeamRepository';

export class PostgresTeamRepository implements TeamRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Team | null> {
    const teamResult = await this.pool.query(
      'SELECT id, name FROM teams WHERE id = $1',
      [id],
    );
    if (teamResult.rowCount === 0) {
      return null;
    }

    const memberIds = await this.getMemberIds(id);
    const row = teamResult.rows[0];
    return new Team(row.id, new TeamName(row.name), memberIds);
  }

  async findByUserId(userId: string): Promise<Team[]> {
    const result = await this.pool.query(
      `SELECT t.id, t.name
       FROM teams t
       JOIN team_members tm ON tm.team_id = t.id
       WHERE tm.user_id = $1`,
      [userId],
    );

    const teams: Team[] = [];
    for (const row of result.rows) {
      const memberIds = await this.getMemberIds(row.id);
      teams.push(new Team(row.id, new TeamName(row.name), memberIds));
    }
    return teams;
  }

  async isUserInAnyTeam(userId: string): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT 1 FROM team_members WHERE user_id = $1',
      [userId],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async save(team: Team): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO teams (id, name) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [team.id, team.name.toString()],
      );

      await client.query('DELETE FROM team_members WHERE team_id = $1', [team.id]);

      for (const userId of team.memberIds) {
        await client.query(
          'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
          [team.id, userId],
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async getMemberIds(teamId: string): Promise<string[]> {
    const result = await this.pool.query(
      'SELECT user_id FROM team_members WHERE team_id = $1',
      [teamId],
    );
    return result.rows.map((row) => row.user_id);
  }
}