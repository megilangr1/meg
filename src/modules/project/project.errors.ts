export const PROJECT_NETWORK_ERROR_MESSAGE = "Koneksi bermasalah. Coba lagi.";

/** Prisma error dibaca struktural — client hanya boleh diimpor dari `src/lib/prisma.ts`. */
function errorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error
    ? (error as { code?: string }).code
    : undefined;
}

export function getProjectErrorMessage(error: unknown) {
  switch (errorCode(error)) {
    case "P2002":
      return "Slug sudah dipakai project lain.";
    case "P2025":
      return "Project tidak ditemukan.";
    default:
      console.error(error);
      return "Gagal menyimpan project.";
  }
}
