import { and, count, eq, gt } from "drizzle-orm";
import { aiEnabled, judgePitch } from "./ai";
import { CATS, label, REGIONS } from "./content";
import { getDb, schema } from "./db";

const { solutions, problems, aiCalls, translations } = schema;

const LIMITS = {
  judge: Number(process.env.JUDGE_DAILY_LIMIT) || 5,
  translate: Number(process.env.TRANSLATE_DAILY_LIMIT) || 30,
};

/** Records one AI call for this person, unless they are over today's limit. Returns false when over. */
export async function takeAiTurn(userId: string, kind: keyof typeof LIMITS): Promise<boolean> {
  const db = await getDb();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [{ n }] = await db.select({ n: count() }).from(aiCalls).where(and(eq(aiCalls.userId, userId), eq(aiCalls.kind, kind), gt(aiCalls.createdAt, since)));
  if (n >= LIMITS[kind]) return false;
  await db.insert(aiCalls).values({ id: crypto.randomUUID(), userId, kind });
  return true;
}

/** Runs the AI judge on one solution and stores the verdict. Never throws: failures are recorded on the row. */
export async function runJudge(solutionId: string): Promise<void> {
  const db = await getDb();
  try {
    if (!aiEnabled()) throw new Error("AI judge is not configured");
    const [row] = await db
      .select({ title: solutions.title, body: solutions.body, pTitle: problems.title, pBody: problems.body, cat: problems.cat, region: problems.region })
      .from(solutions)
      .innerJoin(problems, eq(problems.id, solutions.problemId))
      .where(eq(solutions.id, solutionId));
    if (!row) return;
    const result = await judgePitch({
      problemTitle: row.pTitle, problemBody: row.pBody, topic: label(CATS, row.cat, "en"), region: label(REGIONS, row.region, "en"),
      pitchTitle: row.title, pitchBody: row.body,
    });
    if (result.status === "refused") await db.update(solutions).set({ aiStatus: "refused", aiAt: new Date() }).where(eq(solutions.id, solutionId));
    else {
      await db.update(solutions).set({ aiStatus: "done", ai: result.verdict, aiAt: new Date() }).where(eq(solutions.id, solutionId));
      // A translation made before the verdict must include it next time.
      await db.delete(translations).where(and(eq(translations.kind, "solution"), eq(translations.refId, solutionId)));
    }
  } catch (err) {
    console.error("AI judge failed for", solutionId, err);
    await db.update(solutions).set({ aiStatus: "failed", aiAt: new Date() }).where(eq(solutions.id, solutionId)).catch(() => {});
  }
}
