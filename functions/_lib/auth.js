// ============================================================
//  Delade auth-hjälpfunktioner (Cloudflare Pages Functions)
//  Lösenordshashning, sessionshantering, cookies.
//  Använder Web Crypto som finns inbyggt i Workers-miljön.
// ============================================================

const PBKDF2_ITERATIONS = 100000;
const SESSION_DAGAR = 30;

// --- Lösenord ---------------------------------------------------------------

// Skapar ett slumpmässigt salt (hex-sträng).
export function nyttSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Hashar ett lösenord med PBKDF2 + SHA-256. Returnerar hex-sträng.
export async function hashaLosenord(losenord, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(losenord),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return [...new Uint8Array(bits)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Jämför lösenord mot lagrad hash. Konstant tid via length-säker jämförelse.
export async function kollaLosenord(losenord, salt, forvantadHash) {
  const hash = await hashaLosenord(losenord, salt);
  if (hash.length !== forvantadHash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) {
    diff |= hash.charCodeAt(i) ^ forvantadHash.charCodeAt(i);
  }
  return diff === 0;
}

// --- Sessioner --------------------------------------------------------------

// Skapar en ny session i databasen och returnerar token + utgångstid.
export async function skapaSession(db, userId) {
  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
  const giltigTom = new Date(
    Date.now() + SESSION_DAGAR * 24 * 60 * 60 * 1000
  ).toISOString();
  await db
    .prepare("INSERT INTO sessions (token, user_id, giltig_tom) VALUES (?, ?, ?)")
    .bind(token, userId, giltigTom)
    .run();
  return { token, giltigTom };
}

// Hämtar inloggad användare utifrån session-cookien. null om ej inloggad.
export async function hamtaAnvandare(request, db) {
  const token = lasCookie(request, "session");
  if (!token) return null;
  const rad = await db
    .prepare(
      `SELECT u.id, u.email, u.roll, s.giltig_tom
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`
    )
    .bind(token)
    .first();
  if (!rad) return null;
  if (new Date(rad.giltig_tom) < new Date()) {
    // Utgången – städa bort den.
    await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return null;
  }
  return { id: rad.id, email: rad.email, roll: rad.roll };
}

// Tar bort en session (utloggning).
export async function raderaSession(request, db) {
  const token = lasCookie(request, "session");
  if (token) {
    await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  }
}

// --- Cookies ----------------------------------------------------------------

// Bygger en säker session-cookie-header.
export function sessionCookie(token, giltigTom) {
  const maxAge = Math.floor(
    (new Date(giltigTom).getTime() - Date.now()) / 1000
  );
  return (
    `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );
}

// Cookie som rensar sessionen.
export function rensaCookie() {
  return "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
}

// Läser en cookie ur request-headern.
export function lasCookie(request, namn) {
  const header = request.headers.get("Cookie") || "";
  for (const del of header.split(";")) {
    const [k, ...v] = del.trim().split("=");
    if (k === namn) return v.join("=");
  }
  return null;
}

// --- Hjälp ------------------------------------------------------------------

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}
