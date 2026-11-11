---
name: find-the-cause
description: A plain-words way to debug. Reproduce the problem, find where it fails, try to disprove the guess, and keep a list of what each try showed. No fix is planned until the cause is known. Use whenever something is broken, failing, erroring or behaving oddly (a page, a build, a workflow run, a server), before proposing any change.
---

# Find the cause

Rule: when something breaks, find the cause before changing anything. Then fix it and check the fix.

## 1. Make it happen again
- Write down the exact steps, command or link that shows the problem, and what was expected.
- If it only happens sometimes, say so and look for what makes it more likely.
- If it can't be reproduced, stop and say what's needed (a log, a screenshot, access), instead of guessing.

## 2. Find where it fails
- Read the actual error and the actual logs first (`gh run view --log`, server output, browser console).
- Follow the path from the input to the failure. List every setting that could change the outcome: config,
  secrets, versions, time of day, which branch. Change one at a time.
- Before guessing, check that each step of the path really does what you assume (e.g. that the request URL is right).

## 3. Try to disprove the guess
- List 2–4 possible causes, most likely first.
- For the top one: what result would prove it wrong? Run that check first.
- Only a guess that survives the disproof is the cause.

## 4. Keep a list
Keep a short list of every try in the conversation: what was changed, what happened, and what it ruled in or out.
A cause must fit **every** entry, not just the latest.

## Report
- **What's broken:** one line.
- **Why:** the cause, and the evidence for it.
- **The fix:** what will change and who does it (Claude, or the user for logins and keys).
- **How we'll know it's fixed:** the same steps from part 1.
