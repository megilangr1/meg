import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Images, List, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import prisma from "@/lib/prisma";

import { ProjectMedia, type ProjectAssetRow } from "../_components/project-media";

export const metadata: Metadata = {
  title: "Detail Project",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      assets: {
        orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
  if (!project) notFound();

  const assets: ProjectAssetRow[] = project.assets.map((asset) => ({
    id: asset.id,
    kind: asset.kind,
    path: asset.path,
    mime: asset.mime,
    caption: asset.caption,
    sortOrder: asset.sortOrder,
    originalName: asset.originalName,
    size: asset.size,
  }));

  const facts = [
    { label: "Slug", value: `/work/${project.slug}` },
    { label: "Status", value: project.publishedAt ? "Terbit" : "Draft" },
    { label: "Peran", value: project.role ?? "—" },
    { label: "Tahun", value: project.year ? String(project.year) : "—" },
    { label: "Teknologi", value: project.techStack ?? "—" },
    { label: "Urutan", value: String(project.sortOrder) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-xl font-semibold">{project.title}</h1>
          <Badge variant={project.publishedAt ? "default" : "outline"}>
            {project.publishedAt ? "Terbit" : "Draft"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Kelola banner dan galeri project di halaman ini.
        </p>
      </div>

      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Informasi Project</CardTitle>
          <CardDescription>{project.summary}</CardDescription>
          <CardAction className="flex flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/projects" />}
              nativeButton={false}
            >
              <List data-icon="inline-start" />
              <span className="hidden sm:block">List Project</span>
            </Button>
            <Button
              size="sm"
              render={<Link href={`/projects/${project.id}/edit`} />}
              nativeButton={false}
            >
              <Pencil data-icon="inline-start" />
              <span className="hidden sm:block">Edit Info</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <ItemGroup>
            {facts.map((fact) => (
              <Item key={fact.label} className="rounded-none border-b last:border-b-0">
                <ItemContent>
                  <ItemDescription>{fact.label}</ItemDescription>
                  <ItemTitle className="break-all font-normal">{fact.value}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
            {project.description && (
              <Item className="rounded-none">
                <ItemContent>
                  <ItemDescription>Deskripsi</ItemDescription>
                  <ItemTitle className="font-normal whitespace-pre-line">
                    {project.description}
                  </ItemTitle>
                </ItemContent>
              </Item>
            )}
          </ItemGroup>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 pt-2">
        <Images className="text-muted-foreground" />
        <h2 className="font-heading text-base font-semibold">Aset Project</h2>
      </div>

      <ProjectMedia
        projectId={project.id}
        banner={{ path: project.bannerPath, alt: project.bannerAlt }}
        assets={assets}
      />
    </div>
  );
}
