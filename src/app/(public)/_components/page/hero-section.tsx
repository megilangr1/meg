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
import { Globe } from "@/components/ui/globe";

export function HeroSection() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      <BlurFade delay={0}>
        <div className="flex flex-col gap-6">
          <Badge variant="secondary" className="w-fit">
            <span className="size-1.5 rounded-full bg-primary" />
            Available for projects
          </Badge>
          <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
            MeGGi dev builds fast web apps.
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
                <AvatarImage src="/brand/logo-icon.png" alt="MeGGi dev" />
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
    </section>
  );
}
