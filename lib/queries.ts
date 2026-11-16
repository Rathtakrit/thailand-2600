import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import type { Lang } from "./content";
import { getDb, schema } from "./db";
import type { Scores } from "./scoring";

const { problems, solutions, comments, likes, votes, users, reviews, translations } = schema;

const seenCount = sql<number>`(select count(*)::int from votes v where v.problem_id = "problems"."id")`;
const solCount = sql<number>`(select count(*)::int from solutions s where s.problem_id = "problems"."id")`;

export async function listProblems(filter: { region?: string; cat?: string; sort?: string }) {
  const db = await getDb();
  const where = and(filter.region ? eq(problems.region, filter.region) : undefined, filter.cat ? eq(problems.cat, filter.cat) : undefined);
  const order = filter.sort === "seen" ? desc(seenCount) : filter.sort === "sol" ? desc(solCount) : desc(problems.createdAt);
  return db
    .select({ id: problems.id, title: problems.title, body: problems.body, cat: problems.cat, region: problems.region, example: problems.example, seen: seenCount, sols: solCount })
    .from(problems)
    .where(where)
    .orderBy(order, desc(problems.createdAt))
    .limit(200);
}

export async function homeStats() {
  const db = await getDb();
  const [[p], [s], byRegion] = await Promise.all([
    db.select({ n: count() }).from(problems),
    db.select({ n: count() }).from(solutions),
    db.select({ region: problems.region, n: count() }).from(problems).groupBy(problems.region),
  ]);
  return { problems: p.n, solutions: s.n, byRegion: Object.fromEntries(byRegion.map((r) => [r.region, r.n])) as Record<string, number> };
}

export async function getProblem(id: string, userId: string | null, lang: Lang) {
  const db = await getDb();
  const [problem] = await db
    .select({ id: problems.id, title: problems.title, body: problems.body, cat: problems.cat, region: problems.region, example: problems.example, authorId: problems.authorId, createdAt: problems.createdAt, authorName: users.name, seen: seenCount })
    .from(problems)
    .leftJoin(users, eq(users.id, problems.authorId))
    .where(eq(problems.id, id));
  if (!problem) return null;

  const likeCount = sql<number>`(select count(*)::int from likes l where l.solution_id = "solutions"."id")`;
  const solRows = await db
    .select({ id: solutions.id, title: solutions.title, body: solutions.body, authorId: solutions.authorId, createdAt: solutions.createdAt, authorName: users.name, likes: likeCount, aiStatus: solutions.aiStatus, ai: solutions.ai, aiAt: solutions.aiAt, imageId: solutions.imageId, modelId: solutions.modelId })
    .from(solutions)
    .leftJoin(users, eq(users.id, solutions.authorId))
    .where(eq(solutions.problemId, id))
    .orderBy(desc(likeCount), asc(solutions.createdAt));
  // A verdict still "pending" after three minutes means the judge run was lost; show it as failed so the author can retry.
  const now = Date.now();
  const sols = solRows.map((s) => ({ ...s, status: s.aiStatus === "pending" && now - (s.aiAt ?? s.createdAt).getTime() > 3 * 60 * 1000 ? "failed" : s.aiStatus }));

  const ids = sols.map((s) => s.id);
  const [cmts, myLikes, myVote, revs] = await Promise.all([
    ids.length
      ? db
          .select({ id: comments.id, solutionId: comments.solutionId, body: comments.body, authorId: comments.authorId, createdAt: comments.createdAt, authorName: users.name })
          .from(comments)
          .leftJoin(users, eq(users.id, comments.authorId))
          .where(inArray(comments.solutionId, ids))
          .orderBy(asc(comments.createdAt))
      : [],
    userId && ids.length ? db.select({ id: likes.solutionId }).from(likes).where(and(eq(likes.userId, userId), inArray(likes.solutionId, ids))) : [],
    userId ? db.select({ id: votes.problemId }).from(votes).where(and(eq(votes.userId, userId), eq(votes.problemId, id))) : [],
    ids.length ? db.select({ solutionId: reviews.solutionId, userId: reviews.userId, scores: reviews.scores }).from(reviews).where(inArray(reviews.solutionId, ids)) : [],
  ]);

  const reviewsBy = new Map<string, Scores[]>();
  const myReviews = new Map<string, Scores>();
  for (const r of revs) {
    reviewsBy.set(r.solutionId, [...(reviewsBy.get(r.solutionId) ?? []), r.scores]);
    if (r.userId === userId) myReviews.set(r.solutionId, r.scores);
  }

  // Saved translations into the reader's language, keyed "kind:id".
  const refIds = [id, ...ids, ...cmts.map((c) => c.id)];
  const trRows = await db.select().from(translations).where(and(eq(translations.lang, lang), inArray(translations.refId, refIds)));
  const tr = new Map(trRows.map((r) => [`${r.kind}:${r.refId}`, r.data]));

  return { problem, sols, comments: cmts, liked: new Set(myLikes.map((r) => r.id)), seenByMe: myVote.length > 0, reviewsBy, myReviews, tr };
}
