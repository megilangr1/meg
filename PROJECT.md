# PROJECT.md — meg

Fresh init. Isi bertambah seiring fitur.

## Stack
- Next.js 16.3.5, React 19.2.8, TS strict, path `@/*` → `src/*`
- Tailwind v4 (`src/app/globals.css`), `tw-animate-css`, shadcn style `base-nova`, baseColor neutral, CSS vars on
- UI: `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `motion`, `cobe`
- Registry: `@magicui` → `https://magicui.design/r/{name}`

## Struktur
- `src/app/layout.tsx` — root, font Outfit + Geist, `cn`
- `src/app/(public)/page.tsx` → `/`, link `/login`
- `src/app/(public)/layout.tsx` — wrapper div polos
- `src/app/(auth)/login/page.tsx` → `/login`, link `/dashboard`
- `src/app/(private)/dashboard/page.tsx` → `/dashboard`, link `/`
- `src/components/ui/` — `button.tsx`, `card.tsx`, `globe.tsx`
- `src/lib/utils.ts` — re-export `cn` dari `cn`
- `next.config.ts` — kosong default

## MCP (`opencode.json`, semua `enabled:true`, `type:local`)
- `next-devtools` — `npx -y next-devtools-mcp@latest` — error/route/build/cache dev server
- `shadcn` — `npx shadcn@latest mcp` — tambah/cari komponen
- `magicuidesign-mcp` — `npx -y @magicuidesign/mcp@latest` — registry Magic UI

## Skills (`.agents/skills/`, 7, sesuai `skills-lock.json`)
- `shadcn` — kelola komponen shadcn
- `migrate-radix-to-base` — migrasi Radix → Base UI
- `next-dev-loop` — verifikasi runtime via `next dev` + browser
- `next-cache-components-adoption` / `next-cache-components-optimizer` — Cache Components
- `next-partial-prefetching-adoption` / `next-partial-prefetching-optimizer` — Partial Prefetching

## Perintah
- `npm run dev` — dev server
- `npm run build` / `npm run start` — build/start
- `npm run lint` — `eslint`

## Aturan agen
- Next.js ini breaking changes. Baca `node_modules/next/dist/docs/` sebelum tulis kode. Patuhi deprecation.
- `AGENTS.md` auto-generate oleh `next dev`. Jangan hapus manual.
