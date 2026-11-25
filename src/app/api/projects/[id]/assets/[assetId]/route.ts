import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { denyNonAdmin } from "@/modules/project/project.guard";

type Context = { params: Promise<{ id: string; assetId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const denied = await denyNonAdmin();
  if (denied) return denied;

  const { id, assetId } = await params;
  const body = (await request.json().catch(() => null)) as {
    caption?: unknown;
    sortOrder?: unknown;
  } | null;
  if (!body) return Response.json({ error: "Body tidak valid." }, { status: 422 });

  const data: { caption?: string | null; sortOrder?: number } = {};
  if ("caption" in body)
    data.caption = String(body.caption ?? "").trim().slice(0, 300) || null;
  if ("sortOrder" in body) {
    const order = Number(body.sortOrder);
    if (!Number.isInteger(order)) return Response.json({ error: "Urutan tidak valid." }, { status: 422 });
    data.sortOrder = order;
  }
  if (Object.keys(data).length === 0)
    return Response.json({ error: "Tidak ada perubahan." }, { status: 422 });

  const { count } = await prisma.projectAsset.updateMany({
    where: { id: assetId, projectId: id },
    data,
  });
  if (count === 0) return Response.json({ error: "Aset tidak ditemukan." }, { status: 404 });

  revalidatePath(`/projects/${id}/edit`);
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await denyNonAdmin();
  if (denied) return denied;

  const { id, assetId } = await params;

  // Baris saja; file di disk sengaja dibiarkan.
  const { count } = await prisma.projectAsset.deleteMany({
    where: { id: assetId, projectId: id },
  });
  if (count === 0) return Response.json({ error: "Aset tidak ditemukan." }, { status: 404 });

  revalidatePath(`/projects/${id}/edit`);
  return Response.json({ ok: true });
}
