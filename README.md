# Thailand 2600

A public platform where people in Thailand name a problem, pitch the solution they believe would solve it by B.E. 2600, and have it judged in the open.

Built so far: sign-in, problems, solutions, likes, comments, Thai/English, the AI judge with human score adjustment, on-demand translation, pictures, drawings and 3D models on pitches, the Visualized solutions gallery, reporting with a moderator page, a privacy notice, the About page, the room intro on the home page, 3D previews on gallery cards and the 3D map of 77 provinces.

**Working with Claude Code:** the team rules are in `AGENTS.md`, and the decisions made so far are in `docs/briefs/`.

## Run it locally

```bash
npm run dev
```

Then open http://localhost:3000. With no `DATABASE_URL` set, the app stores data in an embedded Postgres under `.data/` and seeds four example problems. Delete `.data/` to start fresh.

`npm run check` runs the lint, the type check, the tests and the build.

The sign-in page offers a "Local test account" (name only) in development. It is not available in production builds.

## Sign-in setup

Copy `.env.example` to `.env.local` and fill in:

- **LINE**: create a LINE Login channel at developers.line.biz. Callback URL: `<site>/api/auth/callback/line`.
- **Google**: create an OAuth client at console.cloud.google.com. Callback URL: `<site>/api/auth/callback/google`.

For local testing, `<site>` is `http://localhost:3000`.

## AI judge and translation

Set `TOKENME_API_KEY` in `.env.local` and restart. Without it the site still works, but pitches stay unscored and the translate links are hidden.

- A new pitch is judged on the server right after it is posted; the page shows "reading" until the verdict lands.
- The final score counts the AI judge as three votes and each person's review as one (`lib/scoring.ts`).
- Each person can trigger 5 judgments and 30 translations per day by default; change with `JUDGE_DAILY_LIMIT` and `TRANSLATE_DAILY_LIMIT`.
- The judge's instructions and the models used are in `lib/ai.ts`.

## Production database

Set `DATABASE_URL` to a Postgres connection string, then:

```bash
npm run db:migrate
```

Cloudflare previews use `PREVIEW_DATABASE_URL` when set; run migrations against it the same way: `DATABASE_URL=<preview url> npm run db:migrate`.

After changing `lib/db/schema.ts`, run `npm run db:generate` to create a new migration.

## Layout

- `app/` pages and server actions (`app/actions.ts` holds every write)
- `auth.ts` sign-in providers and session
- `lib/db/` schema, connection, example data
- `lib/content.ts` topics, regions, the map and all UI text in both languages
- `lib/queries.ts` read queries
- `lib/storage.ts`, `lib/files.ts` uploaded pictures and 3D models (saved under `.data/uploads` locally)
- `lib/provinces.ts`, `components/Map3D.tsx` the province map
- `lib/moderation.ts`, `app/moderate/` reports and removal; moderators are the account ids in `MODERATOR_IDS`

## Not built yet

Inbox and email notifications, awards and badges, a delete-account button, the full privacy policy and consent step, hosting. The AI judge and translation have not yet been run with a real key. The working reference for the inbox, awards and badges is the prototype, saved here as `thailand-2600.html` (a Claude artifact page); the look of the site has since moved on from it (see `docs/briefs/`).
