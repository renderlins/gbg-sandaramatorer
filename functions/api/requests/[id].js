// /api/requests/:id
//   PATCH  – kräver inloggning: markerar hanterad (eller ohanterad).
//   DELETE – kräver inloggning: tar bort en förfrågan.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

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

  if (body.hanterad === undefined) return json({ fel: "Inget att uppdatera." }, 400);
  const hanterad = body.hanterad ? 1 : 0;

  await env.DB.prepare("UPDATE requests SET hanterad = ? WHERE id = ?")
    .bind(hanterad, id)
    .run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  await env.DB.prepare("DELETE FROM requests WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
