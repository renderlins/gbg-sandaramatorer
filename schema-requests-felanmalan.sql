-- ============================================================
--  SK6AG – migrering: felanmälan i requests
--  Lägger till fält så att förfrågningar kan skilja på medlemsärende
--  och felanmälan, samt vilka repeatrar/mottagare felanmälan gäller.
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=schema-requests-felanmalan.sql
-- ============================================================

ALTER TABLE requests ADD COLUMN arende TEXT NOT NULL DEFAULT 'medlem';   -- medlem|felanmalan
ALTER TABLE requests ADD COLUMN galler TEXT;                              -- vilka repeatrar/SDR (text), för felanmälan
