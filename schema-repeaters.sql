-- ============================================================
--  SK6AG – tilläggsschema: repeatrar
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=schema-repeaters.sql
--
--  Driver både frekvenstabellen och tekniksektionen på repeatersidan,
--  samt kryssrutorna i felanmälan (de med i_felanmalan = 1).
--  GET är publikt; ändringar kräver inloggning.
-- ============================================================

CREATE TABLE IF NOT EXISTS repeaters (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  namn          TEXT NOT NULL,                       -- t.ex. 'SK6AG DMR'
  anropssignal  TEXT,                                -- t.ex. 'SK6AG'
  band          TEXT,                                -- t.ex. '70 cm'
  frekvens      TEXT,                                -- t.ex. '434.7875 MHz'
  lage          TEXT,                                -- mode: DMR|D-STAR|C4FM|FM|TX|RX|...
  kanal_info    TEXT,                                -- t.ex. 'RU383 (−2 MHz), CC6'
  plats         TEXT,                                -- 'Guldheden' | 'Kortedala'
  status        TEXT NOT NULL DEFAULT 'drift',       -- drift|ur_drift|underhall
  i_felanmalan  INTEGER NOT NULL DEFAULT 1,          -- 0/1 – visas som kryssruta i felanmälan
  sortering     INTEGER NOT NULL DEFAULT 100,        -- lägre visas först
  -- Tekniska specar (valfria, ändras sällan)
  tx_antenn     TEXT,
  tx_matare     TEXT,
  sandare       TEXT,
  slutsteg      TEXT,
  rx_antenn     TEXT,
  rx_matare     TEXT,
  mottagare     TEXT,
  oppningston   TEXT,
  logik_not     TEXT,
  skapad        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_repeaters_sort ON repeaters (sortering, id);
