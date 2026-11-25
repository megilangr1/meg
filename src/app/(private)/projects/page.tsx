import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import {
  PROJECT_DEFAULT_LIMIT,
  PROJECT_LIMIT_OPTIONS,
} from "@/modules/project/project.schema";

import { ProjectActions } from "./_components/project-actions";

export const metadata: Metadata = {
  title: "Projects",
};

type ListSearchParams = {
  q?: string;
  page?: string;
  limit?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();

  const parsedLimit = Number(params.limit);
  const limit = (PROJECT_LIMIT_OPTIONS as readonly number[]).includes(parsedLimit)
    ? parsedLimit
    : PROJECT_DEFAULT_LIMIT;

  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const where = q
    ? { OR: [{ title: { contains: q } }, { slug: { contains: q } }] }
    : {};

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        year: true,
        sortOrder: true,
        publishedAt: true,
        _count: { select: { assets: true } },
      },
    }),
  ]);

  const lastPage = Math.max(Math.ceil(total / limit), 1);
  const pageHref = (target: number) =>
    `/projects?${new URLSearchParams({
      ...(q ? { q } : {}),
      limit: String(limit),
      page: String(target),
    })}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Daftar project portfolio yang tampil di halaman publik.
        </p>
      </div>

      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Daftar Project</CardTitle>
          <CardDescription>{total} project tersimpan</CardDescription>

          <CardAction className="flex flex-row items-center gap-2">
            <form action="/projects" className="flex flex-row gap-2">
              <Input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Cari judul atau slug"
                className="w-40 sm:w-56"
                aria-label="Cari project"
              />
              <Button type="submit" variant="outline" size="icon-sm" aria-label="Cari">
                <Search />
              </Button>
            </form>
            <Button
              size="sm"
              render={<Link href="/projects/create" />}
              nativeButton={false}
            >
              <Plus data-icon="inline-start" />
              <span className="hidden sm:block">Tambah Project</span>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="p-0">
          {projects.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderKanban />
                </EmptyMedia>
                <EmptyTitle>{q ? "Tidak ada hasil" : "Belum ada project"}</EmptyTitle>
                <EmptyDescription>
                  {q
                    ? `Tidak ada project yang cocok dengan "${q}".`
                    : "Mulai dengan menambah project pertama."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button render={<Link href="/projects/create" />} nativeButton={false}>
                  <Plus data-icon="inline-start" />
                  Tambah Project
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Tahun</TableHead>
                <TableHead className="hidden sm:table-cell">Urutan</TableHead>
                <TableHead className="hidden sm:table-cell">Aset</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <Link href={`/projects/${project.id}`} className="hover:underline">
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden max-w-48 truncate text-muted-foreground md:table-cell">
                    {project.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.publishedAt ? "default" : "outline"}>
                      {project.publishedAt ? "Terbit" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {project.year ?? "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {project.sortOrder}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {project._count.assets}
                  </TableCell>
                  <TableCell className="text-right">
                    <ProjectActions
                      projectId={project.id}
                      title={project.title}
                      published={Boolean(project.publishedAt)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {lastPage > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Halaman {page} dari {lastPage}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" render={<Link href={pageHref(page - 1)} />} nativeButton={false}>
                Sebelumnya
              </Button>
            )}
            {page < lastPage && (
              <Button variant="outline" size="sm" render={<Link href={pageHref(page + 1)} />} nativeButton={false}>
                Berikutnya
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
