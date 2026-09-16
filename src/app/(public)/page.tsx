import { AboutSection } from "./_components/page/about-section";
import { HeroSection } from "./_components/page/hero-section";
import { ServicesSection } from "./_components/page/services-section";
import { StackMarquee } from "./_components/page/stack-marquee";
import { WorkSection } from "./_components/page/work-section";

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 pt-16 pb-24">
      <HeroSection />
      <StackMarquee />
      <ServicesSection />
      <WorkSection />
      <AboutSection />
    </main>
  );
}
