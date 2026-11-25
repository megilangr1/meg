import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function CtaSection() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-24">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
              05 — Contact
            </p>
            <h2 className="mt-5 max-w-2xl font-display font-medium text-4xl leading-[1.02] tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
              Punya sistem yang perlu dibangun atau dirapikan?
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Ceritakan konteks, kebutuhan, dan target waktunya. Saya akan
              melihat bagian mana yang paling masuk akal untuk dikerjakan lebih
              dulu.
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:items-end">
            <Link
              href={`mailto:${siteConfig.email}`}
              className="group inline-flex items-center gap-3 font-display font-medium text-2xl tracking-[-0.01em] transition-colors hover:text-brand sm:text-3xl"
            >
              <Mail className="size-5 text-muted-foreground transition-colors group-hover:text-brand" />
              <span className="border-b border-foreground pb-0.5 transition-colors group-hover:border-brand">
                {siteConfig.email}
              </span>
            </Link>
            <Link
              href={`mailto:${siteConfig.email}?subject=Permintaan%20CV`}
              className="group inline-flex items-center gap-2 border border-border px-4 py-3 text-sm transition-colors hover:border-foreground"
            >
              Minta CV lengkap
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>{siteConfig.location}</span>
          <span>Terbuka untuk diskusi teknis dan pekerjaan freelance</span>
        </div>
      </div>
    </section>
  );
}
