import type { CritKey } from "./content";

export const CRIT_KEYS: CritKey[] = ["impact", "feasible", "equity", "sustain", "evidence", "hope"];

export type Scores = Record<CritKey, number>;

/** What the AI judge returns for one pitch. */
export type Verdict = {
  scores: Scores;
  notes: Record<CritKey, string>;
  objection: string;
  improve: string;
  vision: string;
  model: string;
};

export const clampScore = (v: unknown) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.max(0, Math.min(10, n)) : 5;
};

/** The AI judge counts as three votes; each person's review counts as one. */
export const AI_WEIGHT = 3;

export type Final = { by: Scores; total: number; people: number; hasAi: boolean };

export function finalScore(ai: Scores | null | undefined, reviews: Scores[]): Final | null {
  if (!ai && reviews.length === 0) return null;
  const by = {} as Scores;
  let total = 0;
  for (const k of CRIT_KEYS) {
    let sum = 0, weight = 0;
    if (ai) { sum += clampScore(ai[k]) * AI_WEIGHT; weight += AI_WEIGHT; }
    for (const r of reviews) { sum += clampScore(r[k]); weight += 1; }
    by[k] = weight ? sum / weight : 0;
    total += by[k];
  }
  return { by, total, people: reviews.length, hasAi: !!ai };
}
