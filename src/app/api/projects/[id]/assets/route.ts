import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";
import { denyNonAdmin } from "@/modules/project/project.guard";

const uploadErrorMessage = (error: unknown) => {
  const code = error instanceof Error ? error.message : "";
  if (code === "UNSUPPORTED_TYPE")
    return "Tipe file tidak didukung. Gambar: jpeg/png/webp/avif, video: mp4/webm, dokumen: pdf.";
  if (code === "FILE_TOO_LARGE") return "Ukuran file maksimal 20 MB.";
  if (code === "EMPTY_FILE") return "File kosong.";
  return "Gagal menyimpan file.";
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const caption = String(form.get("caption") ?? "").trim().slice(0, 300) || null;

  try {
    const saved = await saveUpload(file);
    const siblings = await prisma.projectAsset.count({
      where: { projectId: id, kind: saved.kind },
    });

    const asset = await prisma.projectAsset.create({
      data: { projectId: id, ...saved, caption, sortOrder: siblings },
    });

    revalidatePath(`/projects/${id}/edit`);
    return Response.json({ asset });
  } catch (error) {
    return Response.json({ error: uploadErrorMessage(error) }, { status: 422 });
  }
}
