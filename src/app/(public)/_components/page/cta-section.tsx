import Link from "next/link";
import { Mail } from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { siteConfig } from "@/lib/site";

export function CtaSection() {
  return (
    <section id="contact" className="scroll-mt-24">
      <BlurFade delay={0} inView>
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl bg-brand px-6 py-16 text-center text-brand-foreground md:py-20">
          <DotPattern
            width={20}
            height={20}
            className="text-brand-foreground/20 [mask-image:radial-gradient(320px_at_50%_50%,white,transparent)]"
          />
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Have a project in mind?
          </h2>
          <p className="max-w-md text-pretty text-sm opacity-80 md:text-base">
            Tell me the shape of it. You get a scope, a timeline, and a
            straight answer within 24 hours.
          </p>
          <div className="relative flex flex-wrap justify-center gap-2">
            <Button
              size="lg"
              render={<Link href={`mailto:${siteConfig.email}`} />}
              nativeButton={false}
            >
              <Mail data-icon="inline-start" />
              {siteConfig.email}
            </Button>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
