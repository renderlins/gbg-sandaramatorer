-- TESTDATA – påhittade anropssignaler, inga riktiga personer.
-- Raderas/ersätts när klubben beslutat om registret.
INSERT INTO members (callsign, status, betald_ar, noteringar) VALUES
  ('SA6AAA', 'medlem', 2026, NULL),
  ('SM6BBB', 'medlem', 2026, 'familjemedlemskap'),
  ('SM6CCC', 'medlem', 2025, NULL),
  ('SA6DDD', 'stod',   2026, 'stödjer repeatrar'),
  ('SM6EEE', 'medlem', NULL, 'ungdom, fri avgift'),
  ('SM6FFF', 'ej',     NULL, 'avslutat 2024');
