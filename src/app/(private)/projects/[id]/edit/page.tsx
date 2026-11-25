import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Images, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import type { ProjectFormValues } from "@/modules/project/project.schema";

import { ProjectForm } from "../../_components/project-form";

export const metadata: Metadata = {
  title: "Edit Project",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const defaultValues: ProjectFormValues = {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description ?? "",
    role: project.role ?? "",
    year: project.year ? String(project.year) : "",
    techStack: project.techStack ?? "",
    liveUrl: project.liveUrl ?? "",
    status: project.publishedAt ? "published" : "draft",
    sortOrder: String(project.sortOrder),
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">Edit Project</h1>
        <p className="text-sm text-muted-foreground">
          Perbarui data {project.title}.
        </p>
      </div>
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Formulir Project</CardTitle>
          <CardDescription>Perubahan tersimpan setelah tombol ditekan</CardDescription>

          <CardAction className="flex flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/projects/${project.id}`} />}
              nativeButton={false}
            >
              <Images data-icon="inline-start" />
              <span className="hidden sm:block">Aset</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/projects" />}
              nativeButton={false}
            >
              <List data-icon="inline-start" />
              <span className="hidden sm:block">List Project</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <ProjectForm
            mode="edit"
            projectId={project.id}
            defaultValues={defaultValues}
          />
        </CardContent>
      </Card>
    </div>
  );
}
