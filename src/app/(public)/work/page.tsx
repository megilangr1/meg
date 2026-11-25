import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { FolderKanban } from "lucide-react";

export const metadata: Metadata = {
  title: "Work",
  description: "Kumpulan project yang pernah saya garap.",
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
      bannerPath: true,
      bannerAlt: true,
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-16 pb-24">
      <header className="flex max-w-2xl flex-col gap-3">
        <Badge variant="outline" className="w-fit">
          Work
        </Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Project yang sudah dikerjakan
        </h1>
        <p className="text-muted-foreground">
          {projects.length > 0
            ? `${projects.length} project terbit — klik untuk melihat detail, galeri, dan dokumennya.`
            : "Belum ada project yang diterbitkan."}
        </p>
      </header>

      {projects.length === 0 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderKanban />
            </EmptyMedia>
            <EmptyTitle>Belum ada project</EmptyTitle>
            <EmptyDescription>
              Project muncul di sini setelah diterbitkan dari dashboard.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="gap-0 overflow-hidden pt-0">
              <Link
                href={`/work/${project.slug}`}
                className="relative block aspect-video border-b bg-muted/40"
                aria-label={`Buka ${project.title}`}
              >
                {project.bannerPath ? (
                  <Image
                    src={`/media/${project.bannerPath}`}
                    alt={project.bannerAlt ?? project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 bg-linear-to-br from-brand/20 via-transparent to-transparent" />
                )}
              </Link>

              <CardHeader>
                <CardTitle>
                  <Link href={`/work/${project.slug}`} className="hover:underline">
                    {project.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {project.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
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

                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  render={<Link href={`/work/${project.slug}`} />}
                  nativeButton={false}
                >
                  Lihat detail
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
