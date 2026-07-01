// /api/accounts/:id
//   POST   – kräver inloggning: återställer lösenordet. Genererar ett
//            tillfälligt lösenord, returnerar det EN gång i klartext så
//            admin kan läsa upp det. Endast hashen lagras.
//   DELETE – kräver inloggning: tar bort ett konto. Spärrat mot att
//            radera sitt eget konto eller det sista kvarvarande kontot.
import { hamtaAnvandare, json, nyttSalt, hashaLosenord } from "../../_lib/auth.js";

// Genererar ett läsbart tillfälligt lösenord (utan lättförväxlade tecken).
function tillfalligtLosenord() {
  const tecken = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  let ut = "";
  for (let i = 0; i < bytes.length; i++) ut += tecken[bytes[i] % tecken.length];
  return ut;
}

export async function onRequestPost(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  const konto = await env.DB.prepare("SELECT id, email FROM users WHERE id = ?")
    .bind(id)
    .first();
  if (!konto) return json({ fel: "Kontot finns inte." }, 404);

  const nyttLosen = tillfalligtLosenord();
  const salt = nyttSalt();
  const hash = await hashaLosenord(nyttLosen, salt);

  await env.DB.prepare("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?")
    .bind(hash, salt, id)
    .run();

  // Rensa personens aktiva sessioner så gamla inloggningar inte lever kvar.
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();

  // Returnerar lösenordet EN gång – det går inte att hämta igen.
  return json({ ok: true, epost: konto.email, tillfalligt: nyttLosen });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const id = parseInt(params.id, 10);
  if (!id) return json({ fel: "Ogiltigt id." }, 400);

  // Spärr 1: inte sitt eget konto.
  if (id === user.id) {
    return json({ fel: "Du kan inte ta bort ditt eget konto." }, 400);
  }

  // Spärr 2: inte det sista kontot.
  const antal = await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first();
  if (antal && antal.n <= 1) {
    return json({ fel: "Det måste finnas minst ett konto." }, 400);
  }

  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
