import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import { AboutSection } from "./_components/page/about-section";
import { CapabilitiesSection } from "./_components/page/capabilities-section";
import { CtaSection } from "./_components/page/cta-section";
import { ExperienceSection } from "./_components/page/experience-section";
import { HeroSection } from "./_components/page/hero-section";
import { WorkSection } from "./_components/page/work-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: siteConfig.description,
};

// WorkSection membaca DB, jadi halaman ini ISR (bukan statis murni).
export const revalidate = 60;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  jobTitle: siteConfig.role,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sukabumi",
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  knowsAbout: [
    "PHP",
    "Laravel",
    "RESTful API",
    "MySQL",
    "MariaDB",
    "React",
    "Next.js",
    "Linux",
    "Application architecture",
  ],
};

export default function Page() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HeroSection />
      <WorkSection />
      <CapabilitiesSection />
      <ExperienceSection />
      <AboutSection />
      <CtaSection />
    </main>
  );
}
