import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Globe } from "@/components/ui/globe";
import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { label: "Years shipping", value: 3, suffix: "+" },
  { label: "Projects delivered", value: 20, suffix: "+" },
  { label: "Avg Lighthouse", value: 98, suffix: "" },
  { label: "Reply time", value: 24, suffix: "h" },
];

export function HeroSection() {
  return (
    <section className="flex flex-col gap-16">
      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <DotPattern
          width={20}
          height={20}
          className="text-brand/40 [mask-image:radial-gradient(360px_at_20%_0%,white,transparent)]"
        />
        <BlurFade delay={0}>
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              Available for projects
            </Badge>
            <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
              MeGGi dev builds <span className="text-brand">fast</span> web
              apps.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Full-stack Next.js developer. Clean UI, solid architecture, no
              bloat. Portfolio, SaaS, company profiles.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="lg"
                render={<Link href="#work" />}
                nativeButton={false}
              >
                View work
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="#contact" />}
                nativeButton={false}
              >
                <Mail data-icon="inline-start" />
                Contact
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <AvatarGroup>
                <Avatar size="sm">
                  <AvatarImage
                    src="/brand/logo-icon-clear.png"
                    alt="MeGGi dev"
                    className="dark:invert"
                  />
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>NX</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>TS</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              <p className="text-sm text-muted-foreground">
                Next.js 16, React 19, shadcn/ui, Magic UI
              </p>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={0.1}>
          <div className="relative h-80 w-full overflow-hidden rounded-xl border bg-muted/30 lg:h-105">
            <Globe />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
              <Badge>
                <MapPin data-icon="inline-start" />
                Remote-first, worldwide
              </Badge>
            </div>
          </div>
        </BlurFade>
      </div>
      <BlurFade delay={0.15} inView>
        <dl className="grid grid-cols-2 gap-6 border-t md:grid-cols-4 md:gap-4 pt-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <dd className="font-heading text-3xl font-semibold tabular-nums">
                <NumberTicker value={s.value} />
                {s.suffix}
              </dd>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </BlurFade>
    </section>
  );
}
