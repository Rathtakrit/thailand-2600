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
1. A hosted Postgres instead of PGlite (`lib/db`): the local embedded database does not work on Workers.
2. R2 (Cloudflare file storage) instead of the local upload folder (`lib/storage.ts`).
3. Allowed sign-in redirect addresses for the preview links, otherwise sign-in rejects the preview hosts.
4. The first build test on Workers.

**Not checked:** that OpenNext supports Next 16.4.6 with `cacheComponents` on; the first `cf:build` will show.

**Commands:** `cf:build` builds for Cloudflare, `cf:preview` shows the built site in the local Workers
runtime, `cf:deploy` publishes it. `dev`, `build` and `start` are unchanged.
