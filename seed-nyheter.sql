-- Seed: lägg in de tre befintliga nyheterna i databasen.
-- Kör EN gång efter schema.sql:
--   npx wrangler d1 execute sk6ag-db --file=seed-nyheter.sql

INSERT INTO news (datum, rubrik, text) VALUES
  ('2026-05-02', 'Månadsmöte i GSA den 4 maj',
   'Sista mötet innan sommaruppehållet. Kl. 19:00 på Radiomuseet — välkomna.'),
  ('2026-02-24', 'Månadsmöte den 2 mars',
   'På programmet: föredrag om Meshtastic — meddelandetrafik över lågeffektsradio.'),
  ('2026-01-08', 'Månadsmöte i januari',
   'Årets första möte. Alla välkomna — även gäster och nyfikna utan certifikat.');
