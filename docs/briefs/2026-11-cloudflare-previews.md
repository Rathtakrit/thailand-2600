# Cloudflare previews via OpenNext

Written 2026-11-18.

**Decision:** the site runs on Cloudflare Workers through OpenNext, the adapter that runs the real Next.js
build. Each branch gets a preview link, so we can look at a change before it goes live.

**Why:** the vinext check on 2026-11-18 flagged next-auth (sign-in) as incompatible with Workers and
`cacheComponents` as only partially supported. OpenNext runs the real Next.js build instead of a
framework converted for Workers.

**Domain for now:** thailand2600.rathtakrit.com, the project owner's domain. The real domain is chosen
and bought later by Pincassociation, then pointed at the same Workers address.

**How it runs (set up 18 Nov):**
| Part | What |
|---|---|
| Builds | Cloudflare Workers Builds, connected to this repo. `main` → `npx opennextjs-cloudflare build` + `deploy` → live site. Every other branch (trigger "Branch previews") → `build` + `upload` → `https://<branch>-thailand-2600.rathtakrit.workers.dev`. |
| Who can open it | Cloudflare Access on the live site and all preview links: allow-list of two emails, one-time code by email, 24-hour session. The emails live only in the Cloudflare dashboard, never in this repo. |
| Database | Supabase (hosted Postgres, Singapore), reached through `DATABASE_URL` (transaction pooler). With it set, `getDb()` makes a new client per request (`maxUses: 1`), as [OpenNext's database guide](https://opennext.js.org/cloudflare/howtos/db) requires. Without it, local PGlite in `.data` as before. Tables come from `drizzle/`. Row-level security is on with no rules, so Supabase's public data API can't read them; the app connects as the owner. |
| Uploads | R2 bucket `thailand-2600-uploads` (binding `UPLOADS`, picked by `STORAGE=r2` in `wrangler.jsonc`). Page cache: R2 bucket `thailand-2600-opennext-cache`. |
| Secrets | Set on the Worker in the dashboard: `DATABASE_URL`, `AUTH_SECRET`, `TOKENME_API_KEY`. Previews use the same ones. |
| Size | 2.0 MB compressed (free-plan limit 3 MB), even with the unused PGlite engine inside: no supported way to leave it out was found. |

**Why not Cloudflare's newer "Previews":** each Preview needs its own secrets and storage listed in `wrangler.jsonc`
(`previews` block), so it was turned off in favour of OpenNext's documented `upload` route, which reuses the live
site's settings.

**Known limits:**
- Previews and the live site share one database and one upload store: fine for testing; give previews their own
  database before real visitors come.
- The hosted database starts empty (local PGlite adds example problems; hosted doesn't).
- Google/LINE sign-in on preview links needs each address on the provider's allowed list; not set up.
- A new database change: run `npm run db:migrate` with `DATABASE_URL` pointing at Supabase.

**Commands:** `cf:build` builds for Cloudflare, `cf:preview` shows the built site in the local Workers
runtime, `cf:deploy` publishes it. `dev`, `build` and `start` are unchanged.
