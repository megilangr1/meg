# PROJECT.md — meg

Portfolio MeGGi dev. Fresh init, berkembang seiring fitur.

## Stack
- Next.js 16.3.5, React 19.2.8, TS strict, path `@/*` → `src/*`
- Tailwind v4 (`src/app/globals.css`), `tw-animate-css`, shadcn style `base-nova`, baseColor neutral, CSS vars on
- UI: `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `motion`, `cobe`, `@radix-ui/react-icons` (dep transitif via Magic UI)
- Registry: `@magicui` → `https://magicui.design/r/{name}`
- Font: Outfit (`--font-sans`) + Geist/Geist_Mono; `font-heading` = `--font-sans`
- Brand: `public/brand/logo*.png`, favicon: `public/favicons/` + `public/favicon.ico`, auth imagery: `public/image/login-banner.jpg`. Arti `clear` = bg transparan (RGBA, sudut alpha 0), bukan varian dark. Tanpa `clear` = RGB bg putih.
- DB: Prisma ORM 7.10.0 (`prisma`, `@prisma/client`), adapter `@prisma/adapter-mariadb` + driver `mariadb` 3.4.5 (transitif), provider `mysql` → MariaDB XAMPP `localhost:3306/meg`. DevDeps pendukung: `dotenv`, `tsx`.
- Auth: `better-auth` ^1.7.5 (instal exact 1.7.5, docs = v1.7 line). Env `BETTER_AUTH_SECRET` (min 32 char) + `BETTER_AUTH_URL`.

## Struktur
- `src/app/layout.tsx` — root, font, metadata MeGGi dev + viewport themeColor
- `src/app/(public)/page.tsx` — rakit 5 sections saja, tanpa chrome
- `src/app/(public)/layout.tsx` — chrome: `SiteHeader` + children + `SiteFooter`
- `src/app/(public)/_components/layout/` — `site-header.tsx`, `site-sidebar.tsx` (Sheet mobile), `site-footer.tsx`
- `src/app/(public)/_components/page/` — `hero-section.tsx`, `stack-marquee.tsx`, `services-section.tsx`, `work-section.tsx`, `about-section.tsx`
- `src/app/(auth)/login/page.tsx` → `/login` — split-screen: banner `login-banner.jpg` (`hidden md:flex`) + panel logo + `LoginForm` (`_components/login-form.tsx`: RHF + zod `modules/auth/login.schema.ts`, `Field`/`Input`/`Button` + `required` + `autoComplete`, `signIn.email`, error map `modules/auth/login.errors.ts`, `onSuccess` → toast + `push /dashboard` + `refresh`). `(auth)/layout.tsx` sengaja skip (keputusan user, belum butuh).
- `src/proxy.ts` — guard: `/login` redirect ke `/dashboard` bila sudah login; `/dashboard|/master-data|/pendataan-area` wajib session (via `auth.api.getSession`). Matcher lewati `api|_next|*.png|favicon.ico`.
- `src/app/(private)/layout.tsx` — `SidebarProvider` + `AppSidebar` + `SidebarInset` + `AppHeader`. Pola contoh resmi `sidebar-example.tsx` (provider/sidebar/inset, bukan div manual).
- `src/app/(private)/_components/` — `app-sidebar.tsx` (default export, rakit 4 partial), `app-header.tsx` (named, `SidebarTrigger` + `Separator`).
- `src/app/(private)/_components/sidebar/` — `sidebar-brand.tsx` (logo `*-clear.png` + `dark:invert`, `SidebarMenuButton render={<Link/>}`), `sidebar-nav-main.tsx` (`"use client"`, `usePathname` + `isActive`), `sidebar-nav-other.tsx` (grup `mt-auto`), `sidebar-user-info.tsx` (`"use client"`, `useSession` + early-return loading/error/content, `DropdownMenu` + `LogoutButton` `shared/`, avatar masih dummy banner).
- `src/app/(private)/dashboard/page.tsx` → `/dashboard` (placeholder)
- `prisma/schema.prisma` — generator `prisma-client` → `../src/generated/prisma`, datasource `mysql`, model `User`/`Session`/`Account`/`Verification` (hasil `npx auth@latest generate` + field plugin `admin`: `role/banned/banReason/banExpires`, `impersonatedBy`). `prisma/migrations/20260917034125_init_auth/` sudah ada (sudah `migrate dev`).
- `prisma.config.ts` — schema + migrations path + `seed: "tsx prisma/seed/index.ts"` + `datasource.url` dari `DATABASE_URL`. Nama standar (rename dari `prisma7.config.ts` bawaan init, 2026-09-17). Auto-load CLI (`prisma validate` hijau tanpa `--config`).
- `src/lib/prisma.ts` — `PrismaMariaDb(DATABASE_URL)` (satu sumber env + throw bila hilang; adaptor terima connection-string langsung, adaptasi mysql dari contoh pgsql docs) + `PrismaClient` dari `../generated/prisma/client`, singleton via `globalThis` + `export default prisma` — ikut guide resmi Prisma v7 Next.js (`prisma.io/docs/guides/v7/frameworks/nextjs`). Pengecualian aturan named-export.
- `src/lib/auth.ts` — `betterAuth`: `prismaAdapter(prisma, mysql)` + `emailAndPassword: { enabled: true }` + plugins `[admin(), nextCookies()]`. `nextCookies` wajib terakhir (docs `/docs/integrations/next`); `admin` via dedicated path `better-auth/plugins/admin` (tree-shaking, sesuai skill). Impor default `prisma` dari `./prisma`.
- `src/lib/auth-client.ts` — `createAuthClient` (`better-auth/react`) + `adminClient()`. Tanpa `baseURL` (same-domain, docs Next tidak pakai; `BETTER_AUTH_URL` tanpa `NEXT_PUBLIC_` = undefined di browser).
- `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)` (`GET, POST`), gateway `/api/auth/*`.
- `prisma/seed/` — `index.ts` (PrismaClient `DATABASE_URL` + lifecycle `then(disconnect)`/`catch(log+disconnect+exit 1)`, jalan via `prisma db seed` EXIT 0) + `auth.seed.ts` (`seedUser` via `auth.api.createUser` sesuai docs admin, guard idempoten `findMany`, terverifikasi 2 user: `admin@main.com`/admin + `test@main.com`/user).
- `notes.md` — cheat-sheet CLI (`migrate dev/reset`, `generate`, `auth@latest create-admin`). Untracked, belum commit.
- `src/generated/prisma/` — output generate, gitignore. Jangan impor manual di luar `src/lib/prisma.ts`.
- `.env` + `.env.example` — `DATABASE_URL` (satu-satunya sumber koneksi: `prisma.ts`, `seed`, `prisma.config.ts`; var pecahan `DATABASE_HOST/PORT/...` sudah dihapus 2026-09-17) + `BETTER_AUTH_URL`/`BETTER_AUTH_SECRET` (secret generate via `openssl rand -base64 32`). Keduanya gitignore (`.env*`), nilai kredensial dev lokal (XAMPP root tanpa password).
- `src/components/ui/` — `avatar`, `badge`, `bento-grid`, `blur-fade`, `button`, `card`, `collapsible`, `context-menu`, `dropdown-menu`, `field`, `globe`, `input`, `label`, `marquee`, `separator`, `sheet`, `sidebar`, `skeleton`, `toast`, `tooltip`
- `src/components/shared/` — `logout-button.tsx` (`signOut` + `push /`)
- `src/helpers/client/` — `client.helper.ts` (`doAlert` → `toast.add`)
- `src/hooks/use-mobile.ts` — bawaan `add sidebar`, dimodifikasi mininmal (init `setIsMobile` via `requestAnimationFrame` agar lolos `react-hooks/set-state-in-effect`). Disimpan sebagai study case pola fix.
- `src/lib/utils.ts` — re-export `cn` dari `cn`
- `next.config.ts` — kosong default

## Pola _components
- `(public)/_components/layout/` = chrome (header/sidebar/footer). `(public)/_components/page/` = sections halaman. `(private)/_components/` = chrome app (`app-sidebar`, `app-header`) + `sidebar/` partial (brand/nav-main/nav-other/user-info). `(auth)/_components/` = pecahan `page.tsx` (mis. `login-form.tsx`). Ulangi pola ini untuk route baru.
- `_components/` = pecahan komponen yang dipakai `page.tsx`-nya sendiri. `components/shared/` = komponen anywhere-use (mis. `logout-button.tsx`). `helpers/client/` = fungsi reusable yang dipanggil client component; `helpers/server/` = untuk server component/action (buat saat dibutuhkan). `modules/<domain>/` = artefak domain (zod schema, error map).
- `page.tsx` hanya rakit sections. `layout.tsx` hanya rakit chrome + children.
- Export: ikut best practice React/Next.js yang sedang dipakai (named untuk partial/komponen, default bila mengikuti pola resmi contoh/docs). Tanpa catatan khusus per-file.
- Data dummy tinggal di file section (`stack`, `services`, `projects`). Angkat ke `src/data/` atau CMS when konten real masuk.

## Pola shadcn/Base UI (base, bukan radix)
- Tombol-link: `Button render={<Link href/>} nativeButton={false}`. Larangan: `Link > Button` (`<a><button>`, HTML invalid).
- Ikon dalam Button/Badge: `data-icon="inline-start"` / `"inline-end"`, tanpa kelas sizing manual.
- Card penuh: `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`. Jangan tumpuk semua di `CardContent`.
- Form: `FieldGroup` + `Field` + `FieldLabel`, bukan div + Label manual. Berlaku when form login dibangun.
- Avatar butuh `AvatarFallback`. Tumpukan pakai `AvatarGroup`, bukan `div -space-x-2` manual.
- Dialog/Sheet/Drawer wajib Title (+ Description bila ada). `SheetClose render={<Link/>}` bermasalah untuk navigasi anchor → pola proyek: controlled `Sheet open onOpenChange` + `useState`, tutup manual `setOpen(false)` di `Link onClick`.
- Sidebar: `SidebarMenuButton render={<Link/>}` ikut pola resmi. Nav aktif: `"use client"` + `usePathname` + `isActive` di `sidebar-nav-main.tsx`. Ikon `lucide-react` langsung (`<Icon />`), tanpa sizing manual.
- Spacing: `flex` + `gap-*`. Larangan: `space-x-*`/`space-y-*`. Ukuran kotak: `size-*`. Kondisional: `cn()`.
- Warna semantik (`bg-background`, `text-muted-foreground`, `bg-primary`, `bg-muted`). Larangan: token asing (`bg-base-200`, daisyUI) dan nilai mentah (`bg-blue-500`) dan override `dark:` manual.
- `Separator` ganti `<hr>`/border div. `Badge` untuk status/tag. `Marquee pauseOnHover`, `BlurFade inView` untuk reveal scroll.

## Pola responsive/layout
- Desktop `md+`: nav inline + aksi header. Mobile `<md`: tombol `Menu` (`md:hidden`) buka `Sheet side="right"`.
- Logo: selalu varian `*-clear.png` (transparan) + `dark:invert` untuk dark mode. Larangan: tukar file per tema (`dark:hidden`/`dark:block`) dan pakai non-clear (bg putih, merusak blend).
- Login split-screen: banner kiri `hidden md:flex` + panel kanan `flex-1`. Mobile hanya panel (banner hilang).
- Hero `lg:grid-cols-2` (teks + `Globe`). Services `BentoGrid`. Work feature-rows zigzag (`lg:order-2` selang-seling) + `Separator` antar baris. Work visual mock CSS-only (dashboard/site/system) — ganti gambar real when aset ada.

## Aturan keras user
- Jangan copy-paste komponen. Selalu tambah via CLI resmi sesuai docs: `npx shadcn@latest add <item>` (contoh: `npx shadcn@latest add @magicui/bento-grid`).
- Alur wajib tiap komponen baru: `search` → `docs <component>` + fetch URL contoh → `add` → baca file hasil add → perbaiki sebelum lanjut.
- Yang sudah terpasang via CLI (jangan tulis manual):
  - `npx shadcn@latest add @shadcn/badge @shadcn/avatar @shadcn/separator`
  - `npx shadcn@latest add @magicui/bento-grid @magicui/blur-fade @magicui/marquee`
  - `npx shadcn@latest add @shadcn/sheet`
  - `npx shadcn@latest add @shadcn/sidebar` (+ transitif: `collapsible`, `context-menu`, `dropdown-menu`, `input`, `skeleton`, `tooltip`, `src/hooks/use-mobile.ts`)
  - Batch login form: `@shadcn/field`, `@shadcn/label`, `@shadcn/toast` (+ `Toaster` global di root layout)
- Cek hasil add: import `@/components/ui/...` hardcode dari registry pihak ketiga harus disesuaikan ke alias proyek; ikon ikut `iconLibrary` (`lucide-react`).
- Next.js ini breaking changes. Baca `node_modules/next/dist/docs/` sebelum tulis kode. Patuhi deprecation.
- `AGENTS.md` auto-generate oleh `next dev`. Jangan hapus manual.
- Gaya repo: hapus dulu, tulis paling sedikit yang jalan. Tanpa abstraksi pesanan (tanpa barrel `index.ts` sampai impor lintas-route butuh). Tanpa copas antar-proyek (contoh: `use-media-query.ts` dihapus 2026-09-17 karena tak terpakai). Prinsip: **KISS = Keep it simple, stupid. Scale later**.

## Perintah
- `npm run dev` — dev server
- `npm run build` / `npm run start` — build/start
- `npm run lint` — `eslint`
- Verifikasi standar tiap ubah UI: `npx.cmd tsc --noEmit --skipLibCheck`, lalu `npx.cmd eslint <file>`. PowerShell: panggil via `npx.cmd`/`npm.cmd`, bukan `npx`/`npm` langsung (execution policy).
- `next build` pernah hijau (routes `/`, `/login`, `/dashboard`), tapi output log kepotong di runner. Jangan klaim hijau ulang tanpa run baru.
- DB: `npx.cmd prisma validate` (hijau 2026-09-17), `npx.cmd prisma generate`, `npx.cmd prisma migrate dev`, `npx.cmd prisma db seed` (hijau 2026-09-17, 2 user). Ikut skill `prisma-cli`, bukan hafalan flags. `migrate reset` masih aman (tahap dev, tanpa data real) — model boleh diubah + migrate fresh sesantai mungkin.
- Auth runtime: `GET /api/auth/ok` → `{"ok":true}` (2026-09-17, dev server `localhost:3000` jalan).

## MCP (`opencode.json`, semua `enabled:true`; 3 `type:local` + 1 `type:remote`)
- `next-devtools` — `npx -y next-devtools-mcp@latest` — error/route/build/cache dev server
- `shadcn` — `npx shadcn@latest mcp` — tambah/cari komponen
- `magicuidesign-mcp` — `npx -y @magicuidesign/mcp@latest` — registry Magic UI
- `better-auth` — `https://mcp.better-auth.com/mcp` (`type:remote`) — docs Better Auth versi akurat (`get_doc /llms.txt` → `search_docs` → `get_doc path`)

## Skills (`.agents/skills/`, 20, sesuai `skills-lock.json`)
- `shadcn` — kelola komponen shadcn
- `migrate-radix-to-base` — migrasi Radix → Base UI
- `next-dev-loop` — verifikasi runtime via `next dev` + browser
- `next-cache-components-adoption` / `next-cache-components-optimizer` — Cache Components
- `next-partial-prefetching-adoption` / `next-partial-prefetching-optimizer` — Partial Prefetching
- Better Auth (`better-auth/skills`, source `github`): `better-auth-best-practices` (server/client, adapter DB, session, plugin, env), `email-and-password-best-practices` (verifikasi email, reset password, policy, hashing), `better-auth-security-best-practices` (rate limit, secret, CSRF, trusted origins, cookie/session, audit), `create-auth` (scaffold auth baru: deteksi framework/DB, route handler, OAuth, UI login)
- Prisma resmi (`prisma/skills`): `prisma-cli` (init/generate/migrate/db/studio), `prisma-client-api` (query + pola singleton `globalThis`), `prisma-database-setup` (+ `references/mysql.md`: adapter `@prisma/adapter-mariadb`), `prisma-driver-adapter-implementation` (adaptor kustom saja), `prisma-postgres` / `prisma-postgres-setup` / `prisma-compute` (tidak terpakai, provider proyek = mysql), `prisma-mongodb-upgrade` (tidak terpakai; MongoDB = tetap v6, bukan v7), `prisma-upgrade-v7` (sudah v7, arsip migrasi)

## Utang / next
- Auth/DB: model + migrasi `20260917034125_init_auth` + singleton `global` + seed + rename `prisma.config.ts` + unifikasi `DATABASE_URL` + runtime check `/api/auth/ok → {"ok":true}` done (hijau: `tsc`, `prisma validate`, `eslint`, `db seed`, curl). Sisa: email flow ditunda (keputusan user — `sendVerificationEmail`/`sendResetPassword` belum definisi sampai ada provider email); `migrations/` + `seed/` + `auth.ts`/`auth-client.ts`/`notes.md` + rename config masih untracked (belum commit). Prompt Prisma tawarkan upgrade 8.0.0-rc — tolak. Keputusan versi: tetap 7.10.0 (Better Auth belum support Prisma 8 / integrasi belum cocok). Opsional stricter-dari-skill (di luar guide resmi): adapter dalam factory.
- Private: avatar masih dummy (banner login) di `sidebar-user-info.tsx`; `dashboard/page.tsx` placeholder. Dropdown + sign-out done via `LogoutButton`.
- Login: form + error map per kode (`INVALID_EMAIL_OR_PASSWORD`, `CREDENTIAL_ACCOUNT_NOT_FOUND`, `EMAIL_NOT_VERIFIED`, `BANNED_USER`, + pesan jaringan) done. Sisa: `Profile` masih `href="#"`; `rememberMe: false` = keputusan (tutup browser = logout).
- Konten `projects`/`services` masih placeholder + metrik ilustratif. Konten real + case-study when siap.
- About `#contact` anchor hidup di dalam `AboutSection`; pindah ke section kontak sendiri when form kontak masuk.
