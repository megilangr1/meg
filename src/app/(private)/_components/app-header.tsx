"use client";

import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageTitles = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/akun-pengguna", label: "Akun Pengguna" },
];

export function AppHeader() {
  const pathname = usePathname();
  const title =
    pageTitles.find(
      (page) => pathname === page.href || pathname.startsWith(`${page.href}/`),
    )?.label ?? "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-8" />
        <p className="text-sm font-medium">{title}</p>
      </div>

      <div className="ml-auto px-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
