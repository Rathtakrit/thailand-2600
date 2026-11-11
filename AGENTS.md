# Thailand 2026 rules

A website where people post predictions about Thailand's future, post problems they see, and reply with solutions.
Idea stage: no code and no tech stack yet. Decisions go in `docs/briefs/` once `/kickoff` has run.

The people working on this are new to coding or not programmers, and use the project to learn. They design and
decide; the AI plans, explains, builds and checks. Claude Code is the main tool. This file is the one rules file;
`CLAUDE.md` only points here.

## Known so far
- One of us has a Claude artifact (a page made on claude.ai) to use as the starting design. Ask for it to be pasted
  or exported into the repo; don't rebuild it from scratch.
- Now: runs on each person's own computer, with a local preview opened in the browser.
- Later: hosted on Cloudflare. Note in the brief where a choice makes that move easy or hard.

## Talking
- Plain words, short. Explain any technical word in one line the first time it comes up in a session.
- Plan first for anything bigger than a small fix, and wait for an OK.
- No repeating the question, no announcing next steps, no closing recap.
- Always say what to do and why, the risks, what wasn't checked, and which decisions are ours.
- When you do something new (start the preview, commit, install a package), explain once what it does and why.
- Summaries: one bold verdict line, then a table with one row per item in the order to act on it, then what you need
  from us.

## Choices
- Anything visitors see (look, wording, features, who can post): ask.
- Architecture (framework, database, login, where data lives): give 2–3 options in a table with plain-words
  trade-offs (cost, effort, how easy to change later, how well it moves to Cloudflare), recommend one, and let us
  pick. Record the pick and the reason in the brief.
- Small technical details: decide, and say what you picked in one line.

## Skills (`.claude/skills/`)
| Skill | Use it for |
|---|---|
| `/kickoff` | **Start here in the first session.** Interviews you about the site and writes the brief. |
| `/lean` | Keeps notes, plans and code short. |
| `/find-the-cause` | Something is broken: find why before fixing. |
| `/brief-compliance-check` | Before calling a feature done: check it against the brief. |
| `/grammar-check` | Proofread site text. |
| `/retro` | End of a big session: suggest small rule updates. |

## Preview
When there's something to see, start the dev server and give the full address (e.g. `http://localhost:5173`) on its
own line, plus how to stop it.

## Never
- Commit secrets: keys, tokens, passwords or `.env` files. This repo is public: every file and commit can be read
  by anyone, forever.
- Put real people's personal details in code, test data or commits. Make people up.
- Choose a framework, database or host without asking (see Choices).
- Install tools or create accounts without asking first.
- Delete something git can't bring back without showing it and getting a clear yes.

## Always
- Keep it small: the fewest files, packages and settings that do the job (`/lean`).
- Before saying something works, check it in the running preview.
