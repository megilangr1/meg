"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getProjectErrorMessage } from "@/modules/project/project.errors";
import {
  slugify,
  type ProjectFormValues,
} from "@/modules/project/project.schema";

export type ActionResult = { ok: true; id?: string } | { ok: false; message: string };

async function denied() {
  const session = await getSession();
  if (!session) return { ok: false as const, message: "Sesi berakhir. Login ulang." };
  if (session.user.role !== "admin")
    return { ok: false as const, message: "Hanya admin yang boleh mengubah project." };
  return null;
}

const SLUG_REQUIRED = "Slug tidak bisa dibuat dari judul — isi manual.";

function toData(values: ProjectFormValues, publishedAt: Date | null) {
  return {
    slug: values.slug || slugify(values.title),
    title: values.title,
    summary: values.summary,
    description: values.description || null,
    role: values.role || null,
    techStack: values.techStack || null,
    year: values.year ? Number(values.year) : null,
    sortOrder: Number(values.sortOrder || 0),
    publishedAt,
  };
}

export async function createProject(values: ProjectFormValues): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  const data = toData(values, values.status === "published" ? new Date() : null);
  if (!data.slug) return { ok: false, message: SLUG_REQUIRED };

  try {
    const created = await prisma.project.create({ data, select: { id: true } });
    revalidatePath("/projects");
    revalidatePath(`/projects/${created.id}`);
    return { ok: true, id: created.id };
  } catch (error) {
    return { ok: false, message: getProjectErrorMessage(error) };
  }
}

export async function updateProject(
  id: string,
  values: ProjectFormValues,
): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  try {
    const current = await prisma.project.findUnique({
      where: { id },
      select: { publishedAt: true },
    });
    if (!current) return { ok: false, message: "Project tidak ditemukan." };

    const data = toData(
      values,
      values.status === "published" ? (current.publishedAt ?? new Date()) : null,
    );
    if (!data.slug) return { ok: false, message: SLUG_REQUIRED };

    await prisma.project.update({ where: { id }, data });
  } catch (error) {
    return { ok: false, message: getProjectErrorMessage(error) };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath(`/projects/${id}/edit`);
  return { ok: true, id };
}

export async function setProjectStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  try {
    const current = await prisma.project.findUnique({
      where: { id },
      select: { publishedAt: true },
    });
    if (!current) return { ok: false, message: "Project tidak ditemukan." };

    await prisma.project.update({
      where: { id },
      data: {
        publishedAt:
          status === "published" ? (current.publishedAt ?? new Date()) : null,
      },
    });
  } catch (error) {
    return { ok: false, message: getProjectErrorMessage(error) };
  }

  revalidatePath("/projects");
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const blocked = await denied();
  if (blocked) return blocked;

  try {
    // Asset rows ikut terhapus (onDelete: Cascade); file di disk sengaja dibiarkan.
    await prisma.project.delete({ where: { id } });
  } catch (error) {
    return { ok: false, message: getProjectErrorMessage(error) };
  }

  revalidatePath("/projects");
  return { ok: true };
}
