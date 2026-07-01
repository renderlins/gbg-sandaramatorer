-- ============================================================
--  SK6AG – SDR-mottagare, de sex riktiga med direktlänkar.
--  OBS: tömmer tabellen först så gamla testrader (Grötö 2 m.fl.)
--  försvinner. Kör EFTER schema-sdr-lankar.sql.
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=seed-sdr-riktiga.sql
-- ============================================================

DELETE FROM sdr_mottagare;

INSERT INTO sdr_mottagare (namn, status, i_felanmalan, sortering, lank, kraver_inloggning) VALUES
  ('Oscar II Fort', 'drift', 1, 10, 'http://sk6ag5.ddns.net:8075/', 0),
  ('Grötö',         'drift', 1, 20, 'http://sk6ag3.ddns.net:8073/', 0),
  ('Öresten',       'drift', 1, 30, 'http://sk6ag4.ddns.net:8074/', 1),
  ('Svenljunga',    'drift', 1, 40, 'http://sk6ag1.ddns.net:8071/', 0),
  ('Borås nr 1',    'drift', 1, 50, 'http://sk6ag2.ddns.net:8072/', 0),
  ('Borås nr 2',    'drift', 1, 60, 'http://sk6ag6.ddns.net:8076/', 1);
