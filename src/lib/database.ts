import { Database } from 'bun:sqlite';
import { logHandler } from '@/middleware/logger';

let db: Database | null = null;
let cleanupInterval: Timer | null = null;

export function getDatabase(): Database {
  if (!db) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.',
    );
  }
  return db;
}

export function initializeDatabase(path: string = 'app.db'): Database {
  if (db) {
    logHandler.debug('db', 'Database already initialized');
    return db;
  }

  try {
    db = new Database(path);
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA synchronous = NORMAL;');
    db.exec('PRAGMA foreign_keys = ON;');

    createTables();
    startCleanupScheduler();

    logHandler.info('db', 'SQLite database initialized successfully', { path });
    return db;
  } catch (error) {
    logHandler.error('db', 'Failed to initialize database', {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      path,
    });
    throw error;
  }
}

function createTables(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at INTEGER NOT NULL,
      last_login_at INTEGER
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_tokens_email ON tokens(email);
    CREATE INDEX IF NOT EXISTS idx_tokens_expires_at ON tokens(expires_at);
  `);

  logHandler.debug('db', 'Database tables created successfully');
}

function startCleanupScheduler(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }

  cleanupInterval = setInterval(() => {
    try {
      cleanupExpiredTokens();
    } catch (error) {
      logHandler.error('db', 'Failed to cleanup expired tokens', {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }
  }, 60000 * 15);

  logHandler.debug('db', 'Cleanup scheduler started (runs every 15 minutes)');
}

export function cleanupExpiredTokens(): void {
  const db = getDatabase();
  const deleteExpired = db.query(`
    DELETE FROM tokens WHERE expires_at < $now
  `);

  const result = deleteExpired.run({ $now: Date.now() });

  if (result.changes > 0) {
    logHandler.info('db', 'Cleaned up expired tokens', {
      count: result.changes,
    });
  }
}

export function closeDatabase(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }

  if (db) {
    db.close();
    db = null;
    logHandler.info('db', 'Database connection closed');
  }
}
