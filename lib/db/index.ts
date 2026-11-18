import { mkdirSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { count } from "drizzle-orm";
import { Pool } from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";
import { EXAMPLE_PROBLEMS } from "./seed";

export type DB = PgliteDatabase<typeof schema>;

const g = globalThis as unknown as { __th2600db?: Promise<DB> };

// A Cloudflare Worker must not reuse a database connection between requests, so with DATABASE_URL
// set we make a new pool per request: `cache` from react keeps one client for a request and
// nothing is cached on globalThis. Follows the OpenNext Cloudflare database howto
// (opennext.js.org/cloudflare/howtos/db).
const hostedDb = cache(async (): Promise<DB> => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, maxUses: 1 });
  return drizzlePg({ client: pool, schema }) as unknown as DB;
});

/** The embedded local Postgres in ./.data; migrates and seeds itself. Cached on globalThis. */
async function open(): Promise<DB> {
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const db = drizzlePglite(new PGlite(path.join(dir, "pglite")), { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  const [{ n }] = await db.select({ n: count() }).from(schema.problems);
  if (n === 0) await db.insert(schema.problems).values(EXAMPLE_PROBLEMS);
  return db;
}

/**
 * With DATABASE_URL set, connects to that Postgres per request (run `npm run db:migrate` first).
 * Without it, opens the embedded Postgres in ./.data so the app runs locally with no setup.
 */
export function getDb(): Promise<DB> {
  if (process.env.DATABASE_URL) {
    return hostedDb();
  }
  return (g.__th2600db ??= open());
}

export { schema };
