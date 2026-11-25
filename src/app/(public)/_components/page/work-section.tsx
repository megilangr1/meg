import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import prisma from "@/lib/prisma";

export async function WorkSection() {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 4,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      role: true,
      year: true,
      techStack: true,
    },
  });

  if (projects.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.6fr] lg:gap-24 lg:py-28">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
            01 — Selected work
          </p>
          <h2 className="mt-5 max-w-sm font-display font-medium text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl">
            Bukti kerja, bukan daftar klaim.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Aplikasi pemerintahan, sistem internal, dan e-commerce yang sudah
            dipakai. Setiap studi kasus menjelaskan konteks, keputusan, dan
            stack yang dipakai.
          </p>
          <Link
            href="/work"
            className="group mt-8 inline-flex items-center gap-2 border-b border-foreground pb-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors hover:border-brand hover:text-brand"
          >
            Semua studi kasus
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </header>

        <div className="border-t border-border">
          {projects.map((project, index) => {
            const tech = project.techStack
              ?.split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 4);

            return (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className="group grid gap-5 border-b border-border py-7 transition-colors hover:bg-card/70 sm:grid-cols-[2.5rem_1fr_auto] sm:gap-6 sm:px-3"
              >
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="font-display font-medium text-2xl leading-tight tracking-[-0.01em] transition-colors group-hover:text-brand sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                    {project.role && <span>{project.role}</span>}
                    {tech?.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-6 sm:flex-col sm:items-end">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {project.year ?? "—"}
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
