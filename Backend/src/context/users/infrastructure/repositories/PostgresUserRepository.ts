import { Pool } from 'pg';
import { User } from '../../domain/entities/User';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserRepository } from '../../domain/repositories/UserRepository';

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
};

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  findById(id: string): Promise<User | null> {
    return this.findOneBy('id', id);
  }

  findByEmail(email: UserEmail): Promise<User | null> {
    return this.findOneBy('email', email.toString());
  }

  async save(user: User): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           email = EXCLUDED.email,
           password_hash = EXCLUDED.password_hash,
           updated_at = now()`,
      [user.id, user.name, user.email.toString(), user.passwordHash],
    );
  }

  private async findOneBy(column: 'id' | 'email', value: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>(
      `SELECT id, name, email, password_hash FROM users WHERE ${column} = $1`,
      [value],
    );
    const row = result.rows[0];
    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: UserRow): User {
    return new User(row.id, row.name, new UserEmail(row.email), row.password_hash);
  }
}