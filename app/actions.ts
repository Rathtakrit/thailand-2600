"use server";

import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { auth, signIn, signOut } from "@/auth";
import { aiEnabled, translateFields } from "@/lib/ai";
import { CATS, REGIONS } from "@/lib/content";
import { getDb, schema } from "@/lib/db";
import { deleteUnusedUploads, deleteUploads } from "@/lib/files";
import { runJudge, takeAiTurn } from "@/lib/judge";
import { isModerator, removeVisual } from "@/lib/moderation";
import { clampScore, CRIT_KEYS, type Scores } from "@/lib/scoring";

const { problems, solutions, comments, likes, votes, reviews, translations, files, reports } = schema;

async function requireUser(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/signin");
  // A session can outlive its account (deleted user, reset database): send those back to sign in.
  const [row] = await (await getDb()).select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, id));
  if (!row) redirect("/signin?stale=1");
  return id;
}
const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
const newId = (prefix: string) => prefix + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

export async function setLang(form: FormData) {
  (await cookies()).set("lang", form.get("lang") === "th" ? "th" : "en", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  refresh();
}

export async function signInWith(form: FormData) {
  const provider = String(form.get("provider"));
  if (provider === "dev") await signIn("dev", { name: text(form, "name", 40), redirectTo: "/" });
  else if (provider === "line" || provider === "google") await signIn(provider, { redirectTo: "/" });
}

export async function signOutNow() {
  await signOut({ redirectTo: "/" });
}

export async function createProblem(form: FormData) {
  const userId = await requireUser();
  const title = text(form, "title", 160), body = text(form, "body", 3000);
  const cat = text(form, "cat", 20), region = text(form, "region", 20);
  if (title.length < 6 || body.length < 30 || !CATS.some((c) => c[0] === cat) || !REGIONS.some((r) => r[0] === region)) return;
  const id = newId("p");
  await (await getDb()).insert(problems).values({ id, title, body, cat, region, authorId: userId });
  redirect("/p/" + id);
}

export async function createSolution(form: FormData) {
  const userId = await requireUser();
  const problemId = text(form, "problemId", 40), title = text(form, "title", 160), body = text(form, "body", 4000);
  if (title.length < 6 || body.length < 60) return;
  const db = await getDb();
  const [p] = await db.select({ id: problems.id }).from(problems).where(eq(problems.id, problemId));
  if (!p) return;
  // A picture or 3D model must be one this person uploaded, and of the right kind.
  const ownFile = async (field: string, kind: string) => {
    const wanted = text(form, field, 40);
    if (!wanted) return null;
    const [row] = await db.select({ id: files.id }).from(files).where(and(eq(files.id, wanted), eq(files.ownerId, userId), eq(files.kind, kind)));
    return row?.id ?? null;
  };
  const imageId = await ownFile("imageId", "image");
  const modelId = await ownFile("modelId", "model");
  const id = newId("s");
  // The verdict is written after the response is sent; the page shows "reading" until it lands.
  const judgeNow = aiEnabled() && (await takeAiTurn(userId, "judge"));
  await db.insert(solutions).values({ id, problemId, title, body, authorId: userId, imageId, modelId, aiStatus: judgeNow ? "pending" : "none" });
  if (judgeNow) after(() => runJudge(id));
  // Tidy up pictures and models that were uploaded but never posted.
  after(() => deleteUnusedUploads().catch((err) => console.error("Upload clean-up failed", err)));
  refresh();
}

/** The author can ask for a verdict when a pitch has none (judge was off, failed, or the daily limit was hit). */
export async function askJudge(form: FormData) {
  const userId = await requireUser();
  const id = text(form, "solutionId", 40);
  const db = await getDb();
  const [s] = await db.select().from(solutions).where(and(eq(solutions.id, id), eq(solutions.authorId, userId)));
  if (!s || s.aiStatus === "done" || !aiEnabled()) return;
  if (s.aiStatus === "pending" && s.aiAt && Date.now() - s.aiAt.getTime() < 3 * 60 * 1000) return;
  if (!(await takeAiTurn(userId, "judge"))) redirect(`/p/${s.problemId}?limit=1`);
  await db.update(solutions).set({ aiStatus: "pending", aiAt: new Date() }).where(eq(solutions.id, id));
  after(() => runJudge(id));
  refresh();
}

/** Saves this person's own six scores for a solution (one vote beside the AI judge). */
export async function saveReview(form: FormData) {
  const userId = await requireUser();
  const solutionId = text(form, "solutionId", 40);
  const db = await getDb();
  const [s] = await db.select({ id: solutions.id }).from(solutions).where(eq(solutions.id, solutionId));
  if (!s) return;
  const scores = Object.fromEntries(CRIT_KEYS.map((k) => [k, clampScore(form.get(k))])) as Scores;
  await db.insert(reviews).values({ userId, solutionId, scores }).onConflictDoUpdate({ target: [reviews.userId, reviews.solutionId], set: { scores, createdAt: new Date() } });
  refresh();
}

/** Translates one problem, solution (with its verdict) or comment into the reader's language and saves it for everyone. */
export async function translate(form: FormData) {
  const userId = await requireUser();
  const kind = String(form.get("kind")), id = text(form, "id", 40), problemId = text(form, "problemId", 40);
  const lang = (await cookies()).get("lang")?.value === "th" ? "th" : "en";
  const db = await getDb();
  const [done] = await db.select({ kind: translations.kind }).from(translations).where(and(eq(translations.kind, kind), eq(translations.refId, id), eq(translations.lang, lang)));
  if (done || !aiEnabled()) return refresh();

  const fields: Record<string, string> = {};
  if (kind === "problem") {
    const [p] = await db.select().from(problems).where(eq(problems.id, id));
    if (p) Object.assign(fields, { title: p.title, body: p.body });
  } else if (kind === "solution") {
    const [s] = await db.select().from(solutions).where(eq(solutions.id, id));
    if (s) {
      Object.assign(fields, { title: s.title, body: s.body });
      if (s.ai) {
        for (const k of ["objection", "improve", "vision"] as const) if (s.ai[k]) fields[k] = s.ai[k];
        for (const k of CRIT_KEYS) if (s.ai.notes[k]) fields["n_" + k] = s.ai.notes[k];
      }
    }
  } else if (kind === "comment") {
    const [c] = await db.select().from(comments).where(eq(comments.id, id));
    if (c) fields.body = c.body;
  }
  if (Object.keys(fields).length === 0) return;
  if (!(await takeAiTurn(userId, "translate"))) redirect(`/p/${problemId}?limit=1`);
  try {
    const data = await translateFields(fields, lang);
    if (data) await db.insert(translations).values({ kind, refId: id, lang, data }).onConflictDoNothing();
  } catch (err) {
    console.error("Translation failed for", kind, id, err);
  }
  refresh();
}

export async function addComment(form: FormData) {
  const userId = await requireUser();
  const solutionId = text(form, "solutionId", 40), body = text(form, "body", 600);
  if (!body) return;
  const db = await getDb();
  const [s] = await db.select({ id: solutions.id }).from(solutions).where(eq(solutions.id, solutionId));
  if (!s) return;
  await db.insert(comments).values({ id: newId("c"), solutionId, body, authorId: userId });
  refresh();
}

export async function toggleLike(form: FormData) {
  const userId = await requireUser();
  const solutionId = text(form, "solutionId", 40);
  const db = await getDb();
  const [s] = await db.select({ id: solutions.id }).from(solutions).where(eq(solutions.id, solutionId));
  if (!s) return;
  const mine = and(eq(likes.userId, userId), eq(likes.solutionId, solutionId));
  const [had] = await db.select().from(likes).where(mine);
  if (had) await db.delete(likes).where(mine);
  else await db.insert(likes).values({ userId, solutionId }).onConflictDoNothing();
  refresh();
}

export async function toggleVote(form: FormData) {
  const userId = await requireUser();
  const problemId = text(form, "problemId", 40);
  const db = await getDb();
  const [p] = await db.select({ id: problems.id }).from(problems).where(eq(problems.id, problemId));
  if (!p) return;
  const mine = and(eq(votes.userId, userId), eq(votes.problemId, problemId));
  const [had] = await db.select().from(votes).where(mine);
  if (had) await db.delete(votes).where(mine);
  else await db.insert(votes).values({ userId, problemId }).onConflictDoNothing();
  refresh();
}

/**
 * Authors can remove their own posts. A removed pitch takes its picture and 3D model with it,
 * so nothing a person deleted can still be opened by its address.
 */
export async function removeOwn(form: FormData) {
  const userId = await requireUser();
  const kind = String(form.get("kind")), id = text(form, "id", 40);
  const db = await getDb();
  if (kind === "problem") {
    const [mine] = await db.select({ id: problems.id }).from(problems).where(and(eq(problems.id, id), eq(problems.authorId, userId)));
    if (!mine) return;
    // Every pitch under the problem goes with it, so collect their files first.
    const attached = await db.select({ imageId: solutions.imageId, modelId: solutions.modelId }).from(solutions).where(eq(solutions.problemId, id));
    await db.delete(problems).where(eq(problems.id, id));
    await deleteUploads(attached.flatMap((s) => [s.imageId, s.modelId]));
    redirect("/");
  }
  if (kind === "solution") {
    const [mine] = await db.select({ imageId: solutions.imageId, modelId: solutions.modelId }).from(solutions).where(and(eq(solutions.id, id), eq(solutions.authorId, userId)));
    if (!mine) return;
    await db.delete(solutions).where(eq(solutions.id, id));
    await deleteUploads([mine.imageId, mine.modelId]);
  }
  if (kind === "comment") await db.delete(comments).where(and(eq(comments.id, id), eq(comments.authorId, userId)));
  refresh();
}

/** Any signed-in person can report a solution's picture or 3D model, once. */
export async function reportVisual(form: FormData) {
  const userId = await requireUser();
  const solutionId = text(form, "solutionId", 40);
  const db = await getDb();
  const [s] = await db.select({ imageId: solutions.imageId, modelId: solutions.modelId }).from(solutions).where(eq(solutions.id, solutionId));
  if (!s || (!s.imageId && !s.modelId)) return;
  await db.insert(reports).values({ solutionId, reporterId: userId }).onConflictDoNothing();
  refresh();
}

/** Moderators only: remove a reported picture or model, or keep it and clear its reports. */
export async function moderateVisual(form: FormData) {
  const userId = await requireUser();
  if (!isModerator(userId)) return;
  const solutionId = text(form, "solutionId", 40), what = String(form.get("what"));
  if (what === "image" || what === "model") await removeVisual(solutionId, what);
  else if (what === "keep") await (await getDb()).delete(reports).where(eq(reports.solutionId, solutionId));
  refresh();
}
