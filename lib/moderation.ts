import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";
import { getStorage } from "./storage";

const { solutions, files, reports } = schema;

/** Moderators are the account ids listed in MODERATOR_IDS (comma-separated) in the settings file. */
export const isModerator = (userId: string | null) =>
  !!userId && (process.env.MODERATOR_IDS ?? "").split(",").map((s) => s.trim()).includes(userId);

/** Takes a picture or 3D model off a solution, deletes the file itself, and clears the reports about it. */
export async function removeVisual(solutionId: string, what: "image" | "model") {
  const db = await getDb();
  const [s] = await db.select({ imageId: solutions.imageId, modelId: solutions.modelId }).from(solutions).where(eq(solutions.id, solutionId));
  const fileId = what === "image" ? s?.imageId : s?.modelId;
  if (!fileId) return;
  await db.update(solutions).set(what === "image" ? { imageId: null } : { modelId: null }).where(eq(solutions.id, solutionId));
  await db.delete(files).where(eq(files.id, fileId));
  await getStorage().remove(fileId);
  // Once nothing visual is left on the solution, its reports have been dealt with.
  const stillHasOne = what === "image" ? s?.modelId : s?.imageId;
  if (!stillHasOne) await db.delete(reports).where(eq(reports.solutionId, solutionId));
}
