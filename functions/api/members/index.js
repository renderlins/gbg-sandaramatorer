// /api/members
//   GET  – KRÄVER inloggning: returnerar alla medlemmar (sorterade på callsign).
//          Till skillnad från news/events är detta INTE publikt – registret
//          innehåller personuppgifter och får bara läsas av administratörer.
//   POST – kräver inloggning: lägger till en medlem.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

const STATUSAR = ["medlem", "stod", "ej"];

export async function onRequestGet(context) {
  const { request, env } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const { results } = await env.DB.prepare(
    "SELECT id, callsign, status, betald_ar, noteringar FROM members ORDER BY callsign ASC"
  ).all();
  return json({ medlemmar: results || [] });
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

  const callsign = (body.callsign || "").trim().toUpperCase();
  let status = (body.status || "medlem").trim();
  if (!STATUSAR.includes(status)) status = "medlem";
  const noteringar = (body.noteringar || "").trim() || null;

  let betaldAr = null;
  if (body.betald_ar !== undefined && body.betald_ar !== null && String(body.betald_ar).trim() !== "") {
    const ar = parseInt(body.betald_ar, 10);
    if (!isNaN(ar) && ar >= 1900 && ar <= 2100) betaldAr = ar;
  }

  if (!callsign) {
    return json({ fel: "Ange en anropssignal." }, 400);
  }

  const res = await env.DB.prepare(
    "INSERT INTO members (callsign, status, betald_ar, noteringar, skapad_av) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(callsign, status, betaldAr, noteringar, user.id)
    .run();

  return json({ ok: true, id: res.meta.last_row_id }, 201);
}
