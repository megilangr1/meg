import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import { AboutSection } from "./_components/page/about-section";
import { HeroSection } from "./_components/page/hero-section";
import { ServicesSection } from "./_components/page/services-section";
import { StackMarquee } from "./_components/page/stack-marquee";
import { WorkSection } from "./_components/page/work-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  jobTitle: "Full-stack web developer",
  knowsAbout: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
};

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HeroSection />
      <StackMarquee />
      <ServicesSection />
      <WorkSection />
      <AboutSection />
    </main>
  );
}
