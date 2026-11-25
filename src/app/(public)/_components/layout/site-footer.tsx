import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-icon-clear.png"
                alt=""
                width={28}
                height={28}
                className="size-7 dark:invert"
              />
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase">
                {siteConfig.name}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Fullstack web developer. Laravel, MySQL, REST API, React/Next.js,
              dan Linux.
            </p>
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {siteConfig.location}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Navigasi
            </p>
            <Link href="/work" className="w-fit hover:text-brand">
              Work
            </Link>
            <Link href="/#about" className="w-fit hover:text-brand">
              About
            </Link>
            <Link href="/#contact" className="w-fit hover:text-brand">
              Contact
            </Link>
            <Link href="/login" className="w-fit text-muted-foreground hover:text-foreground">
              Login
            </Link>
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Kontak
            </p>
            <Link
              href={`mailto:${siteConfig.email}`}
              className="group inline-flex w-fit items-center gap-2 hover:text-brand"
            >
              {siteConfig.email}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`mailto:${siteConfig.email}?subject=Permintaan%20CV`}
              className="w-fit text-muted-foreground hover:text-foreground"
            >
              Minta CV
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <p>Dibangun dengan Next.js, Prisma, dan MySQL</p>
        </div>
      </div>
    </footer>
  );
}
