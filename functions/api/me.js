// GET /api/me – returnerar inloggad användare, eller 401.
import { hamtaAnvandare, json } from "../_lib/auth.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ inloggad: false }, 401);
  return json({ inloggad: true, epost: user.email, roll: user.roll });
}
