"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";

export default function SiteSidebar({
  nav,
}: {
  nav: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-11 md:hidden"
        aria-label="Buka menu"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="gap-0">
          <SheetHeader className="border-b">
            <SheetTitle className="font-mono text-xs tracking-[0.16em] uppercase">
              {siteConfig.name}
            </SheetTitle>
            <SheetDescription>
              Work, about, dan kontak.
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile" className="flex flex-col py-2">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline justify-between border-b px-4 py-4 text-lg transition-colors hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </nav>
          <SheetFooter>
            <Button
              className="h-11 w-full"
              render={
                <Link
                  href={`mailto:${siteConfig.email}`}
                  onClick={() => setOpen(false)}
                />
              }
              nativeButton={false}
            >
              Email saya
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
