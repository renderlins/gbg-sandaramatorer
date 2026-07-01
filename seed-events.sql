-- Testdata för evenemang (kan raderas senare via admin).
-- Framtida datum räknat från sommaren 2026.
INSERT INTO events (datum, tid, plats, typ, rubrik, text) VALUES
  ('2026-08-14', '19:00', 'Radiomuseet, Göteborg', 'mote',    'Månadsmöte', 'Föredrag, fika och prat om allt mellan antenn och jord. Nya medlemmar och gäster välkomna.'),
  ('2026-08-23', 'Hela helgen', NULL,                'contest', 'SAC CW – contesthelg', 'Vi kör Scandinavian Activity Contest tillsammans. Hör av dig om du vill vara med.'),
  ('2026-09-05', '18:00', 'Online + Radiomuseet',   'kurs',    'Instegskurs, träff 1', 'Första träffen i kursen inför instegscertifikatet. Anmälan via kontaktsidan.'),
  ('2026-09-20', '09:00', 'Fjärås Bräcka',          'faltdag', 'Fältdag vid Fjärås', 'Portabel drift i fält – POTA, antennbygge och grillning. Ta med dig radio eller bara nyfikenhet.');
