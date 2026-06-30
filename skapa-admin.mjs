// ============================================================
//  Skapa-admin: genererar SQL för ett nytt adminkonto med
//  korrekt hashat lösenord. Lösenordet skrivs ALDRIG till disk.
//
//  Användning:
//    node skapa-admin.mjs  din@epost.se  "DittLösenord"
//
//  Skriptet skriver ut en INSERT-rad. Kör den mot databasen:
//    npx wrangler d1 execute sk6ag-db --command "<den utskrivna raden>"
// ============================================================

import { nyttSalt, hashaLosenord } from "./functions/_lib/auth.js";

const [, , epost, losenord] = process.argv;

if (!epost || !losenord) {
  console.error('Användning: node skapa-admin.mjs din@epost.se "DittLösenord"');
  process.exit(1);
}

const salt = nyttSalt();
const hash = await hashaLosenord(losenord, salt);
const e = epost.trim().toLowerCase().replace(/'/g, "''");

const sql =
  `INSERT INTO users (email, password_hash, salt, roll) ` +
  `VALUES ('${e}', '${hash}', '${salt}', 'admin');`;

console.log("\nKör detta mot databasen:\n");
console.log(`npx wrangler d1 execute sk6ag-db --command "${sql}"\n`);
