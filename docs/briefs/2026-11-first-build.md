# First build: what was chosen and why

Written 2026-11-16. These choices were made while building the first version, before this repo's rules asked for
options to be compared first. Treat each as open to change; the "Cloudflare" column says how hard the move is.

| Choice | Picked | Why | Moving to Cloudflare |
|---|---|---|---|
| Name | Thailand 2600 | B.E. 2600 is 2057 CE, about one generation away. The repo is still called thailand-2026. | No effect |
| Framework (the code that builds the pages) | Next.js 16 | One project for pages and server code; large community | Works through the OpenNext adapter; needs testing |
| Sign-in | LINE and Google, via Auth.js | Almost everyone in Thailand has LINE; one tap, no passwords to store | Works; session cookies only |
| Database | Postgres, via Drizzle | Standard, easy to host anywhere | Needs a hosted Postgres reached through Cloudflare Hyperdrive, or a rewrite of `lib/db` for Cloudflare D1 |
| Local database | PGlite (Postgres inside the app, saved in `.data/`) | Runs on each person's computer with no setup | Local only; not used when hosted |
| AI judge | TokenMe (DeepSeek V4.1 Flash) on the server for the judge and translation, one plain `fetch`, key `TOKENME_API_KEY` (changed from Claude on 2026-11-18, Rathtakrit's choice, same method as his Ten Courts game) | Scores cannot be changed from the browser; TokenMe's usage log keeps no prompt text | Works; it is a plain web request |
| Scoring | AI counts as 3 votes, each person as 1 | One person cannot swing a score alone | No effect |
| Moderation | One person reviews, authors can remove their own posts | Smallest thing that works for a soft launch | No effect |

## Not decided yet
- Where it is hosted, and which hosted Postgres.
- Privacy policy and consent wording (Thailand's PDPA applies once real names and sign-ins are stored).
- Whether the repo and site name should match (thailand-2026 or Thailand 2600).

## Not checked
- The AI judge and translation have not been run with a real API key.
- LINE and Google sign-in have not been run with real keys.
- Nothing has been tried on Cloudflare.
