---
name: lean
description: Cut what the reader doesn't need, such as repeats, filler, facts already kept somewhere else, and files or code that don't need to exist, while keeping every fact. Text for the user stays in plain words. Use whenever Claude writes or updates notes (AGENTS.md, briefs, issues, PRs), plans, chat answers, a project setup or code, and as a pass over an existing file ("/lean <file>", "make this leaner", "cut the duplicates"). Not for grammar (grammar-check) or for checking work against its brief (brief-compliance-check).
---

# Lean

Every line, file and block of code has to earn its place. Lean cuts repeats, filler and extras. It never cuts a fact.

## Two tests
Ask these of every line, file or block of code:
1. **Would the reader do anything differently without it?** If not, cut it.
2. **Is it already written somewhere this reader will look?** If so, point to that place instead of copying it.

The reader is whoever reads it next: the user, a fresh Claude session or another AI tool. Copying is right only when
the reader can't follow a pointer.

## The reader sets the style
- **The user reads it** (chat, PR descriptions, issue titles): plain words and full sentences. Short, but complete.
- **Only an AI reads it** (notes for the next session, rules files): compact is fine. Use short phrases, tables and
  `file:line` instead of quoting, but keep every fact.

## Never cut
- The user's own words (site text, quotes, raw answers). Copy them exactly.
- Numbers, dates, names, paths, URLs, commands, versions and error text.
- The **why** behind a rule. A rule without its reason gets broken or applied too widely.
- What was **not checked**, and the risks. Short reports tend to drop these first.
- Safety rules (secrets, ask-first, deleting) and anything the user asked for.
- In code: checks on outside input, error handling that prevents data loss, security, accessibility, and a test for
  risky logic.

## Notes (AGENTS.md, briefs, issues, PR text)
- Before adding a fact, find where it already lives (`grep -ri`). Update it there instead of adding a second copy.
- Keep the current state, not the story of how it got there.
- A lesson that still applies goes to its home (a skill or AGENTS.md).
- Replace a long explanation with a link to the file, issue or commit that holds it.

## Plans and briefs
- Open with the decision or the first step. Don't repeat the request back.
- Leave out options you won't take. Recommend one, with a one-line reason.
- Keep only steps that change what someone does. Drop "make sure to" and steps anyone would do anyway.
- Name each thing once and keep that name throughout.

## Answers to the user
Follow the Talking section of AGENTS.md. List only the sources the answer relies on.

## Setting up a project
Every file, folder, package and setting needs a job today, or it doesn't get made.
- Use the tools' defaults. Don't write config for a setting that is already the default.
- One rules file per repo: `AGENTS.md`, which most AI coding tools read. `CLAUDE.md` holds `@AGENTS.md` plus only
  the lines just for Claude.
- README: what it is and how to run it, in a few lines. No template sections, badges, CONTRIBUTING or CHANGELOG
  nobody asked for.
- No empty folders, placeholder or example files, or scripts and packages "for later".
- A brief records the decisions, not the interview.
- When setup is done, list each file made and its job in one line. Delete any file without a job.

## Code
- Use the first option that works: (1) can the code be avoided entirely, (2) does it already exist in this codebase,
  (3) is it built into the language or platform, (4) does an installed library do it, (5) only then write the smallest
  new code.
- No "for later" code, meaning no options, wrappers, layers or settings nobody asked for. Removing code beats adding
  it. Keep the existing structure.
- Keep the solution small but finish the whole job, including the callers, tests and config the change affects.
- Comments say why, in one line. A known shortcut gets `shortcut: <limit>, <when to upgrade>`.
- In a review, lean findings (dead code, duplicate helpers, packages nobody needs) come after bugs and risks.

## Lean pass on an existing file
For "/lean <file>" or "make this leaner". Files read at every session start (AGENTS.md, CLAUDE.md) are the best
targets: their cost repeats every session.
1. Read the whole file.
2. Before changing anything, list the proposed cuts in a table: Where | Cut / Merge / Move / Point to | Why. Flag any
   cut that removes a fact kept nowhere else.
3. Change nothing until the user approves. Text git can't bring back is shown in full and needs a clear yes first.
4. After the edit, check nothing was lost: every path, URL, number, date and command in the old text must still
   appear in the new text, or in the place it now points to. Report the sizes before and after.
