import { getSession } from "@/lib/session";

/** Guard bersama untuk route handler project: null = boleh, selain itu respons siap kirim. */
export async function denyNonAdmin() {
  const session = await getSession();
  if (!session)
    return Response.json({ error: "Sesi berakhir. Login ulang." }, { status: 401 });
  if (session.user.role !== "admin")
    return Response.json({ error: "Hanya admin." }, { status: 403 });
  return null;
}
