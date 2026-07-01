-- ============================================================
--  SK6AG – tilläggsschema: medlemsförfrågningar ("Bli medlem")
--  Körs separat, efter schema.sql.
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=schema-requests.sql
--
--  Tar emot anmälningar/donationer från det publika formuläret.
--  POST är publikt (vem som helst kan skicka in), men listan får
--  ENDAST läsas av inloggade administratörer – den innehåller
--  personuppgifter (namn + e-post).
-- ============================================================

CREATE TABLE IF NOT EXISTS requests (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  callsign         TEXT,                              -- valfritt (alla har inte signal än)
  namn             TEXT NOT NULL,
  epost            TEXT NOT NULL,
  vill_bli_medlem  INTEGER NOT NULL DEFAULT 0,        -- 0/1 (kryssruta)
  bidrag_repeater  INTEGER NOT NULL DEFAULT 0,        -- 0/1
  bidrag_klubb     INTEGER NOT NULL DEFAULT 0,        -- 0/1
  har_fraga        INTEGER NOT NULL DEFAULT 0,        -- 0/1
  meddelande       TEXT,                              -- valfritt
  hanterad         INTEGER NOT NULL DEFAULT 0,        -- 0/1, admin bockar av
  skapad           TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index för att visa senast inkomna först.
CREATE INDEX IF NOT EXISTS idx_requests_skapad ON requests (skapad DESC);
