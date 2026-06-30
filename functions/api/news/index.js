// /api/news
//   GET  – publik: returnerar alla nyheter, nyast först.
//   POST – kräver inloggning: skapar en nyhet.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT id, datum, rubrik, text FROM news ORDER BY datum DESC, id DESC"
  ).all();
  return json({ nyheter: results || [] });
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

  const datum = (body.datum || "").trim();
  const rubrik = (body.rubrik || "").trim();
  const text = (body.text || "").trim();

  if (!datum || !rubrik || !text) {
    return json({ fel: "Fyll i datum, rubrik och text." }, 400);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    return json({ fel: "Datum måste vara på formen ÅÅÅÅ-MM-DD." }, 400);
  }

  const res = await env.DB.prepare(
    "INSERT INTO news (datum, rubrik, text, skapad_av) VALUES (?, ?, ?, ?)"
  )
    .bind(datum, rubrik, text, user.id)
    .run();

  return json({ ok: true, id: res.meta.last_row_id }, 201);
}
