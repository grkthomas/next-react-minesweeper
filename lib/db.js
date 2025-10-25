// SQLite database setup using better-sqlite3
import fs from "fs"
import path from "path"
import Database from "better-sqlite3"

const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "scores.sqlite")

// Ensure the data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function initDb() {
  ensureDataDir()

  const db = new Database(DB_PATH)
  // Recommended pragmas for small apps
  db.pragma("journal_mode = WAL")
  db.pragma("synchronous = NORMAL")

  // Create scores table if it doesn't exist
  db.prepare(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mines INTEGER NOT NULL,
      size TEXT NOT NULL,
      time INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run()

  // Index to speed up leaderboard queries
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_scores_leaderboard ON scores (size, time ASC, created_at DESC)`).run()

  return db
}

// Keep a single instance during dev hot-reloads
const globalForDb = globalThis
const db = globalForDb.__scoresDb || initDb()
if (!globalForDb.__scoresDb) globalForDb.__scoresDb = db

export function getDb() {
  return db
}

export function insertScore({ name, mines, size, time }) {
  const stmt = db.prepare(
    `INSERT INTO scores (name, mines, size, time) VALUES (@name, @mines, @size, @time)`
  )
  const info = stmt.run({ name, mines, size, time })
  return info.lastInsertRowid
}

export function getTopScores({ limit = 10, size } = {}) {
  if (size) {
    return db
      .prepare(
        `SELECT id, name, mines, size, time, created_at FROM scores WHERE size = @size ORDER BY time ASC, created_at DESC LIMIT @limit`
      )
      .all({ size, limit })
  }
  return db
    .prepare(
      `SELECT id, name, mines, size, time, created_at FROM scores ORDER BY time ASC, created_at DESC LIMIT @limit`
    )
    .all({ limit })
}

export function getRecentScores({ limit = 20 } = {}) {
  return db
    .prepare(
      `SELECT id, name, mines, size, time, created_at FROM scores ORDER BY created_at DESC LIMIT @limit`
    )
    .all({ limit })
}
