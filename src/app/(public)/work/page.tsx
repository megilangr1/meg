import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FolderKanban } from "lucide-react";

import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Studi kasus aplikasi web: Laravel, MySQL, REST API, React, dan Next.js.",
  alternates: { canonical: "/work" },
};

export const revalidate = 60;

export default async function Page() {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
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

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 lg:pt-20"
    >
      <Link
        href="/"
        className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
        Kembali
      </Link>

      <header className="mt-12 grid gap-8 border-b border-border pb-12 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
            Work index
          </p>
          <h1 className="mt-5 font-display font-medium text-5xl leading-[0.96] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Studi kasus.
          </h1>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground lg:justify-self-end">
          Aplikasi pemerintahan, sistem internal, dan e-commerce. Ditulis dari
          konteks sampai keputusan teknis — tanpa angka yang tidak bisa
          dipertanggungjawabkan.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="mt-16 flex flex-col items-center border border-dashed border-border px-6 py-20 text-center">
          <FolderKanban className="size-6 text-muted-foreground" />
          <p className="mt-4 font-display font-medium text-2xl">Belum ada project terbit.</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Project akan muncul di sini setelah diterbitkan dari dashboard.
          </p>
        </div>
      ) : (
        <div className="border-b border-border">
          {projects.map((project, index) => {
            const tech = project.techStack
              ?.split(",")
              .map((item) => item.trim())
              .filter(Boolean);

            return (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className="group grid gap-5 border-t border-border py-8 transition-colors hover:bg-card/70 sm:grid-cols-[3rem_1fr_10rem] sm:gap-6 sm:px-3"
              >
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <div className="flex items-start justify-between gap-6">
                    <h2 className="max-w-2xl font-display font-medium text-3xl leading-tight tracking-[-0.01em] transition-colors group-hover:text-brand sm:text-4xl">
                      {project.title}
                    </h2>
                    <ArrowUpRight className="mt-1 hidden size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand sm:block" />
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                  {tech && tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
                      {tech.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {project.year ?? "—"}
                  </span>
                  {project.role && (
                    <span className="text-right font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
                      {project.role}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
