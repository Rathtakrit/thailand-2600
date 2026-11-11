---
name: kickoff
description: Interview the user about a new idea before any code is written. Ask about goal, audience, content, design and technical choices, limits and "done means". Record the decisions in a brief, then split the work into small build steps. Use when the user brings something new ("I have an idea", "new project", "new page", "new feature", "let's build…"). Not for describing code that already exists; that is /init.
---

# Kickoff

Turn the user's idea into decisions before anyone writes code. The user decides. Claude asks, plans and reviews.
No code is written at this step. Claude builds it later, one step at a time, once the brief is agreed.

## Before asking anything
- Read the project's CLAUDE.md, AGENTS.md and any existing brief in `docs/briefs/`.
- Make a list of what is **already decided** (stack, hosting, rules). Never ask about those again; quote them back
  in one line so the user can see they were picked up.
- If the idea is a big change to something already decided, say so and ask whether to reopen that decision.

## The interview
- Use AskUserQuestion. One topic per round, up to 4 questions. Each question stands on its own.
- Put a recommended option first, marked "(Recommended)". Give each option a one-line trade-off.
- Ask only what changes the result. Technical details that don't change what visitors see: pick them yourself and
  report each choice in one line. Anything the user can see or pay for: ask.
- Skip a round when everything in it is already decided.

Rounds, in order:
1. **The idea:** what it is, and why. Who uses it. What success looks like. What is out of scope.
2. **Look and feel:**
   - Figma link and frames, fonts, colors.
   - Phone and desktop behavior.
   - Empty, loading, error and long-content states.
   - Motion.
   - Never invent design. What Figma doesn't show goes on the open list.
3. **Content:**
   - Who writes it and where it is edited (EmDash or similar).
   - URLs, titles and alt text.
   - Redirects from old URLs.
   - Real or sample content.
4. **Technical choices:**
   - Framework and libraries. Default to the project's existing stack.
   - Where data lives and where it is hosted.
   - Logins and accounts, and free-tier limits.
   - New accounts, keys and logins are the user's steps. Plan them as such.
5. **Limits:** budget (AI and hosting costs), deadline, things not to touch, privacy.
6. **Done means:** how the user will check each part, on phone and desktop.

## Write the brief
- Save it as `docs/briefs/YYYY-MM-DD-<short-name>.md` in the project and commit it. Sections:
  Idea · Decisions (with date) · Open questions · Out of scope · Steps · Done means.
- **Open questions** list everything still unknown. Each one names the steps it blocks. Unblocked steps can go ahead.
- A decision that is a lasting project rule (for example a stack choice) also gets one dated line in the
  project CLAUDE.md. Ask before editing CLAUDE.md.

## Split into steps
- Each step is one small piece Claude can build and the user can check in one sitting, with its own "how to check".
- Order the steps so each builds on merged work, for example tokens → layout → pages.
- For each step, mark who does it: **Claude** (code) or **the user** (logins, keys, account sign-ups, design decisions).
- Show the user the step list and get an OK before building anything.

## Saving tokens
- At this step Claude's job is questions and plans. Keep it to that.
- Read big files, logs or long diffs through a small helper agent (Explore, or `effort: lower`) and keep only the
  conclusion.
- Don't re-read files already in the conversation. Don't paste long output to the user.
