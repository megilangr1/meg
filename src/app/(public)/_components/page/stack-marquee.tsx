import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Magic UI",
  "Motion",
  "Node.js",
];

export function StackMarquee() {
  return (
    <BlurFade delay={0} inView>
      <section aria-label="Tech stack">
        <Marquee pauseOnHover className="[--duration:30s]">
          {stack.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </Marquee>
      </section>
    </BlurFade>
  );
}
