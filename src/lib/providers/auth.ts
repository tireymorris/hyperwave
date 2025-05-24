import { logHandler } from '@/middleware/logger';
import { v4 as uuid } from 'uuid';
import { getDatabase, initializeDatabase } from '@/lib/database';
import { env } from '@/utils/env';

interface User {
  id: string;
  email: string;
  createdAt: Date;
  lastLoginAt?: Date | undefined;
}

export interface AuthProvider {
  createUser(email: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateLastLogin(id: string): Promise<boolean>;
  storeToken(
    token: string,
    email: string,
    expiresInSeconds: number,
  ): Promise<void>;
  validateToken(token: string, email: string): Promise<boolean>;
  invalidateToken(token: string): Promise<void>;
}

class SQLiteAuthProvider implements AuthProvider {
  private db = getDatabase();

  async createUser(email: string): Promise<User> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      return existingUser;
    }

    const now = Date.now();
    const user: User = {
      id: uuid(),
      email,
      createdAt: new Date(now),
      lastLoginAt: new Date(now),
    };

    const insertUser = this.db.query(`
      INSERT INTO users (id, email, created_at, last_login_at)
      VALUES ($id, $email, $createdAt, $lastLoginAt)
    `);

    insertUser.run({
      $id: user.id,
      $email: user.email,
      $createdAt: now,
      $lastLoginAt: now,
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const getUser = this.db.query(`
      SELECT id, email, created_at, last_login_at
      FROM users
      WHERE email = $email
    `);

    const row = getUser.get({ $email: email }) as
      | {
          id: string;
          email: string;
          created_at: number;
          last_login_at: number | null;
        }
      | undefined;

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      createdAt: new Date(row.created_at),
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : undefined,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const getUser = this.db.query(`
      SELECT id, email, created_at, last_login_at
      FROM users
      WHERE id = $id
    `);

    const row = getUser.get({ $id: id }) as
      | {
          id: string;
          email: string;
          created_at: number;
          last_login_at: number | null;
        }
      | undefined;

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      createdAt: new Date(row.created_at),
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : undefined,
    };
  }

  async updateLastLogin(id: string): Promise<boolean> {
    const updateQuery = this.db.query(`
      UPDATE users 
      SET last_login_at = $lastLoginAt 
      WHERE id = $id
    `);

    const result = updateQuery.run({
      $id: id,
      $lastLoginAt: Date.now(),
    });

    return result.changes > 0;
  }

  async storeToken(
    token: string,
    email: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    const insertToken = this.db.query(`
      INSERT OR REPLACE INTO tokens (token, email, expires_at)
      VALUES ($token, $email, $expiresAt)
    `);

    insertToken.run({
      $token: token,
      $email: email,
      $expiresAt: expiresAt,
    });
  }

  async validateToken(token: string, email: string): Promise<boolean> {
    const getToken = this.db.query(`
      SELECT email, expires_at
      FROM tokens
      WHERE token = $token
    `);

    const tokenData = getToken.get({ $token: token }) as
      | {
          email: string;
          expires_at: number;
        }
      | undefined;

    if (!tokenData) {
      return false;
    }

    if (tokenData.email !== email) {
      return false;
    }

    if (tokenData.expires_at < Date.now()) {
      await this.invalidateToken(token);
      return false;
    }

    return true;
  }

  async invalidateToken(token: string): Promise<void> {
    const deleteToken = this.db.query(`
      DELETE FROM tokens WHERE token = $token
    `);

    deleteToken.run({ $token: token });
  }
}

let authProvider: AuthProvider | null = null;

export async function initializeAuthProvider(): Promise<void> {
  initializeDatabase(env('DATABASE_PATH'));
  authProvider = new SQLiteAuthProvider();
  logHandler.info(
    'api',
    `Auth provider initialized: ${authProvider.constructor.name}`,
  );
}

export async function getAuthProvider(): Promise<AuthProvider> {
  if (!authProvider) {
    await initializeAuthProvider();
  }

  if (!authProvider) throw new Error('Auth provider not initialized');

  return authProvider;
}
