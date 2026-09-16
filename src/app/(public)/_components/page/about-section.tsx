import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="about" className="flex flex-col gap-6">
      <BlurFade delay={0} inView>
        <Card>
          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarImage src="/brand/logo-icon.png" alt="MeGGi dev" />
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
            <div id="contact" className="flex flex-col justify-center gap-3">
              <Button
                size="lg"
                render={<Link href="mailto:hello@meggi.dev" />}
                nativeButton={false}
              >
                <Mail data-icon="inline-start" />
                hello@meggi.dev
              </Button>
              <Button
                size="lg"
                variant="outline"
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
