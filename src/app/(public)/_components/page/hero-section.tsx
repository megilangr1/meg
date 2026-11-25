import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

const stack = [
  { label: "Bahasa", value: "PHP, TypeScript, JavaScript" },
  { label: "Backend", value: "Laravel, REST API" },
  { label: "Data", value: "MySQL, MariaDB" },
  { label: "Frontend", value: "React, Next.js, Livewire" },
  { label: "Runtime", value: "Linux, deployment" },
];

export function HeroSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.35fr_0.65fr] lg:gap-24 lg:py-24">
        <div className="editorial-enter">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Fullstack web developer — {siteConfig.location}
          </p>
          <h1 className="mt-7 max-w-3xl font-display font-medium text-[clamp(2.75rem,5vw,5rem)] leading-[0.98] tracking-[-0.035em] text-balance">
            Sistem web yang rapi, dari <span className="text-brand">database</span>{" "}
            sampai production.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Saya membangun aplikasi end-to-end dengan Laravel, MySQL, dan
            React/Next.js. Fokus pada alur data, arsitektur aplikasi, dan sistem
            yang tetap mudah dirawat setelah rilis.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#work"
              className="group inline-flex h-11 items-center justify-between gap-8 bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              Lihat studi kasus
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </Link>
            <Link
              href="#contact"
              className="group inline-flex h-11 items-center justify-between gap-8 border border-border px-5 text-sm font-medium transition-colors hover:border-foreground"
            >
              Diskusikan proyek
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>PHP / Laravel</span>
            <span>MySQL / MariaDB</span>
            <span>REST API</span>
            <span>Linux / Deployment</span>
          </div>
        </div>

        <aside className="editorial-enter editorial-enter-delay-2 lg:border-l lg:border-border lg:pl-10">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Profil singkat
          </p>
          <div className="mt-5 border-t border-foreground/30 pt-5">
            <p className="font-display font-medium text-3xl leading-none tracking-[-0.02em]">
              Fullstack
              <br />
              Web Developer
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              PT Nosa Jaya Karya · 2026—sekarang
            </p>
          </div>

          <dl className="mt-10 divide-y divide-border border-y border-border">
            {stack.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[4.5rem_1fr] gap-4 py-3"
              >
                <dt className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {item.label}
                </dt>
                <dd className="text-sm leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={`mailto:${siteConfig.email}`}
            className="group mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase"
          >
            <span className="border-b border-foreground pb-0.5 transition-colors group-hover:border-brand group-hover:text-brand">
              {siteConfig.email}
            </span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
