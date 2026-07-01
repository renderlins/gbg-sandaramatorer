-- ============================================================
--  SK6AG – migrering: länkar för SDR-mottagare
--  Lägger till direktlänk (KiwiSDR-webbmottagare) och en flagga
--  för mottagare som kräver inloggning.
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=schema-sdr-lankar.sql
-- ============================================================

ALTER TABLE sdr_mottagare ADD COLUMN lank TEXT;                              -- URL till KiwiSDR-mottagaren
ALTER TABLE sdr_mottagare ADD COLUMN kraver_inloggning INTEGER NOT NULL DEFAULT 0;  -- 0/1
