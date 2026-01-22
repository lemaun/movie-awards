import 'dotenv/config';
import Database, { type Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../../data/movies.db');

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db: DatabaseType = new Database(DB_PATH);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      studios TEXT NOT NULL,
      producers TEXT NOT NULL,
      winner INTEGER NOT NULL DEFAULT 0,
      CHECK(winner IN (0, 1))
    )
  `;

  db.exec(createTableSQL);

  db.exec('CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_movies_winner ON movies(winner)');

  console.log('✅ Database initialized successfully');
}

export function clearDatabase() {
  db.exec('DELETE FROM movies');
  console.log('🗑️  Database cleared');
}

export function closeDatabase() {
  db.close();
}
