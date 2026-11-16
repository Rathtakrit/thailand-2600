import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db";
import { LIMITS, saveUpload } from "@/lib/files";

const STATUS = { too_big: 413, bad_type: 415, limit: 429 } as const;

/** Upload one picture or 3D model. Signed-in people only. Send the file as form field "file". */
export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return Response.json({ error: "signed_out" }, { status: 401 });
  const [user] = await (await getDb()).select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, userId));
  if (!user) return Response.json({ error: "signed_out" }, { status: 401 });

  // Refuse oversized uploads before reading them into memory.
  if (Number(request.headers.get("content-length") ?? 0) > LIMITS.model + 64 * 1024) return Response.json({ error: "too_big" }, { status: 413 });

  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: "bad_type" }, { status: 415 });
  if (file.size > LIMITS.model) return Response.json({ error: "too_big" }, { status: 413 });

  const result = await saveUpload(userId, new Uint8Array(await file.arrayBuffer()));
  if ("error" in result) return Response.json(result, { status: STATUS[result.error] });
  return Response.json({ id: result.id, kind: result.kind, url: `/files/${result.id}` }, { status: 201 });
}
