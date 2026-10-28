import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <Image
        src="/brand/logo-icon-clear.png"
        alt="MeGGi dev"
        width={48}
        height={48}
        className="size-12 dark:invert"
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="max-w-sm text-muted-foreground">
          The page you are looking for does not exist or has moved.
        </p>
      </div>

      <Button render={<Link href="/" />} nativeButton={false}>
        <ArrowLeft data-icon="inline-start" />
        Back home
      </Button>
    </main>
  );
}
