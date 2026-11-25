import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import prisma from "@/lib/prisma";

import { ProjectGallery, type GalleryMedia } from "../../_components/project-gallery";

export const revalidate = 60;

async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: {
      assets: {
        orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Project tidak ditemukan" };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.bannerPath
        ? [{ url: `/media/${project.bannerPath}` }]
        : undefined,
    },
  };
}

function headingLabel(block: string) {
  if (!block.startsWith("## ")) return null;
  return block.split("\n")[0].slice(3).trim();
}

function ProjectBody({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="max-w-2xl">
      {blocks.map((block, index) => {
        const heading = headingLabel(block);

        if (heading) {
          const body = block.split("\n").slice(1).join("\n").trim();

          return (
            <div
              key={index}
              className="mt-12 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0"
            >
              <h2
                id={`section-${index}`}
                className="scroll-mt-24 font-display font-medium text-3xl leading-tight tracking-[-0.01em]"
              >
                {heading}
              </h2>
              {body && (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {body}
                </p>
              )}
            </div>
          );
        }

        return (
          <p
            key={index}
            className="mt-5 text-base leading-relaxed text-muted-foreground first:mt-0"
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const nextProject =
    (await prisma.project.findFirst({
      where: {
        publishedAt: { not: null },
        sortOrder: { gt: project.sortOrder },
      },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true, summary: true },
    })) ??
    (await prisma.project.findFirst({
      where: { publishedAt: { not: null }, id: { not: project.id } },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true, summary: true },
    }));

  const media = project.assets.map((asset) => ({
    kind: asset.kind,
    path: asset.path,
    mime: asset.mime,
    caption: asset.caption,
    originalName: asset.originalName,
    size: asset.size,
  }));

  const images: GalleryMedia[] = media.filter((asset) => asset.kind === "image");
  const videos: GalleryMedia[] = media.filter((asset) => asset.kind === "video");
  const documents: GalleryMedia[] = media.filter(
    (asset) => asset.kind === "document",
  );

  const sections =
    project.description
      ?.split(/\n{2,}/)
      .map((block, index) => ({ label: headingLabel(block), index }))
      .filter((section): section is { label: string; index: number } =>
        Boolean(section.label),
      )
      .map((section) => ({
        id: `section-${section.index}`,
        label: section.label,
      })) ?? [];

  const tech = project.techStack
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main id="main">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 lg:pt-20">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Semua studi kasus
        </Link>

        <header className="mt-12 grid gap-12 border-b border-border pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
              Case study / {project.year ?? "—"}
            </p>
            <h1 className="mt-5 max-w-3xl font-display font-medium text-5xl leading-[0.96] tracking-[-0.03em] text-balance sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {project.summary}
            </p>
          </div>

          <dl className="self-end border-t border-foreground/30">
            <div className="grid grid-cols-[5rem_1fr] gap-4 border-b border-border py-3">
              <dt className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                Peran
              </dt>
              <dd className="text-sm">{project.role ?? "—"}</dd>
            </div>
            <div className="grid grid-cols-[5rem_1fr] gap-4 border-b border-border py-3">
              <dt className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                Tahun
              </dt>
              <dd className="text-sm tabular-nums">{project.year ?? "—"}</dd>
            </div>
            <div className="grid grid-cols-[5rem_1fr] gap-4 border-b border-border py-3">
              <dt className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                Stack
              </dt>
              <dd className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
                {tech && tech.length > 0
                  ? tech.map((item) => <span key={item}>{item}</span>)
                  : "—"}
              </dd>
            </div>
            {project.liveUrl && (
              <div className="grid grid-cols-[5rem_1fr] gap-4 border-b border-border py-3">
                <dt className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  Live
                </dt>
                <dd className="text-sm">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                  >
                    {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </header>

        {project.bannerPath && (
          <div className="relative mt-12 aspect-video overflow-hidden border border-border bg-muted">
            <Image
              src={`/media/${project.bannerPath}`}
              alt={project.bannerAlt ?? project.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        )}

        {project.description && (
          <div className="mt-16 grid gap-10 lg:grid-cols-[10rem_1fr] lg:gap-16">
            {sections.length > 0 && (
              <nav
                aria-label="Isi studi kasus"
                className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
              >
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Isi
                </p>
                <ol className="mt-4 flex flex-col gap-2">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="border-b border-transparent pb-0.5 group-hover:border-foreground">
                          {section.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <ProjectBody text={project.description} />
          </div>
        )}

        <div className="mt-16">
          <ProjectGallery images={images} videos={videos} documents={documents} />
        </div>

        {nextProject && (
          <Link
            href={`/work/${nextProject.slug}`}
            className="group mt-20 flex flex-col justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-end"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Studi kasus berikutnya
              </p>
              <p className="mt-3 max-w-2xl font-display font-medium text-3xl leading-tight tracking-[-0.01em] transition-colors group-hover:text-brand sm:text-4xl">
                {nextProject.title}
              </p>
            </div>
            <ArrowUpRight className="size-6 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
          </Link>
        )}
      </div>
    </main>
  );
}
