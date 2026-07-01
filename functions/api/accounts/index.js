// /api/accounts
//   GET  – kräver inloggning: listar adminkonton (id + e-post, ALDRIG hashar).
//   POST – kräver inloggning: skapar ett nytt adminkonto.
import { hamtaAnvandare, json, nyttSalt, hashaLosenord } from "../../_lib/auth.js";

export async function onRequestGet(context) {
  const { request, env } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const { results } = await env.DB.prepare(
    "SELECT id, email, skapad FROM users ORDER BY email ASC"
  ).all();
  // Markera vilket konto som är den inloggade (får ej raderas av sig själv).
  const konton = (results || []).map((k) => ({
    id: k.id,
    email: k.email,
    skapad: k.skapad,
    jag: k.id === user.id,
  }));
  return json({ konton });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ fel: "Ogiltig förfrågan." }, 400);
  }

  const epost = (body.epost || "").trim().toLowerCase();
  const losenord = (body.losenord || "").trim();

  if (!epost || !losenord) {
    return json({ fel: "Fyll i e-post och lösenord." }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epost)) {
    return json({ fel: "Ange en giltig e-postadress." }, 400);
  }
  if (losenord.length < 8) {
    return json({ fel: "Lösenordet måste vara minst 8 tecken." }, 400);
  }

  // Finns e-posten redan?
  const finns = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(epost)
    .first();
  if (finns) {
    return json({ fel: "Ett konto med den e-posten finns redan." }, 409);
  }

  const salt = nyttSalt();
  const hash = await hashaLosenord(losenord, salt);

  const res = await env.DB.prepare(
    "INSERT INTO users (email, password_hash, salt, roll) VALUES (?, ?, ?, 'admin')"
  )
    .bind(epost, hash, salt)
    .run();

  return json({ ok: true, id: res.meta.last_row_id }, 201);
}
