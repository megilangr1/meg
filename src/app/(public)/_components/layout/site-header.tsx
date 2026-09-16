import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteSidebar from "./site-sidebar";

const nav = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/logo-icon-clear.png"
            alt="MeGGi dev"
            width={32}
            height={32}
            className="size-8 dark:invert"
          />
          <span className="font-heading text-base font-semibold">
            MeGGi dev
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Login
          </Button>
          <Button
            size="sm"
            render={<Link href="#contact" />}
            nativeButton={false}
          >
            Hire me
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <SiteSidebar nav={nav} />
      </div>
    </header>
  );
}
