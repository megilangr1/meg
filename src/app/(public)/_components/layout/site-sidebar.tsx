"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
        className="md:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu />
        <span className="sr-only">Open menu</span>
      </Button>

      <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>MeGGi dev</SheetTitle>
            <SheetDescription>
              Navigate sections and get in touch.
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={"rounded-lg px-3 py-2 text-sm hover:bg-muted"}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Separator />
          <SheetFooter>
            <Button
              variant="outline"
              className="w-full"
              render={<Link href="/login" onClick={() => setOpen(false)} />}
              nativeButton={false}
            >
              Login
            </Button>
            <Button
              className="w-full"
              render={<Link href="#contact" onClick={() => setOpen(false)} />}
              nativeButton={false}
            >
              Hire me
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
