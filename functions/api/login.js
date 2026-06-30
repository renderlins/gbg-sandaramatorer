// POST /api/login  – e-post + lösenord, sätter session-cookie.
import {
  kollaLosenord,
  skapaSession,
  sessionCookie,
  json,
} from "../_lib/auth.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ fel: "Ogiltig förfrågan." }, 400);
  }

  const epost = (body.epost || "").trim().toLowerCase();
  const losenord = body.losenord || "";

  if (!epost || !losenord) {
    return json({ fel: "Fyll i e-post och lösenord." }, 400);
  }

  const user = await env.DB.prepare(
    "SELECT id, password_hash, salt FROM users WHERE email = ?"
  )
    .bind(epost)
    .first();

  // Samma svar oavsett om e-posten finns eller inte – läck inte vilka konton som finns.
  if (!user) {
    return json({ fel: "Fel e-post eller lösenord." }, 401);
  }

  const ok = await kollaLosenord(losenord, user.salt, user.password_hash);
  if (!ok) {
    return json({ fel: "Fel e-post eller lösenord." }, 401);
  }

  const { token, giltigTom } = await skapaSession(env.DB, user.id);
  return json({ ok: true }, 200, {
    "Set-Cookie": sessionCookie(token, giltigTom),
  });
}
