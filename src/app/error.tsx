"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <TriangleAlert className="size-10 text-destructive" />
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="max-w-sm text-muted-foreground">
          An unexpected error occurred. Try again, or head back home.
        </p>
      </div>

      <Button onClick={() => reset()}>
        <RotateCcw data-icon="inline-start" />
        Try again
      </Button>
    </main>
  );
}
