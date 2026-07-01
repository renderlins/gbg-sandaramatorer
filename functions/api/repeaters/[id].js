// /api/repeaters/:id
//   PATCH  – kräver inloggning: uppdaterar skickade fält.
//   DELETE – kräver inloggning: tar bort en repeater.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

const STATUSAR = ["drift", "ur_drift", "underhall"];
const TEXTFALT = ["namn","anropssignal","band","frekvens","lage","kanal_info","plats",
  "tx_antenn","tx_matare","sandare","slutsteg","rx_antenn","rx_matare","mottagare","oppningston","logik_not"];

export async function onRequestPatch(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  let body;
  try { body = await request.json(); } catch { return json({ fel: "Ogiltig förfrågan." }, 400); }

  const set = [];
  const bind = [];

  TEXTFALT.forEach((f) => {
    if (body[f] !== undefined) {
      const v = String(body[f]).trim();
      set.push(f + " = ?");
      bind.push(v || null);
    }
  });

  if (body.status !== undefined) {
    let status = String(body.status).trim();
    if (!STATUSAR.includes(status)) status = "drift";
    set.push("status = ?");
    bind.push(status);
  }
  if (body.i_felanmalan !== undefined) {
    set.push("i_felanmalan = ?");
    bind.push(body.i_felanmalan ? 1 : 0);
  }
  if (body.sortering !== undefined) {
    let s = parseInt(body.sortering, 10);
    if (isNaN(s)) s = 100;
    set.push("sortering = ?");
    bind.push(s);
  }

  if (!set.length) return json({ fel: "Inget att uppdatera." }, 400);

  bind.push(id);
  await env.DB.prepare("UPDATE repeaters SET " + set.join(", ") + " WHERE id = ?")
    .bind(...bind).run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  await env.DB.prepare("DELETE FROM repeaters WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
