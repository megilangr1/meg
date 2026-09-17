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
| `/login` | Auth — split-screen with banner image | UI shell only, no form yet |
| `/dashboard` | Private app — sidebar + header layout | Placeholder page |

Canonical URL: `https://meggi.dev`

## Stack

- **Framework:** Next.js 16.3.5 (App Router), React 19.2.8, TypeScript strict
- **Styling:** Tailwind CSS v4, `tw-animate-css`, shadcn style `base-nova` (neutral, CSS vars on)
- **UI primitives:** `@base-ui/react`, `class-variance-authority`, `lucide-react`, `motion`
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

Verify UI changes with:

```bash
npx.cmd tsc --noEmit --skipLibCheck
npx.cmd eslint <file>
```

> PowerShell: use `npx.cmd` / `npm.cmd` (execution policy).

## Structure

```text
src/
  app/
    layout.tsx                # root: fonts, metadata, viewport themeColor
    (public)/
      layout.tsx              # SiteHeader + content + SiteFooter
      page.tsx                # assembles 5 sections only
      _components/
        layout/               # site-header, site-sidebar (mobile Sheet), site-footer
        page/                 # hero, stack-marquee, services, work, about
    (auth)/
      login/page.tsx          # /login split-screen shell
    (private)/
      layout.tsx              # SidebarProvider + AppSidebar + SidebarInset + AppHeader
      dashboard/page.tsx      # /dashboard placeholder
      _components/
        app-sidebar.tsx       # assembles 4 sidebar partials
        app-header.tsx        # SidebarTrigger + Separator
        sidebar/              # brand, nav-main, nav-other, user-info
    api/auth/[...all]/route.ts  # Better Auth gateway (toNextJsHandler)
  components/ui/              # avatar, badge, bento-grid, blur-fade, button, card,
                              # collapsible, context-menu, dropdown-menu, globe,
                              # input, marquee, separator, sheet, sidebar,
                              # skeleton, tooltip
  hooks/use-mobile.ts         # from sidebar CLI, do not hand-write
  lib/
    auth.ts                   # betterAuth: prismaAdapter + emailAndPassword + admin/nextCookies
    auth-client.ts            # createAuthClient + adminClient (no baseURL, same-domain)
    prisma.ts                 # PrismaMariaDb(DATABASE_URL) + PrismaClient singleton
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
- **Forms (when login lands):** `FieldGroup` + `Field` + `FieldLabel`, not raw divs.
- **`page.tsx` assembles sections, `layout.tsx` assembles chrome.** Dummy data stays in the section file until real content arrives.
- **Logo:** always `*-clear.png` (transparent) + `dark:invert`. Never swap files per theme.
- **Spacing:** `flex` + `gap-*`, `size-*`, `cn()` for conditionals. Semantic colors only (`bg-background`, `text-muted-foreground`).
- **Next.js here has breaking changes** — check `node_modules/next/dist/docs/` before writing framework code.

## Roadmap

- [x] DB: models + migration + singleton + single env source (`DATABASE_URL`) + seed
- [ ] Auth: login form (`Field` + `Input` + `Button` via CLI), `(auth)/layout`, real session for `/dashboard` (backend ready: `auth.ts`, `/api/auth/*`, 2 seeded users)
- [ ] Dashboard: replace `meg@mail.com` dummy, fix `<a href="#">`, real content
- [ ] Content: real projects/services + case studies, dedicated contact section (currently `#contact` lives inside About)

---

<div align="center">

Built by **MeGGi dev** — fast web apps, no bloat.

</div>
