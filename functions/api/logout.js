// POST /api/logout – rensar sessionen.
import { raderaSession, rensaCookie, json } from "../_lib/auth.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  await raderaSession(request, env.DB);
  return json({ ok: true }, 200, { "Set-Cookie": rensaCookie() });
}
