-- ============================================================
--  SK6AG – tilläggsschema: evenemang ("Kommande")
--  Körs separat, efter schema.sql (som redan finns i D1).
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=schema-events.sql
-- ============================================================

-- Evenemang: möten, contests, fältdagar, kurser, SVX-kvällar m.m.
-- Skiljer sig från news genom att vara framåtblickande: listor
-- filtreras på datum och sorteras stigande (närmast först).
CREATE TABLE IF NOT EXISTS events (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  datum     TEXT NOT NULL,                         -- 'YYYY-MM-DD'
  tid       TEXT,                                  -- t.ex. '19:00' (valfritt)
  plats     TEXT,                                  -- t.ex. 'Klubblokalen' (valfritt)
  typ       TEXT NOT NULL DEFAULT 'ovrigt',        -- mote|contest|faltdag|kurs|ovrigt
  rubrik    TEXT NOT NULL,
  text      TEXT NOT NULL,
  skapad    TEXT NOT NULL DEFAULT (datetime('now')),
  skapad_av INTEGER,
  FOREIGN KEY (skapad_av) REFERENCES users(id) ON DELETE SET NULL
);

-- Index för snabb filtrering/sortering på datum (båda riktningar används).
CREATE INDEX IF NOT EXISTS idx_events_datum ON events (datum);
