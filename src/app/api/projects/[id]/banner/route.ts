import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";
import { denyNonAdmin } from "@/modules/project/project.guard";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const denied = await denyNonAdmin();
  if (denied) return denied;

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!project) return Response.json({ error: "Project tidak ditemukan." }, { status: 404 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return Response.json({ error: "File wajib diisi." }, { status: 422 });

  const alt = String(form.get("alt") ?? "").trim().slice(0, 200) || null;

  // Validasi sebelum menulis: jangan tinggalkan file salah jenis di disk.
  if (!file.type.startsWith("image/"))
    return Response.json({ error: "Banner harus berupa gambar." }, { status: 422 });

  try {
    const saved = await saveUpload(file);
    if (saved.kind !== "image")
      return Response.json({ error: "Banner harus berupa gambar." }, { status: 422 });

    await prisma.project.update({
      where: { id },
      data: { bannerPath: saved.path, bannerAlt: alt },
    });

    revalidatePath(`/projects/${id}/edit`);
    return Response.json({ path: saved.path });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    const message =
      code === "FILE_TOO_LARGE"
        ? "Ukuran gambar maksimal 20 MB."
        : code === "UNSUPPORTED_TYPE"
          ? "Format gambar harus jpeg/png/webp/avif."
          : "Gagal menyimpan banner.";
    return Response.json({ error: message }, { status: 422 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await denyNonAdmin();
  if (denied) return denied;

  const { id } = await params;
  await prisma.project.update({
    where: { id },
    data: { bannerPath: null, bannerAlt: null },
  });

  revalidatePath(`/projects/${id}/edit`);
  return Response.json({ ok: true });
}
