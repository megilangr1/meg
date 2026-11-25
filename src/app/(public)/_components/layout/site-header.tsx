import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/lib/site";

import SiteSidebar from "./site-sidebar";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/brand/logo-icon-clear.png"
            alt=""
            width={32}
            height={32}
            className="size-7 dark:invert"
          />
          <span className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase">
            {siteConfig.name}
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 text-sm text-muted-foreground md:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-2 transition-colors hover:text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href={`mailto:${siteConfig.email}`}
            className="group ml-1 hidden h-10 items-center gap-2 rounded-sm border border-foreground px-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors hover:bg-foreground hover:text-background md:inline-flex"
          >
            Email
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <SiteSidebar nav={nav} />
        </div>
      </div>
    </header>
  );
}
