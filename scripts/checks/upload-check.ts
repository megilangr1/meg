// Self-check logika upload tanpa server: `npx tsx scripts/checks/upload-check.ts`
import assert from "node:assert/strict";
import { rm, stat } from "node:fs/promises";
import path from "node:path";

import { MAX_UPLOAD_BYTES, UPLOAD_DIR, mimeForFile, resolveMediaPath, saveUpload } from "../../src/lib/upload";

async function main() {
  const file = new File([new Uint8Array(64)], "foto.JPG", { type: "image/jpeg" });
  const saved = await saveUpload(file);
  assert.equal(saved.kind, "image");
  assert.equal(saved.mime, "image/jpeg");
  assert.match(saved.path, /^[0-9a-f-]{36}\.jpg$/);
  assert.equal((await stat(path.join(UPLOAD_DIR, saved.path))).size, 64);
  assert.equal(mimeForFile(saved.path), "image/jpeg");
  assert.equal(resolveMediaPath([saved.path]), path.join(UPLOAD_DIR, saved.path));

  await assert.rejects(() => saveUpload(new File(["x"], "a.html", { type: "text/html" })), /UNSUPPORTED_TYPE/);
  await assert.rejects(() => saveUpload(new File([], "a.jpg", { type: "image/jpeg" })), /EMPTY_FILE/);
  await assert.rejects(
    () => saveUpload(new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "a.jpg", { type: "image/jpeg" })),
    /FILE_TOO_LARGE/,
  );

  assert.equal(resolveMediaPath(["../.env"]), null);
  assert.equal(resolveMediaPath(["nope.txt"]), null);
  assert.equal(resolveMediaPath(["sub", "a.jpg"]), null);

  await rm(path.join(UPLOAD_DIR, saved.path));
  console.log("upload.ts OK (file uji dihapus)", saved.path);
}

main();
