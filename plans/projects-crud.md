# plans/projects-crud.md — Modul Projects (admin CRUD + galeri)

Status: rencana disetujui arah, fase 1 belum dieksekusi.
Scope: `/home/heremes/code/meg` (single app). Dev server sedang jalan di `127.0.0.1:3001`.

## Tujuan

Admin (`role = admin`) bisa menambah/mengubah/menghapus project portfolio: teks, banner, galeri gambar, galeri video, dokumen PDF — semuanya tanpa menyentuh file kode. Data inilah yang nanti dipakai halaman publik (`/work` list + `/work/[slug]`).

## Non-goal (fase ini)

- Halaman publik `/work`, `/work/[slug]` — fase terpisah, plan sendiri.
- WYSIWYG / Markdown. `description` = plain text, render `whitespace-pre-line`.
- Multi-bahasa, versi/revisi, tag sebagai tabel, object storage (S3/R2), cropper/variant gambar.
- Soft delete. Hapus = hapus baris DB; file di disk **dibiarkan** (keputusan user, pola Laravel).

## Keputusan yang sudah disepakati

1. Storage: volume mount + diserve app sendiri (bukan docroot nginx).
2. Deskripsi: textarea plain text.
3. Satu plan penuh di muka; refactor di tengah fase boleh.
4. File: 3 jenis — `image`, `video`, `document` (pdf) — tiap file punya keterangan/caption.
5. Hapus: baris DB hapus, file tidak.
6. Urutan: `sortOrder` manual (angka + tombol naik/turun).

## Model data (3 tabel, aditif — tanpa mengubah tabel auth)

```prisma
model Project {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String    @db.Text
  summary     String    @db.Text          // 1–2 kalimat: kartu list + meta description
  description String?   @db.Text          // paragraf, plain text (\n\n = paragraf baru)
  role        String?   @db.Text          // "Full-stack build"
  year        Int?
  techStack   String?   @db.Text          // CSV: "Next.js, Prisma, MySQL"
  bannerPath  String?   @db.Text          // relatif ke UPLOAD_DIR
  bannerAlt   String?   @db.Text
  publishedAt DateTime?                   // null = draft
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  assets      ProjectAsset[]

  @@index([publishedAt, sortOrder])
  @@map("project")
}

model ProjectAsset {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  kind      AssetKind                        // dari mime, bukan input user
  path      String   @db.Text                // relatif ke UPLOAD_DIR: "<uuid>.<ext>"
  originalName String? @db.Text
  mime      String   @db.Text
  size      Int                              // byte
  caption   String?  @db.Text
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  @@index([projectId, kind, sortOrder])
  @@map("project_asset")
}

model ProjectFact {
  id        String  @id @default(cuid())
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  label     String  @db.Text
  value     String  @db.Text
  sortOrder Int     @default(0)

  @@index([projectId, sortOrder])
  @@map("project_fact")
}

enum AssetKind {
  image
  video
  document
}
```

Keputusan desain:

- **Banner bukan asset.** Banner = satu gambar, tanpa caption/urutan → dua kolom di `Project`. Menghindari invarian "maksimal satu cover" dan transaksi unset-cover.
- **`kind` = enum DB** `AssetKind(image|video|document)`, nilainya diturunkan server dari mime — user tidak memilih. Allowlist: image = jpeg/png/webp/avif, video = mp4/webm, document = **pdf saja**.
- **`mime` disimpan**, tidak ditebak dari ekstensi saat serve. Satu kolom vs satu map yang harus dijaga.
- **`techStack` CSV** di-parse di server, tanpa tabel Tag.
- **`ProjectFact` ikut fase 1, tanpa grup.** Baris label/value datar; urutan dipegang `sortOrder` manual saat input. Tidak ada tabel grup — grup hanya akan jadi string yang selalu berisi satu nilai.

## Storage & serving (padanan `Storage::disk` di Laravel)

Di Laravel: `Storage::disk('local')->put()` + `response()->file()`. Di Next tidak ada abstraksi itu — dua potong saja:

1. **Tulis**: `fs.promises.writeFile(path.join(UPLOAD_DIR, name), buffer)`. Nama = `crypto.randomUUID()` + ekstensi asli. `UPLOAD_DIR` = `process.env.UPLOAD_DIR ?? "./uploads"`.
2. **Baca**: route handler `src/app/media/[...path]/route.ts` → `new Response(Readable.toWeb(createReadStream(file)))`, dengan `Content-Type` dari DB/ekstensi, `Content-Length`, `Accept-Ranges: bytes` + dukungan `Range` (single range) supaya video bisa di-seek dan PDF bisa dibuka di viewer browser.

Kenapa bukan nginx `alias /srv/meg-uploads`: itu nol kode dan lebih cepat, tapi butuh vhost yang diubah root dan tidak jalan di PC lokal (Herd, tanpa nginx). Satu route handler jalan identik di dua mesin. Kalau nanti traffic besar, `alias` jadi upgrade yang mudah karena path publik tidak berubah.

Keamanan route: `path.resolve` hasil join harus masih di dalam `UPLOAD_DIR` (tolak `..`), dan hanya file berekstensi allowlist yang dilayani. `Cache-Control: public, max-age=31536000, immutable` — nama file UUID, isinya tidak pernah berubah.

Volume:

- Lokal (PC/dev server tanpa docker): `./uploads` di repo, masuk `.gitignore`.
- Docker: **bind mount `./uploads:/app/uploads`** (service `app`); `UPLOAD_DIR=/app/uploads`. Revisi 2026-11-06 (keputusan user): named volume ditolak karena file harus ada di host — mudah di-backup dan selamat saat image/container di-rebuild. Tanpa urusan chown karena uid container `nextjs` 1001 = uid host `heremes` 1001.

Batas ukuran: **semua file maks 20 MB**, `client_max_body_size 25m` di nginx sudah cukup → tidak perlu ubah nginx. `ponytail:` naikkan ke 200m di nginx + batas per-jenis saat video panjang dibutuhkan.

## Rute & file map

> Revisi 2026-11-06 (keputusan user): form create/edit **hanya metadata project**; banner + galeri pindah ke halaman **detail** `/(private)/projects/[id]`. Setelah create, redirect ke halaman detail. Upload tetap per-file di halaman detail (bukan satu FormData gabungan), jadi nginx `client_max_body_size 25m` tidak perlu diubah.

Admin (di dalam `(private)`, guard session + role admin):

```
/(private)/projects/                  → list (server component, tabel + pagination/manual order)
/(private)/projects/create/           → form kosong
/(private)/projects/[id]/edit/        → form + 3 galeri
src/modules/project/project.schema.ts → zod (field project, asset, allowlist mime, limit)
src/modules/project/project.errors.ts → map error Prisma P2002 + pesan validasi
src/app/(private)/projects/_components/project-table.tsx, project-form.tsx, project-assets.tsx
src/app/(private)/projects/actions.ts → server actions: create/update/delete/publish + setBanner
src/lib/upload.ts                     → saveUpload(file), deleteFile(path)? (tidak dipakai; hapus = baris saja), resolveMedia(path)
```

Publik (belum fase ini, disiapkan): `/media/[...path]`.

API untuk galeri (fetch dari client, JSON):

```
POST   /api/projects/[id]/assets        multipart: file + caption (+ sortOrder)
PATCH  /api/projects/[id]/assets/[assetId]   caption / sortOrder
DELETE /api/projects/[id]/assets/[assetId]   hapus baris (file ditinggal)
```

Semua handler mulai dengan `auth.api.getSession` + `role === "admin"`, balas 401/403, dan `projectId` diverifikasi milik project yang ada.

Guard tambahan: `src/proxy.ts` matcher ditambah `projects` (sekarang hanya `/dashboard|/akun-pengguna`).

## Fase eksekusi (satu fase per giliran, lapor tiap fase)

### Fase 1 — Schema + migrasi — SELESAI 2026-11-06
- Tambah 3 model (`Project`, `ProjectAsset`, `ProjectFact`) + enum `AssetKind` di `prisma/schema.prisma`.
- Migrasi baru: `npx prisma migrate dev --name add_projects` (aditif, tidak menyentuh tabel auth). `migrate reset` boleh kalau perlu bersih-bersih — belum ada modul/data nyata selain 2 user seed.
- Verifikasi: `npx prisma validate`, `npx prisma generate`, `npx prisma migrate status`.

### Fase 2 — Infrastruktur upload + `/media` — SELESAI 2026-11-06
- `.gitignore` + `uploads/`, `src/lib/upload.ts` (allowlist mime, limit 20 MB, uuid name, path guard), `src/app/media/[...path]/route.ts` (GET + Range), `docker-compose.yml` volume, `.env.example` + `.env` `UPLOAD_DIR`.
- Verifikasi: upload file uji via node script ke `uploads/`, `curl -I /media/<name>` → 200 + mime, `curl -H 'Range: bytes=0-99'` → 206, path traversal (`/media/../.env`) → 400/404.

### Fase 3 — CRUD project (tanpa galeri) — SELESAI 2026-11-06
- `project.schema.ts`, `project.errors.ts`, list page + tabel, form (RHF + zod, pola `user-form.tsx`), server actions create/update/delete/publish, slug util (tanpa dep) + validasi unik, proxy matcher.
- Verifikasi: `npm run typecheck`, `npx eslint src --max-warnings=0`, lalu UI di dev: login `admin@mail.com` / `admin123` → create → list → edit → publish → delete.

### Fase 4 — Galeri 3 jenis — SELESAI 2026-11-06
- `project-assets.tsx` (3 seksi: Gambar / Video / Dokumen, upload per seksi, caption inline, naik-turun `sortOrder`, hapus), 3 route handler, banner uploader (set `bannerPath` + `bannerAlt`).
- Verifikasi: upload 1 jpg, 1 mp4, 1 pdf; edit caption; ubah urutan; hapus → baris hilang, file masih ada di `uploads/`; request `/media` untuk ketiganya 200 + mime benar; video Range 206.

### Fase 5 — Verifikasi penutup
- `npm run typecheck`, `npx eslint src --max-warnings=0`, `npx prisma validate`.
- `next build` **hanya setelah `next dev` dimatikan** — keduanya menulis `.next` yang sama.
- Smoke via domain: `/media/<asset>` 200, halaman admin 200 dengan session admin, 307 tanpa session.
- Update `PROJECT.md` (struktur + storage + perintah) dan entri utang.

## Edge case yang ditangani

- Slug bentrok → `P2002` → error field, bukan 500. Slug auto dari title, bisa diedit, lowercase + strip non-`[a-z0-9-]`.
- Publish tanpa banner/galeri → diizinkan (project baru sering belum ada aset).
- Hapus project → baris asset ikut (cascade), file tetap di disk.
- Hapus asset → baris hilang; kalau itu banner, `bannerPath` dikosongkan di action yang sama.
- File >20 MB atau mime di luar allowlist → 422 dengan pesan per field.
- `sortOrder` kembar → tie-break `createdAt asc` agar list deterministik.
- `next/image` untuk banner: file lokal same-origin, optimizer jalan; video & pdf diserve mentah.

## Risiko

- `.next` dipakai bersama dev & build → build hanya saat dev mati (tercatat di fase 5).
- DB prod dipakai dev (session/cookies nyata). Migrasi fase 1 aditif; jangan `migrate reset` selama container prod nanti hidup.
- Bind mount `./uploads` baru berlaku saat kembali ke docker; dev sekarang menulis ke `./uploads` (path yang sama, jadi tidak ada migrasi file).
- Hapus file = tidak pernah → disk tumbuh. Diterima; bersihkan manual kalau perlu.

## Setelah plan ini

Fase publik: `/work` list dari DB (mengganti array placeholder di `work-section.tsx`) dan `/work/[slug]` dengan susunan title → banner → description → galeri gambar → galeri video → dokumen.
