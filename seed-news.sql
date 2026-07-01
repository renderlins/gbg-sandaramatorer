-- ============================================================
--  SK6AG – klubbens nyheter (seed från originalsidan)
--  10 nyheter, nov 2025 – juni 2026. "Silent Key" (dödsfall) är
--  medvetet utelämnad. Signaturer behållna i texten.
--  Kör med:  npx wrangler d1 execute sk6ag-db --remote --file=seed-news.sql
--
--  OBS: lägger till nyheterna. Kör bara EN gång, annars dubbleras de.
--  Vill du börja om rent: kör  DELETE FROM news;  först.
-- ============================================================

INSERT INTO news (datum, rubrik, text) VALUES
('2026-06-27', 'Behöver du ny radio?',
'Annons SM6DAS – finns att ladda ner. Kontakta klubben för mer information.'),

('2026-05-02', 'Månadsmöte i GSA den 4 maj',
'Sista mötet innan sommaruppehållet kl. 19.00 på Radiomuseet.

Det finns många som har QSL-kort att hämta:

SA6NAN, SM6ETH, SM6EHL, SA6WAJ/SB6M, SM6ERS, SM6GHS, SA6BWF, SA6BUQ, SM6RII, SM6BWH, SM6SUB, SA6LHA, SM6P, SA6JSL, SA6JHN, 8S6DH VIA SM6FRJ, SM6DVZ, SM6UAF, SM6BLT, SB6M, SM6J, SM6EAQ, SA6KML, SM6GHS, SC6O, SA6NIA, SM6DPF, SM6KVE, SM6XMM, SM6CMD, SM6XRY, SM6NZA, SM6BLT, SM6DAS, SA6CBN, SA6KML

Välkommen hälsar Styrelsen'),

('2026-02-24', 'Månadsmöte den 2 mars',
'Välkommen till GSA:s möte på Radiomuseet i Göteborg, vi startar kl 19.00 och avslutar c:a 21.00.

På programmet bl.a. föredrag om Meshtastic, ett system oberoende av internet för meddelandetrafik av olika former via lowpower-utrustning.'),

('2026-01-24', 'Årsmöte i GSA',
'Den 2 februari kl. 19.00 på Radiomuseet i Göteborg har vi årsmöte. Boka in ett besök då.

Välkommen!
Hälsar Styrelsen'),

('2026-01-08', 'Månadsmöte jan 2026',
'Nytt år och 1:a mötet för året, vi träffas som vanligt på Radiomuseet i Göteborg kl. 19.00 måndagen den 12 januari.

Alla är välkomna även gäster. Under hösten har det tillkommit ett antal nya amatörer som kanske behöver hjälp att komma igång. Vi ska dela med oss av vår kunskap till dom som är nya i vår hobby.'),

('2025-12-17', 'God Jul och Gott Nytt År',
'Med förhoppningar om en trevlig helg och ett bra nytt år till dig och din familj.

Hälsningar
Styrelsen i GSA'),

('2025-12-14', 'Video om att komma igång med FreeDV',
'Att köra digitalt på VHF och UHF har vi gjort länge, både med DMR, D-STAR och fusion/C4FM men på kortvåg då? Någon kanske provat D-STAR på kortvåg men det kräver ju en Icom-radio.

FreeDV ger digital röstkommunikation över kortvåg men även VHF och UHF fungerar. Kräver rätt liten bandbredd och ljudet är helt ok.

FreeDV är helt gratis att använda och öppen källkod. Fungerar på alla riggar som kan kopplas till dator. Kan du köra t.ex. FT8 kan du köra FreeDV. Är du nyfiken så spana in en video där vi får en genomgång hur det ser ut och fungerar att köra FreeDV. Det är klubben W6EK (www.w6ek.org) som lagt ut videon på YouTube.

Det som är bra med detta är att både nya och äldre apparater kan användas. Och riktigt nya SDR-apparater kan t.o.m. ha FreeDV redan inbyggt som trafiksätt.

Hälsar Tony SM6XGP.'),

('2025-12-10', 'Allt mellan antenn och jord',
'Lyssna på podden från Synskadades Riksförbund med Tony SM6XGP där han intervjuas om amatörradio.

http://radio.srf.nu/arkiv/2025/1208.html'),

('2025-11-11', 'Amatörradioprogram för Linux',
'Kör du Linux och funderar på om det finns bra program för amatörradio?

Här har vi svaret. Andys Hamradio Linux är en samling med de flesta program du kan tänka dig. Här finns FT8, riggstyrning, loggprogram och mycket mer. Testat på Debian 13 och det funkar finfint att installera.

I en video guidas du igenom stegen för att hämta programmen och komma igång: "Linux and Ham Radio – A walk through installing Andy''s ham radio linux."

73 de SM6XGP Tony');
