-- ============================================================
--  SK6AG – tilläggsschema: SDR-mottagare
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=schema-sdr.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS sdr_mottagare (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  namn          TEXT NOT NULL,                       -- t.ex. 'Svenljunga'
  plats         TEXT,                                -- valfritt
  frekvens      TEXT,                                -- valfritt
  status        TEXT NOT NULL DEFAULT 'drift',       -- drift|ur_drift|underhall
  i_felanmalan  INTEGER NOT NULL DEFAULT 1,          -- 0/1
  sortering     INTEGER NOT NULL DEFAULT 100,
  skapad        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sdr_sort ON sdr_mottagare (sortering, id);
