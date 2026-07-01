-- ============================================================
--  SK6AG – tilläggsschema: medlemsregister (endast admin)
--  Körs separat, efter schema.sql.
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=schema-members.sql
--
--  OBS: Detta register innehåller personuppgifter (en anropssignal
--  är kopplad till en namngiven innehavare). Det får ENDAST läsas
--  och ändras av inloggade administratörer – aldrig publikt.
-- ============================================================

CREATE TABLE IF NOT EXISTS members (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  callsign   TEXT NOT NULL,                          -- t.ex. 'SM6XYZ'
  status     TEXT NOT NULL DEFAULT 'medlem',         -- medlem|stod|ej
  betald_ar  INTEGER,                                -- år avgiften senast gäller, t.ex. 2026 (null = ej betald)
  noteringar TEXT,                                   -- fritt fält (valfritt), t.ex. 'familj', 'ungdom'
  skapad     TEXT NOT NULL DEFAULT (datetime('now')),
  skapad_av  INTEGER,
  FOREIGN KEY (skapad_av) REFERENCES users(id) ON DELETE SET NULL
);

-- Index för sortering/uppslag på anropssignal.
CREATE INDEX IF NOT EXISTS idx_members_callsign ON members (callsign);
