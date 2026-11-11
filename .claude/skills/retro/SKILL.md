---
name: retro
description: End-of-session review. Looks back over the session for the user's corrections, failures and repeated tries, then proposes up to 5 small updates to memory, CLAUDE.md, skills or repo rules, and changes nothing until the user approves each one. Use when the user types /retro or says "retro", and offer it after a big session. Not for fixing something broken now (find-the-cause).
---

# Retro

Turn what happened in a session into small improvements the user has approved.

## 1. Look back
Use this conversation only. Don't search old sessions. List:
- the user's corrections, in their own words
- what failed or took several tries
- what worked well and should stay the same

## 2. Keep real lessons only
Each lesson needs evidence from this session. A one-off slip is not a rule, unless it could do serious harm.

## 3. Sort each lesson
| It's about | It goes in |
|---|---|
| The user | Memory |
| How we work on this project | `AGENTS.md`. Keep it short: when adding, look for something to remove |
| How a job is done | That job's skill in `.claude/skills/` |

## 4. Propose
Give a numbered list of up to 5 changes. Each one shows the exact wording, where it goes, and what happened to justify it.

## 5. The user decides
The user approves, edits or rejects each one. **Write nothing before that.** Deleting anything git can't bring back shows the full text first and needs its own clear yes.

## 6. Apply
- Save and commit what was approved. Push only if the user says so.
- Report what was applied and what was rejected.
