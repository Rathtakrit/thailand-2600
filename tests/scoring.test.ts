import test from "node:test";
import assert from "node:assert/strict";
import { clampScore, finalScore, AI_WEIGHT, CRIT_KEYS } from "../lib/scoring.ts";

test("clampScore keeps scores between 0 and 10 and rounds them", () => {
  assert.equal(clampScore(11), 10);
  assert.equal(clampScore(-3), 0);
  assert.equal(clampScore(7.6), 8);
  assert.equal(clampScore("x"), 5);
  assert.equal(clampScore(undefined), 5);
});

test("finalScore is null when there is no AI and no review", () => {
  assert.equal(finalScore(null, []), null);
});

test("AI only: every criterion equals the AI score, no people", () => {
  const ai = { impact: 10, feasible: 8, equity: 6, sustain: 4, evidence: 2, hope: 9 };
  const final = finalScore(ai, []);
  assert.ok(final);
  for (const k of CRIT_KEYS) assert.equal(final.by[k], ai[k]);
  assert.equal(final.people, 0);
  assert.equal(final.hasAi, true);
});

test("people only: every criterion is their plain average, no AI", () => {
  const a = { impact: 10, feasible: 6, equity: 4, sustain: 8, evidence: 2, hope: 0 };
  const b = { impact: 4, feasible: 4, equity: 4, sustain: 6, evidence: 8, hope: 10 };
  const final = finalScore(null, [a, b]);
  assert.ok(final);
  for (const k of CRIT_KEYS) assert.equal(final.by[k], (a[k] + b[k]) / 2);
  assert.equal(final.hasAi, false);
});

test("AI counts as AI_WEIGHT votes: AI 10 and one review 0 gives 7.5", () => {
  const ai = { impact: 10, feasible: 10, equity: 10, sustain: 10, evidence: 10, hope: 10 };
  const review = { impact: 0, feasible: 0, equity: 0, sustain: 0, evidence: 0, hope: 0 };
  const final = finalScore(ai, [review]);
  assert.ok(final);
  const expected = 10 * (AI_WEIGHT / (AI_WEIGHT + 1));
  for (const k of CRIT_KEYS) assert.equal(final.by[k], expected);
  assert.equal(final.total, expected * CRIT_KEYS.length);
  assert.equal(final.total, 45);
});
