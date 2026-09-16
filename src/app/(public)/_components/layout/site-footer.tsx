import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/logo.png"
              alt="MeGGi"
              width={96}
              height={24}
              className="h-6 w-auto dark:hidden"
              loading="eager"
            />
            <Image
              src="/brand/logo-clear.png"
              alt="MeGGi"
              width={96}
              height={24}
              className="hidden h-6 w-auto dark:block"
              loading="eager"
            />
          </div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#services" className="hover:text-foreground">
              Services
            </Link>
            <Link href="#work" className="hover:text-foreground">
              Work
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Login
            </Link>
          </nav>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MeGGi dev. Built with Next.js + shadcn/ui
          + Magic UI.
        </p>
      </div>
    </footer>
  );
}
