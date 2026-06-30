-- ============================================================
--  SK6AG – databasschema (Cloudflare D1)
--  Steg 1: konton, sessioner, nyheter.
--  Kör med:  npx wrangler d1 execute sk6ag-db --file=schema.sql
-- ============================================================

-- Användarkonton. Lösenord lagras ALDRIG i klartext – endast som
-- PBKDF2-hash (kolumnen password_hash) tillsammans med ett unikt salt.
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt          TEXT NOT NULL,
  roll          TEXT NOT NULL DEFAULT 'admin',   -- 'admin' = får posta nyheter
  skapad        TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Inloggningssessioner. En rad per aktiv inloggning.
-- token ligger i en HttpOnly-cookie hos användaren.
CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  skapad      TEXT NOT NULL DEFAULT (datetime('now')),
  giltig_tom  TEXT NOT NULL,                      -- utgångstid (ISO)
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Nyheter. Flyttas hit från content/nyheter.json.
CREATE TABLE IF NOT EXISTS news (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  datum   TEXT NOT NULL,                          -- 'YYYY-MM-DD'
  rubrik  TEXT NOT NULL,
  text    TEXT NOT NULL,
  skapad  TEXT NOT NULL DEFAULT (datetime('now')),
  skapad_av INTEGER,
  FOREIGN KEY (skapad_av) REFERENCES users(id) ON DELETE SET NULL
);

-- Index för snabb sortering av nyheter (nyast först).
CREATE INDEX IF NOT EXISTS idx_news_datum ON news (datum DESC);

-- Index för att städa utgångna sessioner.
CREATE INDEX IF NOT EXISTS idx_sessions_giltig ON sessions (giltig_tom);
