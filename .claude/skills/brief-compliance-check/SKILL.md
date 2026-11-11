---
name: brief-compliance-check
description: Check any finished work against the brief it was made from, whatever kind of brief that is (a course assignment, a kickoff brief in docs/briefs/, a client or teacher request, a spec). It reads the real output in full, ticks every requirement, limit and deliverable, then hunts for errors the brief implies (wrong numbers, stale cross-references, broken logic, technical mistakes). It reports a Meets table and a Problem → Fix table. Use before handing over or submitting anything, and whenever the user asks "does this match the brief?". Not for debugging (find-the-cause) or for grammar (grammar-check).
---

# Brief compliance check

The question is always: **does what was made do what the brief asked, and is it right?** Scripts and summaries
can't answer that. Claude reads the real thing.

## 1. Find every brief
- The main brief (assignment file, `docs/briefs/*.md`, the issue, the user's message).
- Anything it points to (rubric, AGENTS.md, a style guide), and any decision the user made later in the session.
  Later decisions override the brief.

## 2. Turn the brief into a checklist
One line per item, in the brief's own words:
- **Musts:** content, sections, questions to answer, features.
- **Limits:** pages, slides, words, size, time, budget, deadline.
- **Deliverables and format:** file types, names, where they go, front page or credits.
- **Don'ts** and **done-means** lines.
- **Implied quality:** "good illustrations", "safe", "accessible" become a concrete test you write down.

## 3. Get the real output and read all of it
Never judge from a summary, a log or a done file.
- PDF: `python -c "import fitz;[print(p.get_text()) for p in fitz.open('f.pdf')]"` (pymupdf).
- DOCX: `textutil -convert txt -stdout f.docx` on the Mac (or python-docx).
- PPTX: python-pptx, printing each slide's text **and its notes**.
- Code: `git diff` against the base, plus running it.
- A site: the page at the address the user will open.

If it's long, read it in parts, but read all of it.

## 4. Mark each checklist line
Met / Partly / Missing / Wrong, each with the evidence (page, slide, file:line).

## 5. Hunt for errors the brief implies
These are what self-reviews miss:
- **Consistency:** the same number has the same value everywhere (summary, tables, figures, slides, conclusion).
- **Stale references:** "see Section 5", tables of contents and mapping tables that were written before the rest
  changed.
- **Logic:** costs or counts that can't be true given the stated assumptions; claims stronger than the evidence.
- **Technical correctness:** check worked examples yourself (formulas, code, G-code, units).
- **Sources:** each citation supports the sentence it's attached to (ref-verify checks that it exists), not just a
  nearby one. Two slipped past a handover read on 2026-11-09.
- **Internal checklists** (objective maps, requirement ticks) that leaked into the deliverable when the brief didn't
  ask for them.
- **Images at real size:** compute pixels per displayed inch. A small render hides blur.

## 6. Report
Open with one bold verdict line. Then two tables:
1. **Meets the brief:** the checklist, grouped, short.
2. **Problems to fix:** `# | Problem | Fix`, most serious first. Each fix is specific enough to act on.

Change nothing until the user decides. Then Claude makes the approved fixes.
