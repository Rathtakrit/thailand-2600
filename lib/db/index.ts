import { mkdirSync } from "node:fs";
import path from "node:path";
import { count } from "drizzle-orm";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";
import { EXAMPLE_PROBLEMS } from "./seed";

export type DB = PgliteDatabase<typeof schema>;

const g = globalThis as unknown as { __th2600db?: Promise<DB> };

/**
 * With DATABASE_URL set, connects to that Postgres (run `npm run db:migrate` first).
 * Without it, opens an embedded Postgres stored in ./.data so the app runs locally
 * with no setup; that one migrates and seeds itself.
 */
async function open(): Promise<DB> {
  if (process.env.DATABASE_URL) {
    return drizzlePg(process.env.DATABASE_URL, { schema }) as unknown as DB;
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const db = drizzlePglite(new PGlite(path.join(dir, "pglite")), { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  const [{ n }] = await db.select({ n: count() }).from(schema.problems);
  if (n === 0) await db.insert(schema.problems).values(EXAMPLE_PROBLEMS);
  return db;
}

export function getDb(): Promise<DB> {
  return (g.__th2600db ??= open());
}

export { schema };
