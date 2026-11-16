import { readUpload } from "@/lib/files";

/** Serves one uploaded picture or 3D model. A file never changes once saved, so browsers may keep it. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await readUpload(id);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Blob([file.bytes as BlobPart]), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      // The browser must treat the file as the type we checked, never guess.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
