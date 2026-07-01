// /api/requests
//   POST – PUBLIK: tar emot en anmälan/donation från formuläret.
//          Enkel spam-broms via honeypot-fält ("webbplats").
//   GET  – KRÄVER inloggning: listar inkomna förfrågningar (senast först).
//          Innehåller personuppgifter – aldrig publikt.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

function bool(v) {
  return v === true || v === 1 || v === "1" || v === "on" ? 1 : 0;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  const { results } = await env.DB.prepare(
    "SELECT id, callsign, namn, epost, vill_bli_medlem, bidrag_repeater, bidrag_klubb, har_fraga, meddelande, hanterad, arende, galler, skapad FROM requests ORDER BY skapad DESC, id DESC"
  ).all();
  return json({ forfragningar: results || [] });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ fel: "Ogiltig förfrågan." }, 400);
  }

  // Honeypot: fältet "webbplats" är dolt i formuläret. Fylls det i är det en bot.
  // Vi svarar OK för att inte avslöja fällan, men sparar inget.
  if ((body.webbplats || "").trim() !== "") {
    return json({ ok: true }, 201);
  }

  const namn = (body.namn || "").trim();
  const epost = (body.epost || "").trim();
  const callsign = (body.callsign || "").trim().toUpperCase() || null;
  const meddelande = (body.meddelande || "").trim() || null;

  if (!namn || !epost) {
    return json({ fel: "Fyll i namn och e-postadress." }, 400);
  }
  // Lätt e-postkontroll (inte vattentät, men fångar uppenbara fel).
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epost)) {
    return json({ fel: "Ange en giltig e-postadress." }, 400);
  }

  const villBliMedlem = bool(body.vill_bli_medlem);
  const bidragRepeater = bool(body.bidrag_repeater);
  const bidragKlubb = bool(body.bidrag_klubb);
  const harFraga = bool(body.har_fraga);

  var arende = (body.arende || "medlem").trim();
  if (arende !== "felanmalan") arende = "medlem";
  const galler = (body.galler || "").trim() || null;

  await env.DB.prepare(
    "INSERT INTO requests (callsign, namn, epost, vill_bli_medlem, bidrag_repeater, bidrag_klubb, har_fraga, meddelande, arende, galler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(callsign, namn, epost, villBliMedlem, bidragRepeater, bidragKlubb, harFraga, meddelande, arende, galler)
    .run();

  return json({ ok: true }, 201);
}
