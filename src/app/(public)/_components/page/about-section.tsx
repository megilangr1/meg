import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const facts = [
  { label: "Base", value: "Jakarta, GMT+7" },
  { label: "Focus", value: "Next.js full-stack" },
  { label: "Availability", value: "Open for Q1 2027" },
];

export function AboutSection() {
  return (
    <section id="about" className="flex scroll-mt-24 flex-col gap-6">
      <BlurFade delay={0} inView>
        <Card>
          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarImage
                    src="/brand/logo-icon-clear.png"
                    alt="MeGGi dev"
                    className="dark:invert"
                  />
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-heading font-semibold">MeGGi dev</p>
                  <p className="text-sm text-muted-foreground">
                    Full-stack web developer
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                I build with stock Next.js, shadcn/ui, Magic UI. Minimal deps,
                semantic tokens, accessible components. Lazy by principle:
                delete first, then write least code that holds.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <dl className="flex flex-col gap-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <Separator />
              <Button
                variant="outline"
                className="w-fit"
                render={<Link href="/dashboard" />}
                nativeButton={false}
              >
                Client area
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </Card>
      </BlurFade>
    </section>
  );
}
