# PROJECT.md — meg

Portfolio MeGGi dev. Fresh init, berkembang seiring fitur.

## Stack
- Next.js 16.3.5, React 19.2.8, TS strict, path `@/*` → `src/*`
- Tailwind v4 (`src/app/globals.css`), `tw-animate-css`, shadcn style `base-nova`, baseColor neutral, CSS vars on
- UI: `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `motion`, `cobe`, `next-themes` ^0.4.6 (dark mode, pola resmi shadcn), `@radix-ui/react-icons` (dep transitif via Magic UI)
- Registry: `@magicui` → `https://magicui.design/r/{name}`
- Font: Outfit (`--font-sans`) + Geist/Geist_Mono; `font-heading` = `--font-sans`
- Brand: `public/brand/logo*.png`, favicon: `public/favicons/` + `public/favicon.ico`, auth imagery: `public/image/login-banner.jpg`. Arti `clear` = bg transparan (RGBA, sudut alpha 0), bukan varian dark. Tanpa `clear` = RGB bg putih.
- DB: Prisma ORM 7.10.0 (`prisma`, `@prisma/client`), adapter `@prisma/adapter-mariadb` + driver `mariadb` 3.4.5 (transitif), provider `mysql` → MariaDB XAMPP `localhost:3306/meg`. DevDeps pendukung: `dotenv`, `tsx`.
- Auth: `better-auth` ^1.7.5 (instal exact 1.7.5, docs = v1.7 line). Env `BETTER_AUTH_SECRET` (min 32 char) + `BETTER_AUTH_URL`.

## Struktur
- `src/app/layout.tsx` — root: font, metadata MeGGi dev (`siteConfig`), viewport `colorScheme` + themeColor, `ThemeProvider` (attribute `class`, default `system`, `disableTransitionOnChange`), `suppressHydrationWarning`, `scroll-smooth scroll-pt-20 motion-reduce:scroll-auto`, `Toaster` + `TooltipProvider`
- `src/app/(public)/page.tsx` — rakit 6 sections (`HeroSection`, `StackMarquee`, `ServicesSection`, `WorkSection`, `AboutSection`, `CtaSection`), tanpa chrome; `metadata.alternates.canonical = "/"` + JSON-LD `Person` (dari `siteConfig`)
- `src/app/(public)/layout.tsx` — chrome: `SiteHeader` + children + `SiteFooter`
- `src/app/(public)/_components/layout/` — `site-header.tsx`, `site-sidebar.tsx` (Sheet mobile), `site-footer.tsx`
- `src/app/(public)/_components/page/` — `hero-section.tsx` (DotPattern brand + kata `text-brand` di h1 + stats strip NumberTicker), `stack-marquee.tsx`, `services-section.tsx` (bento wash `from-brand/10`), `work-section.tsx` (visual mock pakai `bg-brand`, wash `from-brand/10`), `about-section.tsx` (bio + facts + Client area; anchor `#contact` pindah ke CTA), `cta-section.tsx` (band emerald `bg-brand text-brand-foreground` + DotPattern + `id="contact"`)
- `src/app/(auth)/login/page.tsx` → `/login` — split-screen: banner `login-banner.jpg` via `next/image` `fill priority` (`hidden md:flex`) + panel logo + `ThemeToggle` + `LoginForm` (`_components/login-form.tsx`: RHF + zod `modules/auth/login.schema.ts`, `Field`/`Input`/`Button` + `required` + `autoComplete`, `signIn.email`, error map `modules/auth/login.errors.ts`, `onSuccess` → toast + `push /dashboard` + `refresh`). `metadata.robots` noindex. `(auth)/layout.tsx` sengaja skip (keputusan user, belum butuh).
- `src/proxy.ts` — guard: `/login` redirect ke `/dashboard` bila sudah login; `/dashboard|/akun-pengguna` wajib session (via `auth.api.getSession`); `/akun-pengguna` wajib `role === "admin"` (non-admin → `/dashboard`). Matcher lewati `api|_next/static|_next/image|favicon.ico` + semua path ber-ekstensi (`.*\..*`).
- `src/app/(private)/layout.tsx` — server guard session (`redirect("/login")`) + `metadata.robots` noindex + `SidebarProvider` + `AppSidebar` + `SidebarInset` + `AppHeader`. Defense in depth di atas proxy.
- `src/app/(private)/akun-pengguna/layout.tsx` — server guard `role === "admin"` (non-admin → `/dashboard`).
- `src/app/(private)/_components/` — `app-sidebar.tsx` (default export, rakit 4 partial), `app-header.tsx` (`"use client"`, `usePathname` → judul halaman + `SidebarTrigger` + `Separator` + `ThemeToggle`).
- `src/app/(private)/_components/sidebar/` — `sidebar-brand.tsx` (logo `*-clear.png` + `dark:invert`, `SidebarMenuButton render={<Link/>}`), `sidebar-nav-main.tsx` (`"use client"`, `usePathname` + `isActive` via `pathname === url || startsWith(url + "/")` agar child `detail/edit` highlight + guard role pola penuh `useSession` (`data/isPending/error/refetch`, ikut `sidebar-user-info.tsx`): loading = menu utama + `SidebarMenuSkeleton`, error = menu utama + retry refetch, content = grup `Utama` (Dashboard, semua login) + grup `Admin` (`Akun Pengguna`, hanya `role === "admin"`, fail-closed)), `sidebar-nav-other.tsx` (grup `mt-auto`), `sidebar-user-info.tsx` (`"use client"`, `useSession` + early-return loading/error/content, `DropdownMenu` + `LogoutButton` `shared/`, avatar initials dari nama / `session.user.image`, tanpa menu Profile sampai halaman profil ada).
- `src/app/(private)/akun-pengguna/` — CRUD user scope `role=user` via plugin `admin` (list server `auth.api.listUsers` filter `role eq user` + search `email/name` + sort server `createdAt/name` + pagination URL params `q/searchField/sort/limit/page`; create `authClient.admin.createUser` role fixed `user`; edit `admin.updateUser` name/email + `setUserPassword` opsional; `banUser` permanen + `banReason` wajib / `unbanUser` / `removeUser`; semua mutasi proteksi `locked` untuk diri sendiri). Server islands: `page.tsx` (list + `UserTable`), `[id]/detail/page.tsx` (profil user: banner gradient + avatar overlap + badge hanya positif (`Terverifikasi` muncul bila true, tanpa `Belum verifikasi`, meta verifikasi `—` bila false) + `UserActions` inline + banner alasan ban + grid meta, `notFound` bila `role!=user`; card catatan sudah dihapus 2026-09-18), `[id]/edit/page.tsx` (`getUser` → `UserForm`), `create/page.tsx` (`UserForm` kosong). Client islands `_components/`: `user-table.tsx` (toolbar ringkas: tombol `Filter` + chips aktif + `Reset`, badge status tanpa `Belum verifikasi`, `Pagination` shadcn, navigasi via `router.push` params), `user-filter-dialog.tsx` (`Dialog` shadcn: pencarian + field + urutan + limit, draft lokal + Terapkan/Reset), `user-form.tsx` (RHF + zod `modules/user/user.schema.ts`, pola `login-form`), `user-actions.tsx` (ban/unban/hapus + `AlertDialog` + `Input` alasan, `router.refresh`). Domain: `src/modules/user/user.schema.ts` (`USER_ROLE`, limit/sort options + map, create/update/ban schema) + `user.errors.ts` (map kode exact `better-auth@1.7.5` `dist/plugins/admin/error-codes.mjs`). Toast: `ToastViewport` `z-[100]` (fix toast ketutup `AlertDialog`/`Dialog` `z-50`, 2026-09-18).
- `src/app/(private)/dashboard/page.tsx` → `/dashboard` (placeholder)
- `src/app/not-found.tsx` + `src/app/error.tsx` — 404 dan error boundary root (client, tombol reset)
- `src/app/(private)/loading.tsx` — skeleton loading area private
- `src/app/robots.ts` + `src/app/sitemap.ts` — disallow `/dashboard|/akun-pengguna|/login`, sitemap URL dari `siteConfig`
- `src/app/opengraph-image.tsx` + `src/app/twitter-image.tsx` — OG/Twitter card 1200x630 via `next/og` (twitter re-export)
- `src/lib/site.ts` — `siteConfig` (name/title/description/url/email/locale), sumber metadata + robots + sitemap + JSON-LD
- `src/lib/session.ts` — `getSession` = `cache(auth.api.getSession)` untuk dedupe layout/page per request
- `src/components/theme-provider.tsx` — wrapper `next-themes` (pola resmi docs shadcn dark mode Next)
- `src/components/shared/theme-toggle.tsx` — `DropdownMenu` + `DropdownMenuRadioGroup` Light/Dark/System, trigger Base UI `render={<Button/>}`
- `prisma/schema.prisma` — generator `prisma-client` → `../src/generated/prisma`, datasource `mysql`, model `User`/`Session`/`Account`/`Verification` (hasil `npx auth@latest generate` + field plugin `admin`: `role/banned/banReason/banExpires`, `impersonatedBy`). `prisma/migrations/20260917034125_init_auth/` sudah ada (sudah `migrate dev`).
- `prisma.config.ts` — schema + migrations path + `seed: "tsx prisma/seed/index.ts"` + `datasource.url` dari `DATABASE_URL`. Nama standar (rename dari `prisma7.config.ts` bawaan init, 2026-09-17). Auto-load CLI (`prisma validate` hijau tanpa `--config`).
- `src/lib/prisma.ts` — `PrismaMariaDb(DATABASE_URL)` (satu sumber env + throw bila hilang; adaptor terima connection-string langsung, adaptasi mysql dari contoh pgsql docs) + `PrismaClient` dari `../generated/prisma/client`, singleton via `globalThis` + `export default prisma` — ikut guide resmi Prisma v7 Next.js (`prisma.io/docs/guides/v7/frameworks/nextjs`). Pengecualian aturan named-export.
- `src/lib/auth.ts` — `betterAuth`: `prismaAdapter(prisma, mysql)` + `emailAndPassword: { enabled: true }` + plugins `[admin(), nextCookies()]`. `nextCookies` wajib terakhir (docs `/docs/integrations/next`); `admin` via dedicated path `better-auth/plugins/admin` (tree-shaking, sesuai skill). Impor default `prisma` dari `./prisma`.
- `src/lib/auth-client.ts` — `createAuthClient` (`better-auth/react`) + `adminClient()`. Tanpa `baseURL` (same-domain, docs Next tidak pakai; `BETTER_AUTH_URL` tanpa `NEXT_PUBLIC_` = undefined di browser).
- `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)` (`GET, POST`), gateway `/api/auth/*`.
- `prisma/seed/` — `index.ts` (PrismaClient `DATABASE_URL` + lifecycle `then(disconnect)`/`catch(log+disconnect+exit 1)`, jalan via `prisma db seed` EXIT 0) + `auth.seed.ts` (`seedUser` via `auth.api.createUser` sesuai docs admin, guard idempoten `findMany`, 2 user: `admin@mail.com`/admin + `test@mail.com`/user). Semua tracked (sudah commit).
- `notes.md` — cheat-sheet CLI (`migrate dev/reset`, `generate`, `auth@latest create-admin`). Sudah tracked.
- `src/generated/prisma/` — output generate, gitignore. Jangan impor manual di luar `src/lib/prisma.ts`.
- `.env` + `.env.example` — `DATABASE_URL` (satu-satunya sumber koneksi: `prisma.ts`, `seed`, `prisma.config.ts`; var pecahan `DATABASE_HOST/PORT/...` sudah dihapus 2026-09-17) + `BETTER_AUTH_URL`/`BETTER_AUTH_SECRET` (secret generate via `openssl rand -base64 32`). Keduanya gitignore (`.env*`), nilai kredensial dev lokal (XAMPP root tanpa password).
- Struktur landing 2026-10-28: hero grid 2 kolom + `DotPattern` brand di belakang teks + kata kunci `text-brand` di h1 + badge dot `bg-brand` pulse + stats strip di bawah hero (`NumberTicker`, border-t, 2x4 grid).
- `src/components/ui/` — `alert-dialog`, `avatar`, `badge`, `bento-grid`, `blur-fade`, `button`, `card`, `collapsible`, `context-menu`, `dialog`, `dot-pattern`, `dropdown-menu`, `field`, `globe`, `input`, `label`, `marquee`, `number-ticker`, `pagination`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `table`, `toast`, `tooltip`
- `src/components/shared/` — `logout-button.tsx` (`signOut` + `push /`), `theme-toggle.tsx` (dark mode switcher)
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
- Token brand emerald (2026-10-28): `--brand`/`--brand-foreground` di `globals.css` (light `oklch(0.596 0.145 163.225)`/putih, dark `oklch(0.765 0.177 163.223)`/abu gelap) → `bg-brand`/`text-brand`. Primary tetap netral; emerald hanya untuk highlight landing (badge, wash, visual mock, CTA band). Status: keputusan user (logonya monochrome hitam, accent bebas).
- Tombol-link: `Button render={<Link href/>} nativeButton={false}`. Larangan: `Link > Button` (`<a><button>`, HTML invalid).
- Ikon dalam Button/Badge: `data-icon="inline-start"` / `"inline-end"`, tanpa kelas sizing manual.
- Card penuh: `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`. Jangan tumpuk semua di `CardContent`.
- Form: `FieldGroup` + `Field` + `FieldLabel`, bukan div + Label manual. Berlaku when form login dibangun.
- Avatar butuh `AvatarFallback`. Tumpukan pakai `AvatarGroup`, bukan `div -space-x-2` manual.
- Dialog/Sheet/Drawer wajib Title (+ Description bila ada). `SheetClose render={<Link/>}` bermasalah untuk navigasi anchor → pola proyek: controlled `Sheet open onOpenChange` + `useState`, tutup manual `setOpen(false)` di `Link onClick`.
- Sidebar: `SidebarMenuButton render={<Link/>}` ikut pola resmi. Nav aktif: `"use client"` + `usePathname` + `isActive` di `sidebar-nav-main.tsx`. Ikon `lucide-react` langsung (`<Icon />`), tanpa sizing manual.
- Spacing: `flex` + `gap-*`. Larangan: `space-x-*`/`space-y-*`. Ukuran kotak: `size-*`. Kondisional: `cn()`.
- Warna semantik (`bg-background`, `text-muted-foreground`, `bg-primary`, `bg-muted`). Larangan: token asing (`bg-base-200`, daisyUI) dan nilai mentah (`bg-blue-500`) dan override `dark:` manual.
- Dark mode: `next-themes` (`attribute="class"`, default `system`, `disableTransitionOnChange`) + `ThemeToggle` (Light/Dark/System) di header public, login, dan header private. Semua warna lewat token; `dark:` hanya untuk logo `dark:invert` dan animasi ikon toggle, bukan override warna.
- `Separator` ganti `<hr>`/border div. `Badge` untuk status/tag. `Marquee pauseOnHover`, `BlurFade inView` untuk reveal scroll.

## Pola responsive/layout
- Desktop `md+`: nav inline + aksi header. Mobile `<md`: tombol `Menu` (`md:hidden`) buka `Sheet side="right"`.
- Logo: selalu varian `*-clear.png` (transparan) + `dark:invert` untuk dark mode. Larangan: tukar file per tema (`dark:hidden`/`dark:block`) dan pakai non-clear (bg putih, merusak blend).
- Login split-screen: banner kiri `hidden md:flex` + panel kanan `flex-1`. Mobile hanya panel (banner hilang).
- Hero `lg:grid-cols-2` (teks + `Globe`). Services `BentoGrid`. Work feature-rows zigzag (`lg:order-2` selang-seling) + `Separator` antar baris. Work visual mock CSS-only (dashboard/site/system) — ganti gambar real when aset ada.
- Anchor + sticky header: `html` pakai `scroll-pt-20` (+ `scroll-smooth`, `motion-reduce:scroll-auto`), section target pakai `scroll-mt-24`. Jangan biarkan judul section ketutup header.
- Reduced motion: marquee dimatikan via `@media (prefers-reduced-motion: reduce)` di `globals.css`.

## Aturan keras user
- Jangan copy-paste komponen. Selalu tambah via CLI resmi sesuai docs: `npx shadcn@latest add <item>` (contoh: `npx shadcn@latest add @magicui/bento-grid`).
- Alur wajib tiap komponen baru: `search` → `docs <component>` + fetch URL contoh → `add` → baca file hasil add → perbaiki sebelum lanjut.
- Yang sudah terpasang via CLI (jangan tulis manual):
  - `npx shadcn@latest add @shadcn/badge @shadcn/avatar @shadcn/separator`
  - `npx shadcn@latest add @magicui/bento-grid @magicui/blur-fade @magicui/marquee`
  - `npx shadcn@latest add @shadcn/sheet`
  - `npx shadcn@latest add @shadcn/sidebar` (+ transitif: `collapsible`, `context-menu`, `dropdown-menu`, `input`, `skeleton`, `tooltip`, `src/hooks/use-mobile.ts`)
  - Batch login form: `@shadcn/field`, `@shadcn/label`, `@shadcn/toast` (+ `Toaster` global di root layout)
  - Batch akun-pengguna: `@shadcn/pagination`, `@shadcn/select`, `@shadcn/alert-dialog`, `@shadcn/dialog`
  - Batch landing polish: `@magicui/dot-pattern`, `@magicui/number-ticker`. Fix hasil add: `number-ticker` base `text-black dark:text-white` → `text-foreground`; `dot-pattern` base `text-neutral-400/80` → `text-foreground/40` + `Math.random` delay/duration → pola deterministik `((i * 101) % 500) / 100` / `2 + ((i * 37) % 300) / 100` (etes `react-hooks/purity`, study case kedua setelah `SidebarMenuSkeleton`). `glow` DotPattern jangan dipakai (butuh random per-render, hydration risk).
  - Fix lokal komponen CLI: `SidebarMenuSkeleton` width acak (`Math.random`) → fixed `72%` (2026-09-18, akar hydration mismatch). Aturan: tanpa `Math.random`/`Date.now` saat render SSR.
  - Catatan: `use-debounce` sempat diinstal lalu di-uninstall (2026-09-17) — search pindah ke Dialog tanpa live debounce, jadi dep tak terpakai. Prinsip: tanpa dep untuk beberapa baris.
- Cek hasil add: import `@/components/ui/...` hardcode dari registry pihak ketiga harus disesuaikan ke alias proyek; ikon ikut `iconLibrary` (`lucide-react`).
- Next.js ini breaking changes. Baca `node_modules/next/dist/docs/` sebelum tulis kode. Patuhi deprecation.
- `AGENTS.md` auto-generate oleh `next dev`. Jangan hapus manual.
- Gaya repo: hapus dulu, tulis paling sedikit yang jalan. Tanpa abstraksi pesanan (tanpa barrel `index.ts` sampai impor lintas-route butuh). Tanpa copas antar-proyek (contoh: `use-media-query.ts` dihapus 2026-09-17 karena tak terpakai). Prinsip: **KISS = Keep it simple, stupid. Scale later**.

## Perintah
- `npm run dev` — dev server
- `npm run build` / `npm run start` — build/start
- `npm run lint` — `eslint`
- `npm run typecheck` — `tsc --noEmit`
- Verifikasi standar tiap ubah UI: `npm.cmd run typecheck`, lalu `npx.cmd eslint <file>` (atau `npx.cmd eslint src --max-warnings=0`). PowerShell: panggil via `npx.cmd`/`npm.cmd`, bukan `npx`/`npm` langsung (execution policy).
- `next build` hijau EXIT 0 (2026-09-17, artefak `.next/server/app/akun-pengguna` ada; output log runner kepotong tapi exit code + artefak confirm).
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
- Landing polish 2026-10-28: token `--brand` + hero DotPattern/stats `NumberTicker` + wash bento/work + visual mock emerald + `CtaSection` band (hijau: `typecheck`, `eslint`, render 200, screenshot dark+light via agent-browser, 0 console error). Stats `3+/20+/98/24h` masih ilustratif — ganti angka real when ada data.
- Finishing pass 2026-10-28 (hijau: `typecheck`, `eslint src --max-warnings=0`, `next build` EXIT 0): dark mode resmi shadcn (`next-themes` + `ThemeProvider` + `ThemeToggle`, default `system`), `suppressHydrationWarning`, `colorScheme`, anchor scroll offset, matcher proxy diperluas, guard session server-side (`(private)/layout.tsx` + `akun-pengguna/layout.tsx`), `callbackURL` login dihapus, banner login pakai `next/image` `priority`, avatar sidebar initials + `session.user.image`, token Radix `--anchor-width` dibetulkan, `not-found`/`error`/`loading`, SEO (`siteConfig`, metadata per page, noindex private/auth, `robots.ts`, `sitemap.ts`, OG/Twitter image, JSON-LD Person), security headers + `poweredByHeader: false`, `next-themes` masuk deps, `next-devtools-mcp` keluar dari deps (tetap dipakai via MCP `npx`), `.gitignore` `.env*` + `!.env.example`, SVG scaffold dihapus, `npm run typecheck` ditambah, brand sidebar role-aware (`Admin`/`Klien`). Runtime + axe (2026-10-28): `/`, `/dashboard`, `/akun-pengguna`, `/login`, 404 = 0 violations (banner login `color-contrast` incomplete/manual). A11y fix: logo header alt dekoratif, label nav, landmark sidebar, h1 dashboard, `aria-label` aksi tabel + loading sesi. Sisa: konten real, halaman case study, sosial footer, CI.
- Auth/DB: model + migrasi `20260917034125_init_auth` + singleton `global` + seed + rename `prisma.config.ts` + unifikasi `DATABASE_URL` + runtime check `/api/auth/ok → {"ok":true}` done (hijau: `tsc`, `prisma validate`, `eslint`, `db seed`, curl). Sisa: email flow ditunda (keputusan user — `sendVerificationEmail`/`sendResetPassword` belum definisi sampai ada provider email). Semua file auth/DB/seed/config sudah tracked (cek 2026-09-18 — klaim untracked lama sudah kedaluwarsa). Prompt Prisma tawarkan upgrade 8.0.0-rc — tolak. Keputusan versi: tetap 7.10.0 (Better Auth belum support Prisma 8 / integrasi belum cocok). Opsional stricter-dari-skill (di luar guide resmi): adapter dalam factory.
- CRUD `akun-pengguna` (scope `role=user`, guard admin-only di `proxy.ts`, role fixed `user`, email editable, ban permanen + alasan, proteksi diri) done + polish lanjutan (2026-09-17 s/d 2026-09-18, hijau: `tsc`, `eslint` file proyek, `prisma validate`, `next build` EXIT 0, runtime: page render judul+tabel+`test@mail.com` via admin session, chain API create→update→setPassword→ban→unban→remove OK, probe dibersihkan, total kembali 2; filter Dialog + sort server + chips + reset OK; toast `z-[100]` di depan dialog OK; badge `Belum verifikasi` dihapus; detail refactor profil + card catatan dihapus). Tanpa migrasi schema, tanpa dep baru (`use-debounce` sempat masuk lalu di-uninstall), tanpa custom `ac/roles`, tanpa impersonasi. Utang kecil: impor `cn` massal sudah dibetulkan 2026-09-18 (24 file `src/components/ui/*.tsx` → `@/lib/utils`; `src/lib/utils.ts` tetap re-export dari paket `cn`).
- Private: `dashboard/page.tsx` placeholder (h1 + arahan); avatar initials/`session.user.image`, brand role-aware, tanpa menu Profile. Dropdown + sign-out done via `LogoutButton`.
- Login: form + error map per kode (`INVALID_EMAIL_OR_PASSWORD`, `CREDENTIAL_ACCOUNT_NOT_FOUND`, `EMAIL_NOT_VERIFIED`, `BANNED_USER`, + pesan jaringan) done. Sisa: `rememberMe: false` = keputusan (tutup browser = logout).
- Konten `projects`/`services` masih placeholder + metrik ilustratif. Tombol `View case study` masih mengarah ke `#contact` sampai route case study ada. Konten real + case-study when siap.
- About `#contact` anchor hidup di dalam `AboutSection`; pindah ke section kontak sendiri when form kontak masuk.
