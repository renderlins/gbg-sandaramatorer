// /api/events
//   GET  – publik. ?scope=upcoming (standard) | past | all
//          upcoming: datum >= idag, stigande (närmast först)
//          past:     datum <  idag, fallande (senast passerade först)
//          all:      allt, stigande
//   POST – kräver inloggning: skapar ett evenemang.
import { hamtaAnvandare, json } from "../../_lib/auth.js";

const TYPER = ["mote", "contest", "faltdag", "kurs", "ovrigt"];

export async function onRequestGet(context) {
  const { env, request } = context;
  const scope = new URL(request.url).searchParams.get("scope") || "upcoming";
  const idag = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)

  let sql;
  if (scope === "past") {
    sql = "SELECT id, datum, tid, plats, typ, rubrik, text FROM events WHERE datum < ? ORDER BY datum DESC, id DESC";
  } else if (scope === "all") {
    sql = "SELECT id, datum, tid, plats, typ, rubrik, text FROM events ORDER BY datum ASC, id ASC";
  } else {
    sql = "SELECT id, datum, tid, plats, typ, rubrik, text FROM events WHERE datum >= ? ORDER BY datum ASC, id ASC";
  }

  const stmt = scope === "all"
    ? env.DB.prepare(sql)
    : env.DB.prepare(sql).bind(idag);

  const { results } = await stmt.all();
  return json({ evenemang: results || [] });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const user = await hamtaAnvandare(request, env.DB);
  if (!user) return json({ fel: "Du måste vara inloggad." }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ fel: "Ogiltig förfrågan." }, 400);
  }

  const datum = (body.datum || "").trim();
  const rubrik = (body.rubrik || "").trim();
  const text = (body.text || "").trim();
  const tid = (body.tid || "").trim() || null;
  const plats = (body.plats || "").trim() || null;
  let typ = (body.typ || "ovrigt").trim();
  if (!TYPER.includes(typ)) typ = "ovrigt";

  if (!datum || !rubrik || !text) {
    return json({ fel: "Fyll i datum, rubrik och text." }, 400);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    return json({ fel: "Datum måste vara på formen ÅÅÅÅ-MM-DD." }, 400);
  }

  const res = await env.DB.prepare(
    "INSERT INTO events (datum, tid, plats, typ, rubrik, text, skapad_av) VALUES (?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(datum, tid, plats, typ, rubrik, text, user.id)
    .run();

  return json({ ok: true, id: res.meta.last_row_id }, 201);
}
