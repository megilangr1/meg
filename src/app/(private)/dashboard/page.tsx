import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p className="text-muted-foreground">
        Ringkasan area kerja akan tampil di sini.
      </p>

      <Link href="/" className="text-sm underline underline-offset-4">
        Buka halaman publik
      </Link>
    </div>
  );
}
