import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

import { ProjectGallery, type GalleryMedia } from "../../_components/project-gallery";

export const revalidate = 60;

async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: {
      assets: { orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] },
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
      images: project.bannerPath ? [{ url: `/media/${project.bannerPath}` }] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

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
  const documents: GalleryMedia[] = media.filter((asset) => asset.kind === "document");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-16 pb-24">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          render={<Link href="/work" />}
          nativeButton={false}
        >
          <ArrowLeft data-icon="inline-start" />
          Semua project
        </Button>

        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-muted-foreground">{project.summary}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.role && <Badge variant="secondary">{project.role}</Badge>}
            {project.year && <Badge variant="outline">{project.year}</Badge>}
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
        </div>
      </div>

      {project.bannerPath && (
        <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted/40">
          <Image
            src={`/media/${project.bannerPath}`}
            alt={project.bannerAlt ?? project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      )}

      {project.description && (
        <p className="max-w-3xl whitespace-pre-line text-muted-foreground">
          {project.description}
        </p>
      )}

      <ProjectGallery images={images} videos={videos} documents={documents} />
    </main>
  );
}
