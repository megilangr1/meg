import { Code, Palette, Rocket, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";

const services = [
  {
    Icon: Code,
    name: "Web apps",
    description: "Next.js apps with clean routing, data flow, auth.",
    href: "#contact",
    cta: "Discuss project",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-muted/40 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
    ),
  },
  {
    Icon: Palette,
    name: "Interfaces",
    description: "shadcn/ui systems, consistent tokens, dark mode.",
    href: "#contact",
    cta: "Discuss project",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-muted/40 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
    ),
  },
  {
    Icon: Rocket,
    name: "Motion & 3D",
    description: "Blur fades, marquees, WebGL touches that stay fast.",
    href: "#contact",
    cta: "Discuss project",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-muted/40 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
    ),
  },
  {
    Icon: Zap,
    name: "Performance",
    description: "Cache Components, partial prefetch, tight bundles.",
    href: "#contact",
    cta: "Discuss project",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-muted/40 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
    ),
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="flex flex-col gap-6">
      <BlurFade delay={0} inView>
        <div className="flex max-w-2xl flex-col gap-2">
          <Badge className="w-fit" variant="outline">
            Services
          </Badge>
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            What I do
          </h2>
          <p className="text-muted-foreground">
            Small scope, sharp execution. Four lanes, one standard: ship.
          </p>
        </div>
      </BlurFade>
      <BlurFade delay={0.1} inView>
        <BentoGrid>
          {services.map((s) => (
            <BentoCard key={s.name} {...s} />
          ))}
        </BentoGrid>
      </BlurFade>
    </section>
  );
}
