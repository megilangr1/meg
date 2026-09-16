import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const projects = [
  {
    index: "01",
    title: "SaaS analytics dashboard",
    role: "Full-stack build",
    year: "2026",
    description:
      "Multi-tenant analytics: auth, roles, realtime charts, billing-ready structure. One codebase, tight data flow.",
    tags: ["Next.js", "Postgres", "Realtime"],
    metrics: [
      { value: "98", label: "Lighthouse" },
      { value: "0.8s", label: "LCP" },
      { value: "12", label: "Tenants live" },
    ],
    visual: "dashboard" as const,
  },
  {
    index: "02",
    title: "Company profile site",
    role: "Design + build",
    year: "2025",
    description:
      "Marketing site with CMS content, i18n routing, instant navigation. Editors ship pages, devs stay out of the way.",
    tags: ["Magic UI", "Motion", "CMS"],
    metrics: [
      { value: "100", label: "Lighthouse" },
      { value: "0.5s", label: "LCP" },
      { value: "3", label: "Locales" },
    ],
    visual: "site" as const,
  },
  {
    index: "03",
    title: "Token-based design system",
    role: "System + docs",
    year: "2025",
    description:
      "Component kit on semantic tokens: light/dark, one import path, docs with live examples. Registry-ready.",
    tags: ["Base UI", "Tailwind", "Docs"],
    metrics: [
      { value: "40+", label: "Components" },
      { value: "2", label: "Themes" },
      { value: "1", label: "Import path" },
    ],
    visual: "system" as const,
  },
];

function ProjectVisual({ kind }: { kind: "dashboard" | "site" | "system" }) {
  if (kind === "dashboard") {
    return (
      <div className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="ml-2 rounded-md bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            app.meggi.dev/overview
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["MRR", "Active", "Churn"].map((k) => (
            <div key={k} className="rounded-lg border bg-background p-3">
              <p className="text-[11px] text-muted-foreground">{k}</p>
              <div className="mt-1 h-2 w-3/4 rounded-full bg-primary/70" />
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-7 items-end gap-2 rounded-lg border bg-background p-4">
          {[40, 65, 50, 80, 58, 92, 70].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="w-full rounded-sm bg-primary/80 first:bg-muted-foreground/40"
            />
          ))}
        </div>
      </div>
    );
  }

  if (kind === "site") {
    return (
      <div className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="ml-2 rounded-md bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            meggi.dev
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 rounded-lg border bg-background p-5">
          <div className="h-3 w-2/3 rounded-full bg-foreground" />
          <div className="h-3 w-1/2 rounded-full bg-foreground" />
          <div className="mt-1 h-2 w-3/4 rounded-full bg-muted-foreground/50" />
          <div className="h-2 w-2/3 rounded-full bg-muted-foreground/50" />
          <div className="mt-3 flex gap-2">
            <div className="h-7 w-24 rounded-md bg-primary" />
            <div className="h-7 w-24 rounded-md border bg-background" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Fast", "CMS", "i18n"].map((k) => (
            <div
              key={k}
              className="rounded-lg border bg-background p-2 text-center text-[11px] text-muted-foreground"
            >
              {k}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        <span className="ml-2 rounded-md bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
          ui.meggi.dev/tokens
        </span>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-3">
        <div className="rounded-lg bg-primary" />
        <div className="rounded-lg bg-secondary" />
        <div className="rounded-lg bg-accent" />
        <div className="rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-background p-3">
          <div className="h-2 w-1/2 rounded-full bg-muted-foreground/50" />
          <div className="mt-2 h-7 rounded-md bg-primary" />
        </div>
        <div className="rounded-lg border bg-background p-3">
          <div className="h-2 w-1/2 rounded-full bg-muted-foreground/50" />
          <div className="mt-2 flex gap-1.5">
            <div className="h-7 flex-1 rounded-md border" />
            <div className="h-7 flex-1 rounded-md border" />
            <div className="h-7 flex-1 rounded-md border" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="flex flex-col gap-12">
      <BlurFade delay={0} inView>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-2">
            <Badge className="w-fit" variant="outline">
              Selected work
            </Badge>
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              Recent projects
            </h2>
            <p className="text-muted-foreground">
              Three builds, three shapes. Each row: what it is, what it
              shipped, what it measured.
            </p>
          </div>
          <Button
            variant="ghost"
            render={<Link href="#contact" />}
            nativeButton={false}
          >
            Request full list
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </BlurFade>

      <div className="flex flex-col gap-12">
        {projects.map((p, i) => (
          <BlurFade key={p.title} delay={0} inView>
            <article className="grid items-center gap-8 lg:grid-cols-2">
              <div
                className={
                  i % 2 === 1 ? "lg:order-2" : undefined
                }
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                  <div className="relative h-full">
                    <ProjectVisual kind={p.visual} />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{p.index}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge>{p.year}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">{p.role}</p>
                <h3 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                  {p.title}
                </h3>
                <p className="max-w-lg text-muted-foreground">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
                <dl className="flex gap-8">
                  {p.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col gap-1">
                      <dt className="order-2 text-xs text-muted-foreground">
                        {m.label}
                      </dt>
                      <dd className="order-1 font-heading text-2xl font-semibold">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Button render={<Link href="#contact" />} nativeButton={false}>
                    View case study
                    <ArrowUpRight data-icon="inline-end" />
                  </Button>
                  <Button
                    variant="outline"
                    render={<Link href="#contact" />}
                    nativeButton={false}
                  >
                    Start similar
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              </div>
            </article>
            {i < projects.length - 1 && <Separator className="mt-12" />}
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
