import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";

const VISUALS = ["dashboard", "site", "system"] as const;

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
              <div className="mt-1 h-2 w-3/4 rounded-full bg-brand/70" />
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-7 items-end gap-2 rounded-lg border bg-background p-4">
          {[40, 65, 50, 80, 58, 92, 70].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="w-full rounded-sm bg-brand/80 first:bg-muted-foreground/40"
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
            <div className="h-7 w-24 rounded-md bg-brand" />
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
        <div className="rounded-lg bg-brand" />
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

export async function WorkSection() {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      role: true,
      year: true,
      techStack: true,
      bannerPath: true,
      bannerAlt: true,
    },
  });

  if (projects.length === 0) return null;

  return (
    <section id="work" className="flex scroll-mt-24 flex-col gap-12">
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
              {projects.length} project terakhir yang sudah terbit — lengkap dengan
              galeri dan dokumennya.
            </p>
          </div>
          <Button variant="ghost" render={<Link href="/work" />} nativeButton={false}>
            See all work
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </BlurFade>

      <div className="flex flex-col gap-12">
        {projects.map((project, i) => (
          <BlurFade key={project.id} delay={i * 0.05} inView>
            <article className="grid items-center gap-8 lg:grid-cols-2">
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <Link
                  href={`/work/${project.slug}`}
                  aria-label={`Buka ${project.title}`}
                  className="relative block aspect-4/3 overflow-hidden rounded-xl border bg-muted/40"
                >
                  {project.bannerPath ? (
                    <Image
                      src={`/media/${project.bannerPath}`}
                      alt={project.bannerAlt ?? project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-linear-to-br from-brand/10 via-transparent to-transparent" />
                      <div className="relative h-full">
                        <ProjectVisual kind={VISUALS[i % VISUALS.length]} />
                      </div>
                    </>
                  )}
                  <span className="absolute top-4 left-4">
                    <Badge variant="secondary">
                      {String(i + 1).padStart(2, "0")}
                    </Badge>
                  </span>
                  {project.year && (
                    <span className="absolute top-4 right-4">
                      <Badge>{project.year}</Badge>
                    </span>
                  )}
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {project.role && (
                  <p className="text-sm text-muted-foreground">{project.role}</p>
                )}
                <h3 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                  <Link href={`/work/${project.slug}`} className="hover:underline">
                    {project.title}
                  </Link>
                </h3>
                <p className="max-w-lg text-muted-foreground">{project.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack
                    ?.split(",")
                    .map((tech) => tech.trim())
                    .filter(Boolean)
                    .map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    render={<Link href={`/work/${project.slug}`} />}
                    nativeButton={false}
                  >
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
