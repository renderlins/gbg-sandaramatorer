# Deploy steg 1 – databas, inloggning, nyheter

Sajten ligger redan live via GitHub→Cloudflare. Det här lägger till databasen
och inloggningen. Du gör stegen i ordning; varje `wrangler`-kommando körs i
projektmappen i VS Code-terminalen.

## Förberedelse
Du behöver Wrangler (Cloudflares CLI). Kör en gång:
```
npm install -g wrangler
wrangler login
```
`wrangler login` öppnar webbläsaren – godkänn som ditt Cloudflare-konto.

## 1. Skapa databasen
```
npx wrangler d1 create sk6ag-db
```
Kommandot skriver ut ett **database_id** (en lång sträng). Kopiera det.

## 2. Klistra in database_id
Öppna `wrangler.toml` och byt ut `FYLLS-I-EFTER-ATT-DU-SKAPAT-DATABASEN`
mot id:t du fick.

## 3. Skapa tabellerna
```
npx wrangler d1 execute sk6ag-db --remote --file=schema.sql
```

## 4. Lägg in de befintliga nyheterna
```
npx wrangler d1 execute sk6ag-db --remote --file=seed-nyheter.sql
```

## 5. Skapa ditt adminkonto
Generera SQL:en (lösenordet skrivs aldrig till disk):
```
node skapa-admin.mjs din@epost.se "DittLösenord"
```
Skriptet skriver ut ett färdigt kommando. Kör det – men lägg till `--remote`:
```
npx wrangler d1 execute sk6ag-db --remote --command "INSERT INTO users ..."
```

## 6. Pusha koden
```
git add .
git commit -m "Steg 1: databas, inloggning, nyheter"
git push
```
Cloudflare bygger om automatiskt. **Viktigt:** för att Functions ska se
databasen måste D1-bindningen finnas i Pages-projektet. Om bindningen inte
plockas upp från wrangler.toml automatiskt, lägg till den manuellt:
Cloudflare-dashboarden → ditt Pages-projekt → **Settings → Functions →
D1 database bindings** → lägg till: Variable name `DB`, databas `sk6ag-db`.
Deploya om efter det.

## 7. Testa
- `https://gbg-sandaramatorer.pages.dev` – nyheterna ska visas som förut
  (nu från databasen).
- `https://gbg-sandaramatorer.pages.dev/admin` – logga in med kontot från
  steg 5. Posta en testnyhet, se att den dyker upp på startsidan, ta bort den.

## Felsökning
- **"Du måste vara inloggad" direkt efter login:** cookien kräver HTTPS.
  pages.dev är HTTPS, så det ska funka. Kollar du lokalt utan HTTPS fungerar
  inte session-cookien – testa på den riktiga pages.dev-adressen.
- **Nyheterna laddar inte / 500-fel på /api/news:** D1-bindningen saknas.
  Se steg 6, lägg till bindningen manuellt i dashboarden.
- **Se vad som finns i databasen:**
  `npx wrangler d1 execute sk6ag-db --remote --command "SELECT * FROM news"`
