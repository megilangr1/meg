import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { denyNonAdmin } from "@/modules/project/project.guard";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const denied = await denyNonAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((value): value is string => typeof value === "string")
    : [];

  if (ids.length === 0 || ids.length > 500)
    return Response.json({ error: "Daftar urutan tidak valid." }, { status: 422 });

  // Semua id harus milik project ini — kalau tidak, jangan menulis apa pun.
  const owned = await prisma.projectAsset.count({
    where: { id: { in: ids }, projectId: id },
  });
  if (owned !== ids.length)
    return Response.json({ error: "Ada aset yang bukan milik project ini." }, { status: 400 });

  await prisma.$transaction(
    ids.map((assetId, index) =>
      prisma.projectAsset.updateMany({
        where: { id: assetId, projectId: id },
        data: { sortOrder: index },
      }),
    ),
  );

  revalidatePath(`/projects/${id}/edit`);
  return Response.json({ ok: true });
}
