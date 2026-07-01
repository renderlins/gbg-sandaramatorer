// DELETE /api/events/:id – kräver inloggning, tar bort ett evenemang.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  await env.DB.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
