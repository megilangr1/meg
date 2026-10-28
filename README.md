<div align="center">

<img src="public/brand/logo-clear.png" alt="MeGGi dev" width="220" />

# MeGGi dev — fast web apps

**Full-stack Next.js developer. Clean UI, solid architecture, no bloat.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7.10.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Base UI](https://img.shields.io/badge/UI-Base_UI-black)](https://base-ui.com)

[Stack](#-stack) · [Getting Started](#-getting-started) · [Structure](#-structure) · [Conventions](#-conventions) · [Roadmap](#-roadmap)

</div>

---

## About

Portfolio site for **MeGGi dev**, built with the Next.js App Router. Three areas:

| Route | Area | Status |
| --- | --- | --- |
| `/` | Public landing — hero, stack, services, work, about | Live sections, content still placeholder |
| `/login` | Auth — split-screen with banner image | Email/password form + error map |
| `/dashboard` | Private app — sidebar + header layout | Placeholder page |
| `/akun-pengguna` | Admin CRUD for `role=user` accounts | List, create, detail, edit, ban/unban, delete |

Canonical URL: `siteConfig.url` (`NEXT_PUBLIC_APP_URL`, fallback `https://meggi.dev`).

## Stack

- **Framework:** Next.js 16.3.5 (App Router), React 19.2.8, TypeScript strict
- **Styling:** Tailwind CSS v4, `tw-animate-css`, shadcn style `base-nova` (neutral, CSS vars on)
- **UI primitives:** `@base-ui/react`, `class-variance-authority`, `lucide-react`, `motion`
- **Dark mode:** `next-themes` (class strategy, default `system`) + `ThemeToggle` (Light/Dark/System)
- **Magic UI registry** (`@magicui`): `bento-grid`, `blur-fade`, `marquee`, `globe` (+ `cobe`)
- **Fonts:** Outfit (`--font-sans`) + Geist / Geist Mono
- **Database:** Prisma ORM 7.10.0 + `@prisma/adapter-mariadb`, provider `mysql` → MariaDB on XAMPP (`localhost:3306/meg`)
- **Auth:** Better Auth 1.7.5 (email/password + admin plugin, Prisma adapter)
- **Brand assets:** `public/brand/logo*.png` (`*-clear.png` = transparent variant), favicons in `public/favicons/`, login banner in `public/image/login-banner.jpg`

## Getting Started

Requirements: Node 20+, XAMPP MariaDB running on `localhost:3306` (or adjust env).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Copy and fill:

```bash
cp .env.example .env
```

Needed vars (see `.env.example`):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL="mysql://root:@localhost:3306/meg"
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET= # generate: openssl rand -base64 32
```

> Note: `.env*` is gitignored. `DATABASE_URL` is the single connection source (`src/lib/prisma.ts`, `prisma/seed/`, `prisma.config.ts`).

### Database

```bash
npx.cmd prisma validate
npx.cmd prisma generate
npx.cmd prisma migrate dev
npx.cmd prisma db seed
```

Schema (`prisma/schema.prisma`) has Better Auth models (`User`/`Session`/`Account`/`Verification` + admin fields), migration `20260917034125_init_auth` applied, seed via `prisma db seed` (admin + test user).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm run start` | Production build / start |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

Verify UI changes with:

```bash
npm.cmd run typecheck
npx.cmd eslint src --max-warnings=0
```

> PowerShell: use `npx.cmd` / `npm.cmd` (execution policy).

## Structure

```text
src/
  app/
    layout.tsx                # root: fonts, metadata, ThemeProvider, viewport
    error.tsx                 # error boundary
    not-found.tsx             # 404
    robots.ts / sitemap.ts    # SEO routes
    opengraph-image.tsx       # OG image (twitter-image re-export)
    (public)/
      layout.tsx              # SiteHeader + content + SiteFooter
      page.tsx                # 5 sections + canonical + JSON-LD
      _components/
        layout/               # site-header, site-sidebar (mobile Sheet), site-footer
        page/                 # hero, stack-marquee, services, work, about
    (auth)/
      login/page.tsx          # split-screen + form + theme toggle
      login/_components/      # login-form
    (private)/
      layout.tsx              # server session guard + sidebar/inset/header
      loading.tsx             # skeleton
      dashboard/page.tsx      # /dashboard placeholder
      akun-pengguna/          # list/create/detail/edit + admin layout guard
      _components/            # app-sidebar, app-header, sidebar/*
    api/auth/[...all]/route.ts # Better Auth gateway (toNextJsHandler)
  components/
    theme-provider.tsx        # next-themes wrapper
    shared/                   # logout-button, theme-toggle
    ui/                       # shadcn/base + Magic UI components
  hooks/use-mobile.ts         # from sidebar CLI, do not hand-write
  lib/
    auth.ts                   # betterAuth: prismaAdapter + emailAndPassword + admin/nextCookies
    auth-client.ts            # createAuthClient + adminClient (no baseURL, same-domain)
    prisma.ts                 # PrismaMariaDb(DATABASE_URL) + PrismaClient singleton
    session.ts                # cached getSession for layouts/pages
    site.ts                   # siteConfig for metadata/robots/sitemap/JSON-LD
    utils.ts                  # re-export cn
prisma/
  schema.prisma               # User/Session/Account/Verification (+ admin fields)
  migrations/20260917034125_init_auth/
  seed/                       # index.ts + auth.seed.ts (admin + test user)
  prisma.config.ts
```

Full internal notes: [`PROJECT.md`](./PROJECT.md)

## Conventions

- **Components:** never copy-paste — always `npx shadcn@latest add <item>`, then read the result and fix imports/icons before moving on.
- **Base UI, not Radix:** link-buttons use `Button render={<Link href />} nativeButton={false}`. Never `Link > Button`.
- **Forms:** `FieldGroup` + `Field` + `FieldLabel`, not raw divs.
- **`page.tsx` assembles sections, `layout.tsx` assembles chrome.** Dummy data stays in the section file until real content arrives.
- **Dark mode:** semantic tokens only; `next-themes` class strategy. `dark:` is reserved for the logo invert and the toggle icon animation.
- **Logo:** always `*-clear.png` (transparent) + `dark:invert`. Never swap files per theme.
- **Spacing:** `flex` + `gap-*`, `size-*`, `cn()` for conditionals. Semantic colors only (`bg-background`, `text-muted-foreground`).
- **Next.js here has breaking changes** — check `node_modules/next/dist/docs/` before writing framework code.

## Roadmap

- [x] DB: models + migration + singleton + single env source (`DATABASE_URL`) + seed
- [x] Auth: login form + error map, session guards (proxy + server layouts), admin CRUD
- [x] Finishing: dark mode, 404/error/loading, SEO (robots/sitemap/OG/JSON-LD), security headers
- [x] Accessibility: axe 0 violations on `/`, `/login`, `/dashboard`, `/akun-pengguna`, 404 (desktop + mobile)
- [ ] Dashboard: real content (still placeholder)
- [ ] Content: real projects/services + case studies, dedicated contact section (currently `#contact` lives inside About), social links in footer
- [ ] Optional: CI (lint + typecheck + build), analytics

---

<div align="center">

Built by **MeGGi dev** — fast web apps, no bloat.

</div>
