import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SQLite database
const db = new Database(join(__dirname, 'activities.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create USERS table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create/Update ACTIVITIES table
// Note: In development, we can drop/recreate or modify.
// For now, we'll keep it simple: users need to clear DB or we add column if missing
// But to ensure integrity with the new auth system, we'll recreate the table properly linked.
// Create ACTIVITIES table with user_id
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    duration INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// MIGRATION: Check if user_id exists, if not add it
try {
  const columns = db.pragma('table_info(activities)');
  const hasUserId = columns.some(col => col.name === 'user_id');

  if (!hasUserId) {
    console.log('🔄 Migrating database: Adding user_id column...');
    db.exec(`ALTER TABLE activities ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
    console.log('✅ Migration successful');
  }
} catch (error) {
  console.error('Migration failed:', error);
}

console.log('✅ Database initialized successfully');

export default db;
