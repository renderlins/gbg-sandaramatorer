// /api/members/:id
//   PATCH  – kräver inloggning: uppdaterar status, betald_ar och/eller noteringar.
//   DELETE – kräver inloggning: tar bort en medlem.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

const STATUSAR = ["medlem", "stod", "ej"];

export async function onRequestPatch(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ fel: "Ogiltig förfrågan." }, 400);
  }

  // Bygg dynamisk uppdatering av bara de fält som skickats.
  const set = [];
  const bind = [];

  if (body.status !== undefined) {
    let status = String(body.status).trim();
    if (!STATUSAR.includes(status)) status = "medlem";
    set.push("status = ?");
    bind.push(status);
  }

  if (body.betald_ar !== undefined) {
    let betaldAr = null;
    if (body.betald_ar !== null && String(body.betald_ar).trim() !== "") {
      const ar = parseInt(body.betald_ar, 10);
      if (!isNaN(ar) && ar >= 1900 && ar <= 2100) betaldAr = ar;
    }
    set.push("betald_ar = ?");
    bind.push(betaldAr);
  }

  if (body.noteringar !== undefined) {
    const noteringar = String(body.noteringar).trim() || null;
    set.push("noteringar = ?");
    bind.push(noteringar);
  }

  if (!set.length) return json({ fel: "Inget att uppdatera." }, 400);

  bind.push(id);
  await env.DB.prepare("UPDATE members SET " + set.join(", ") + " WHERE id = ?")
    .bind(...bind)
    .run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  await env.DB.prepare("DELETE FROM members WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
