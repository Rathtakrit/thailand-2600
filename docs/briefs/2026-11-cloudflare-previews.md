# Cloudflare previews via OpenNext

Written 2026-11-18.

**Decision:** the site runs on Cloudflare Workers through OpenNext, the adapter that runs the real Next.js
build. Each branch gets a preview link, so we can look at a change before it goes live.

**Why:** the vinext check on 2026-11-18 flagged next-auth (sign-in) as incompatible with Workers and
`cacheComponents` as only partially supported. OpenNext runs the real Next.js build instead of a
framework converted for Workers.

**Domain for now:** thailand2600.rathtakrit.com, the project owner's domain. The real domain is chosen
and bought later by Pincassociation, then pointed at the same Workers address.

**Still to do, in order:**
1. [x] A hosted Postgres instead of PGlite (`lib/db`): with `DATABASE_URL` set, `getDb()` makes a new client
   per request (`maxUses: 1`, no global pool), as the OpenNext database howto says
   (opennext.js.org/cloudflare/howtos/db). With no `DATABASE_URL` it is the same PGlite in `.data` as before.
2. [x] R2 (Cloudflare file storage) instead of the local upload folder (`lib/storage.ts`): with `STORAGE=r2`
   (a var in `wrangler.jsonc`) uploads go to the `UPLOADS` binding, bucket `thailand-2600-uploads`. That bucket
   has to exist before the first deploy: `wrangler r2 bucket create thailand-2600-uploads`. The same key guard
   applies. `preview_urls` is on, so previews get a public address.
3. Allowed sign-in redirect addresses for the preview links, otherwise sign-in rejects the preview hosts.
4. The first build test on Workers.

**Not done: PGlite in the Cloudflare build.** PGlite (~15 MB of `.wasm`/`.data`) is still copied into
`.open-next/server-functions/default/node_modules/@electric-sql/pglite`, where it is never used because
`DATABASE_URL` is always set there. No supported way to leave it out was found in the local docs
(`@opennextjs/cloudflare` README, dist and templates, and `node_modules/next/dist/docs`):
`serverExternalPackages` only stops Next bundling a package, which is exactly why it is copied whole, and the
adapter config has no exclude option. Watch the Workers script size limit at item 4.

**Not checked:** that OpenNext supports Next 16.4.6 with `cacheComponents` on; the first `cf:build` will show.

**Commands:** `cf:build` builds for Cloudflare, `cf:preview` shows the built site in the local Workers
runtime, `cf:deploy` publishes it. `dev`, `build` and `start` are unchanged.
