import { and, count, eq, gt, inArray, isNull, lt, or } from "drizzle-orm";
import { getDb, schema } from "./db";
import { getStorage } from "./storage";

const { files, solutions } = schema;

export const LIMITS = {
  image: 5 * 1024 * 1024,
  model: 10 * 1024 * 1024,
  perDay: Number(process.env.UPLOAD_DAILY_LIMIT) || 30,
};

export type FileKind = "image" | "model";
export type UploadError = "too_big" | "bad_type" | "limit";

const startsWith = (b: Uint8Array, sig: number[], at = 0) => sig.every((v, i) => b[at + i] === v);

/** Decides the type from the file's first bytes, never from its name or what the browser claims. */
function sniff(b: Uint8Array): { kind: FileKind; contentType: string } | null {
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47])) return { kind: "image", contentType: "image/png" };
  if (startsWith(b, [0xff, 0xd8, 0xff])) return { kind: "image", contentType: "image/jpeg" };
  if (startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8)) return { kind: "image", contentType: "image/webp" };
  if (startsWith(b, [0x67, 0x6c, 0x54, 0x46])) return { kind: "model", contentType: "model/gltf-binary" }; // "glTF" = a .glb 3D model
  return null;
}

export async function saveUpload(ownerId: string, bytes: Uint8Array): Promise<{ id: string; kind: FileKind } | { error: UploadError }> {
  const type = sniff(bytes);
  if (!type) return { error: "bad_type" };
  if (bytes.byteLength > LIMITS[type.kind]) return { error: "too_big" };

  const db = await getDb();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [{ n }] = await db.select({ n: count() }).from(files).where(and(eq(files.ownerId, ownerId), gt(files.createdAt, since)));
  if (n >= LIMITS.perDay) return { error: "limit" };

  const id = crypto.randomUUID().replace(/-/g, "");
  await getStorage().put(id, bytes);
  await db.insert(files).values({ id, ownerId, kind: type.kind, contentType: type.contentType, size: bytes.byteLength });
  return { id, kind: type.kind };
}

export async function readUpload(id: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  if (!/^[a-z0-9]{32}$/.test(id)) return null;
  const [row] = await (await getDb()).select().from(files).where(eq(files.id, id));
  if (!row) return null;
  const bytes = await getStorage().get(id);
  return bytes ? { bytes, contentType: row.contentType } : null;
}

/** Deletes uploaded files for good: the database rows and the bytes in storage. */
export async function deleteUploads(ids: (string | null | undefined)[]) {
  const real = ids.filter((id): id is string => !!id);
  if (real.length === 0) return;
  await (await getDb()).delete(files).where(inArray(files.id, real));
  await Promise.all(real.map((id) => getStorage().remove(id)));
}

/**
 * Deletes uploads that no solution uses: a picture someone chose and then swapped or never posted.
 * Six hours leaves plenty of time for a pitch that is still being written.
 */
export async function deleteUnusedUploads() {
  const db = await getDb();
  const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const unused = await db
    .select({ id: files.id })
    .from(files)
    .leftJoin(solutions, or(eq(solutions.imageId, files.id), eq(solutions.modelId, files.id)))
    .where(and(isNull(solutions.id), lt(files.createdAt, cutoff)));
  await deleteUploads(unused.map((f) => f.id));
}
