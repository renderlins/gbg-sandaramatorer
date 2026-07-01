// /api/sdr
//   GET  – publik: alla SDR-mottagare (sorterade).
//   POST – kräver inloggning: skapar en SDR-mottagare.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

const STATUSAR = ["drift", "ur_drift", "underhall"];

export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT * FROM sdr_mottagare ORDER BY sortering ASC, id ASC"
  ).all();
  return json({ mottagare: results || [] });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ fel: "Ogiltig förfrågan." }, 400); }

  const namn = (body.namn || "").trim();
  if (!namn) return json({ fel: "Ange ett namn." }, 400);

  const plats = (body.plats || "").trim() || null;
  const frekvens = (body.frekvens || "").trim() || null;
  const lank = (body.lank || "").trim() || null;
  const kraverInloggning = body.kraver_inloggning ? 1 : 0;
  let status = (body.status || "drift").trim();
  if (!STATUSAR.includes(status)) status = "drift";
  const iFelanmalan = body.i_felanmalan ? 1 : 0;
  let sortering = parseInt(body.sortering, 10);
  if (isNaN(sortering)) sortering = 100;

  const res = await env.DB.prepare(
    "INSERT INTO sdr_mottagare (namn, plats, frekvens, status, i_felanmalan, sortering, lank, kraver_inloggning) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(namn, plats, frekvens, status, iFelanmalan, sortering, lank, kraverInloggning).run();

  return json({ ok: true, id: res.meta.last_row_id }, 201);
}
