import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

// Satu sumber untuk simpan + serve: mime menentukan ekstensi dan kind.
// ponytail: video >20 MB butuh nginx client_max_body_size + limit per jenis.
export const UPLOAD_TYPES = {
  "image/jpeg": { ext: "jpg", kind: "image" },
  "image/png": { ext: "png", kind: "image" },
  "image/webp": { ext: "webp", kind: "image" },
  "image/avif": { ext: "avif", kind: "image" },
  "video/mp4": { ext: "mp4", kind: "video" },
  "video/webm": { ext: "webm", kind: "video" },
  "application/pdf": { ext: "pdf", kind: "document" },
} as const;

export type UploadKind = (typeof UPLOAD_TYPES)[keyof typeof UPLOAD_TYPES]["kind"];

const MIME_BY_EXT = new Map<string, string>(
  Object.entries(UPLOAD_TYPES).map(([mime, { ext }]) => [ext, mime]),
);

export function mimeForFile(file: string) {
  return MIME_BY_EXT.get(path.extname(file).slice(1).toLowerCase());
}

export type SavedUpload = {
  kind: UploadKind;
  path: string;
  originalName: string;
  mime: string;
  size: number;
};

export async function saveUpload(file: File): Promise<SavedUpload> {
  const type = UPLOAD_TYPES[file.type as keyof typeof UPLOAD_TYPES];
  if (!type) throw new Error("UNSUPPORTED_TYPE");
  if (file.size === 0) throw new Error("EMPTY_FILE");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("FILE_TOO_LARGE");

  const name = `${randomUUID()}.${type.ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));

  return {
    kind: type.kind,
    path: name,
    originalName: file.name.slice(0, 255),
    mime: file.type,
    size: file.size,
  };
}

/** Resolve `/media/[...path]` ke file di dalam UPLOAD_DIR; null kalau keluar folder atau ekstensi asing. */
export function resolveMediaPath(segments: string[]) {
  if (segments.length !== 1) return null;
  const [name] = segments;
  if (!/^[A-Za-z0-9-]+\.[A-Za-z0-9]+$/.test(name)) return null;
  const file = path.join(UPLOAD_DIR, name);
  if (!file.startsWith(UPLOAD_DIR + path.sep) || !mimeForFile(file)) return null;
  return file;
}
