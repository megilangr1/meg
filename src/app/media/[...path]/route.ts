import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

import { mimeForFile, resolveMediaPath } from "@/lib/upload";

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const file = resolveMediaPath((await params).path);
  if (!file) return notFound();

  const mime = mimeForFile(file);
  if (!mime) return notFound();

  const stat = await fs.stat(file).catch(() => null);
  if (!stat?.isFile()) return notFound();

  const headers = new Headers({
    "Content-Type": mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  });

  // ?download=1 → unduhan (dipakai tombol Unduh untuk pdf); nama file diambil dari originalName aset.
  const url = new URL(request.url);
  if (url.searchParams.get("download") === "1") {
    const requested = url.searchParams.get("filename") ?? "";
    const filename =
      requested.replace(/[^\w.\- ]/g, "").trim().slice(0, 120) || path.basename(file);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  }

  // Satu range saja (format `bytes=start-end`). Cukup untuk seek video dan viewer PDF.
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range")?.trim() ?? "");
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(stat.size - Number(range[2]), 0);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;

    if (start >= stat.size || start > end) {
      headers.set("Content-Range", `bytes */${stat.size}`);
      return new Response(null, { status: 416, headers });
    }

    headers.set("Content-Range", `bytes ${start}-${end}/${stat.size}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(stream(file, start, end), { status: 206, headers });
  }

  headers.set("Content-Length", String(stat.size));
  return new Response(stream(file), { headers });
}

function stream(file: string, start?: number, end?: number) {
  return Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream;
}
