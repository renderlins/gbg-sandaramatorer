// /api/repeaters
//   GET  – publik: alla repeatrar (sorterade). Driver repeatersida + felanmälan.
//   POST – kräver inloggning: skapar en repeater.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

const STATUSAR = ["drift", "ur_drift", "underhall"];
const FALT = ["namn","anropssignal","band","frekvens","lage","kanal_info","plats",
  "tx_antenn","tx_matare","sandare","slutsteg","rx_antenn","rx_matare","mottagare","oppningston","logik_not"];

export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT * FROM repeaters ORDER BY sortering ASC, id ASC"
  ).all();
  return json({ repeatrar: results || [] });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ fel: "Ogiltig förfrågan." }, 400); }

  const namn = (body.namn || "").trim();
  if (!namn) return json({ fel: "Ange ett namn." }, 400);

  let status = (body.status || "drift").trim();
  if (!STATUSAR.includes(status)) status = "drift";
  const iFelanmalan = body.i_felanmalan ? 1 : 0;
  let sortering = parseInt(body.sortering, 10);
  if (isNaN(sortering)) sortering = 100;

  const varden = FALT.map((f) => {
    const v = (body[f] || "").trim();
    return v || null;
  });

  const kolumner = FALT.concat(["status", "i_felanmalan", "sortering"]);
  const placeholders = kolumner.map(() => "?").join(", ");
  const bind = varden.concat([status, iFelanmalan, sortering]);

  const res = await env.DB.prepare(
    "INSERT INTO repeaters (" + kolumner.join(", ") + ") VALUES (" + placeholders + ")"
  ).bind(...bind).run();

  return json({ ok: true, id: res.meta.last_row_id }, 201);
}
