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

## Struktur
- `src/app/layout.tsx` — root, font, metadata MeGGi dev + viewport themeColor
- `src/app/(public)/page.tsx` — rakit 5 sections saja, tanpa chrome
- `src/app/(public)/layout.tsx` — chrome: `SiteHeader` + children + `SiteFooter`
- `src/app/(public)/_components/layout/` — `site-header.tsx`, `site-sidebar.tsx` (Sheet mobile), `site-footer.tsx`
- `src/app/(public)/_components/page/` — `hero-section.tsx`, `stack-marquee.tsx`, `services-section.tsx`, `work-section.tsx`, `about-section.tsx`
- `src/app/(auth)/login/page.tsx` → `/login` — split-screen: banner `login-banner.jpg` (`hidden md:flex`) + panel logo transparan + link `/dashboard`. Belum ada `(auth)/layout.tsx`, belum ada form (tanpa Field/Input/Button/action).
- `src/app/(private)/layout.tsx` — `SidebarProvider` + `AppSidebar` + `SidebarInset` + `AppHeader`. Pola contoh resmi `sidebar-example.tsx` (provider/sidebar/inset, bukan div manual).
- `src/app/(private)/_components/` — `app-sidebar.tsx` (default export, rakit 4 partial), `app-header.tsx` (named, `SidebarTrigger` + `Separator`).
- `src/app/(private)/_components/sidebar/` — `sidebar-brand.tsx` (logo `*-clear.png` + `dark:invert`, `SidebarMenuButton render={<Link/>}`), `sidebar-nav-main.tsx` (`"use client"`, `usePathname` + `isActive`), `sidebar-nav-other.tsx` (grup `mt-auto`), `sidebar-user-info.tsx` (Avatar + fallback, dummy `meg@mail.com`).
- `src/app/(private)/dashboard/page.tsx` → `/dashboard` (placeholder)
- `prisma/schema.prisma` — kosongan: generator `prisma-client` → `../src/generated/prisma`, datasource `mysql`, tanpa model. `prisma/migrations/` belum ada (belum `migrate dev`).
- `prisma7.config.ts` — schema + migrations path + `datasource.url` dari `DATABASE_URL`. Auto-load oleh CLI (`prisma validate` hijau tanpa `--config`). Nama non-standar vs `prisma.config.ts` di skills — jalan, tapi selaraskan later bila mau ikut konvensi.
- `src/lib/prisma.ts` — `PrismaMariaDb` + `PrismaClient`, impor dari `../generated/prisma/client`. Catatan: tanpa pola singleton `globalThis` dari skill `prisma-client-api` (`constructor.md:143-196`) — dev HMR rawan multi-instance. Tambah when DB dipakai query real.
- `src/generated/prisma/` — output generate, gitignore. Jangan impor manual di luar `src/lib/prisma.ts`.
- `.env` + `.env.example` — `DATABASE_URL` + pecahan `DATABASE_HOST/PORT/USER/PASSWORD/NAME` (XAMPP root tanpa password). Keduanya gitignore (`.env*`), nilai kredensial dev lokal. `prisma.ts` pakai pecahan, bukan `DATABASE_URL` — selaraskan ke satu sumber later.
- `src/components/ui/` — `avatar`, `badge`, `bento-grid`, `blur-fade`, `button`, `card`, `collapsible`, `context-menu`, `dropdown-menu`, `globe`, `input`, `marquee`, `separator`, `sheet`, `sidebar`, `skeleton`, `tooltip`
- `src/hooks/use-mobile.ts` — hook bawaan `add sidebar` (jangan tulis manual)
- `src/lib/utils.ts` — re-export `cn` dari `cn`
- `next.config.ts` — kosong default

## Pola _components
- `(public)/_components/layout/` = chrome (header/sidebar/footer). `(public)/_components/page/` = sections halaman. `(private)/_components/` = chrome app (`app-sidebar`, `app-header`) + `sidebar/` partial (brand/nav-main/nav-other/user-info). Ulangi pola ini untuk `(auth)` when rute nambah.
- `page.tsx` hanya rakit sections. `layout.tsx` hanya rakit chrome + children.
- Export: named (`export function ...`). Pengecualian: `site-sidebar.tsx` pakai `export default function SiteSidebar`, impor default di `site-header.tsx:5`.
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
- Cek hasil add: import `@/components/ui/...` hardcode dari registry pihak ketiga harus disesuaikan ke alias proyek; ikon ikut `iconLibrary` (`lucide-react`).
- Next.js ini breaking changes. Baca `node_modules/next/dist/docs/` sebelum tulis kode. Patuhi deprecation.
- `AGENTS.md` auto-generate oleh `next dev`. Jangan hapus manual.
- Gaya repo: hapus dulu, tulis paling sedikit yang jalan. Tanpa abstraksi pesanan (tanpa barrel `index.ts` sampai impor lintas-route butuh).

## Perintah
- `npm run dev` — dev server
- `npm run build` / `npm run start` — build/start
- `npm run lint` — `eslint`
- Verifikasi standar tiap ubah UI: `npx.cmd tsc --noEmit --skipLibCheck`, lalu `npx.cmd eslint <file>`. PowerShell: panggil via `npx.cmd`/`npm.cmd`, bukan `npx`/`npm` langsung (execution policy).
- `next build` pernah hijau (routes `/`, `/login`, `/dashboard`), tapi output log kepotong di runner. Jangan klaim hijau ulang tanpa run baru.
- DB: `npx.cmd prisma validate` (hijau 2026-09-16), `npx.cmd prisma generate`, `npx.cmd prisma migrate dev`. Ikut skill `prisma-cli`, bukan hafalan flags.

## MCP (`opencode.json`, semua `enabled:true`, `type:local`)
- `next-devtools` — `npx -y next-devtools-mcp@latest` — error/route/build/cache dev server
- `shadcn` — `npx shadcn@latest mcp` — tambah/cari komponen
- `magicuidesign-mcp` — `npx -y @magicuidesign/mcp@latest` — registry Magic UI

## Skills (`.agents/skills/`, 16, sesuai `skills-lock.json`)
- `shadcn` — kelola komponen shadcn
- `migrate-radix-to-base` — migrasi Radix → Base UI
- `next-dev-loop` — verifikasi runtime via `next dev` + browser
- `next-cache-components-adoption` / `next-cache-components-optimizer` — Cache Components
- `next-partial-prefetching-adoption` / `next-partial-prefetching-optimizer` — Partial Prefetching
- Prisma resmi (`prisma/skills`): `prisma-cli` (init/generate/migrate/db/studio), `prisma-client-api` (query + pola singleton `globalThis`), `prisma-database-setup` (+ `references/mysql.md`: adapter `@prisma/adapter-mariadb`), `prisma-driver-adapter-implementation` (adaptor kustom saja), `prisma-postgres` / `prisma-postgres-setup` / `prisma-compute` (tidak terpakai, provider proyek = mysql), `prisma-mongodb-upgrade` (tidak terpakai; MongoDB = tetap v6, bukan v7), `prisma-upgrade-v7` (sudah v7, arsip migrasi)

## Utang / next
- DB: belum model, belum migrasi, belum singleton `globalThis`, belum query dipakai (`src/lib/prisma.ts` tak terimpor). Nama config `prisma7.config.ts` non-standar. `prisma.ts` (pecahan HOST/PORT/...) vs `prisma7.config.ts` (`DATABASE_URL`) dua sumber — satukan later. Prompt Prisma tawarkan upgrade 8.0.0-rc — abaikan (tetap 7.10.0 stabil).
- Private: user dummy (`meg@mail.com`, avatar = banner login) di `app-sidebar.tsx:24-30`; `dashboard/page.tsx` placeholder. `sidebar-user-info.tsx:21` pakai `<a href="#">` — ganti `DropdownMenu` + sign-out when auth masuk.
- Login: belum form (tambah `Field` + `Input` + `Button` via CLI, bukan markup manual), belum `(auth)/layout.tsx`, link `/dashboard` masih placeholder tanpa auth.
- Konten `projects`/`services` masih placeholder + metrik ilustratif. Konten real + case-study when siap.
- About `#contact` anchor hidup di dalam `AboutSection`; pindah ke section kontak sendiri when form kontak masuk.
