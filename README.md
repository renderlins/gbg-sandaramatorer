# SK6AG – hemsida med enkel nyhetshantering

Statisk sajt på **Cloudflare Pages** med **Decap CMS** så att ordföranden kan
lägga in nyheter via ett inloggat formulär – utan att röra kod.

Repo: `renderlins/gbg-sandaramatorer`

## Så här fungerar det för ordföranden (när allt är uppsatt)

1. Gå till `https://DIN-ADRESS.pages.dev/admin` (eller sk6ag.org/admin med egen domän)
2. Klicka **Logga in med GitHub**
3. Under **Nyheter → Senaste nytt**: klicka på **+** för att lägga till en nyhet
4. Fyll i **Datum**, **Rubrik** och **Text**
5. Klicka **Publish**

Sajten uppdateras automatiskt inom någon minut. Nyaste nyheten hamnar överst;
startsidan visar de tre senaste.

---

## Engångsuppsättning (du, en gång)

### 1. Skapa GitHub-repo (inloggad som `renderlins`)
- github.com -> **+** uppe till höger -> **New repository**
- Namn: `gbg-sandaramatorer`
- Public eller Private (båda funkar)
- Lämna README, .gitignore och License **omarkerade**
- **Create repository**

### 2. Pusha koden (VS Code-terminal i den här mappen)
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/renderlins/gbg-sandaramatorer.git
git push -u origin main
```
Om push:en ger **403 Permission denied** (macOS Keychain håller kvar gamla
`fiction3`-credentials), kör token-i-URL som workaround:
```
git remote set-url origin https://renderlins:DIN_TOKEN@github.com/renderlins/gbg-sandaramatorer.git
git push -u origin main
git remote set-url origin https://github.com/renderlins/gbg-sandaramatorer.git
```
(Token: github.com -> Settings -> Developer settings -> Personal access tokens ->
Tokens (classic) -> Generate new token, bara `repo`-scope.)

### 3. Koppla repot till Cloudflare Pages
- Cloudflare-dashboarden -> vänster: **Compute -> Workers & Pages**
- Blå **Create application**-knappen
- UI:t styr mot Workers – klicka i stället **"Looking to deploy Pages? Get started"** längst ner
- **Import an existing Git repository -> Get started** -> välj `gbg-sandaramatorer`
- Build-inställningar (ren statisk sajt, **inget bygge**):
  - Production branch: `main`
  - Framework preset: **None**
  - Build command: **tomt**
  - Build output directory: **`/`**
- **Save and Deploy**

### 4. (!) Notera din pages.dev-adress
Efter deployen får sajten en adress som `gbg-sandaramatorer-a1b.pages.dev`
(Cloudflare lägger till ett slumpsuffix). **Du behöver den exakta adressen i
nästa steg.**

### 5. Skapa GitHub OAuth-app
- GitHub -> **Settings -> Developer settings -> OAuth Apps -> New OAuth App**
- **Homepage URL:** `https://DIN-ADRESS.pages.dev`
- **Authorization callback URL:** `https://DIN-ADRESS.pages.dev/api/auth/callback`
- Spara. Notera **Client ID**, skapa en **Client secret**.

### 6. Lägg in nycklarna i Cloudflare
- Pages-projektet -> **Settings -> Environment variables** (Production):
  - `GITHUB_CLIENT_ID` = klient-ID:t
  - `GITHUB_CLIENT_SECRET` = hemligheten

### 7. Fyll i config.yml och pusha om
I `admin/config.yml`, ändra raden märkt `# <- ÄNDRA`:
- `base_url:` -> `https://DIN-ADRESS.pages.dev`

Sen: `git add . && git commit -m "Sätt base_url" && git push`
Cloudflare bygger om automatiskt.

### 8. Ge ordföranden tillgång
- Han behöver ett **GitHub-konto** med **skrivrättighet** till repot
  (repots Settings -> Collaborators -> lägg till honom).
- Sen kan han logga in på `/admin`.

### Egen domän (senare)
Pages-projektet -> **Custom domains** -> lägg till `sk6ag.org`.
**Glöm inte:** uppdatera då både `base_url` i config.yml och OAuth-appens två
URL:er till `https://sk6ag.org`.

---

## Filöversikt
```
gbg-sandaramatorer/
├── index.html              # startsidan (läser content/nyheter.json)
├── _headers                # Cloudflare: cacha aldrig nyhetsdatan
├── .gitignore
├── admin/
│   ├── index.html          # laddar Decap CMS
│   └── config.yml          # formulärfält + GitHub-koppling  <- base_url att fylla i
├── content/
│   └── nyheter.json        # alla nyheter (Decap skriver hit)
└── functions/api/auth/
    ├── index.js            # startar GitHub-inloggning
    └── callback.js         # tar emot inloggningen
```

## Bra att veta
- **Build output `/`, preset None** – ren statisk sajt utan byggsteg.
- **`functions/` är Pages Functions** (serverless) och plockas upp automatiskt –
  det är de som sköter OAuth. Inget att konfigurera utöver miljövariablerna.
- **Cache:** `_headers` ser till att nyhetsdatan aldrig cachas. Om något ändå
  hänger kvar: Cloudflare -> **Caching -> Purge Everything**.
- **Backup:** all historik finns i GitHub – inget kan gå förlorat.
- **Free tier räcker:** obegränsad bandbredd, 500 builds/mån, kommersiell
  användning tillåten.
