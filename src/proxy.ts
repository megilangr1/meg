import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login";
  const protectedPaths = [
    "/dashboard",
    "/master-data",
    "/pendataan-area",
    "/akun-pengguna",
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isAuthPage) {
    const sesCheck = await getSession();

    if (sesCheck)
      return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (isProtected) {
    const sesCheck = await getSession();
    if (!sesCheck) return NextResponse.redirect(new URL("/login", request.url));

    if (
      pathname.startsWith("/akun-pengguna") &&
      (sesCheck.user as { role?: string }).role !== "admin"
    )
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)"],
};
