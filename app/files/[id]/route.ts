import { readUpload } from "@/lib/files";

/** Serves one uploaded picture or 3D model. Removed files must disappear within an hour. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await readUpload(id);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Blob([file.bytes as BlobPart]), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.bytes.byteLength),
      "Cache-Control": "private, max-age=3600",
      // The browser must treat the file as the type we checked, never guess.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
