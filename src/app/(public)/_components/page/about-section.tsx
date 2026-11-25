import { GraduationCap } from "lucide-react";

import { siteConfig } from "@/lib/site";

const skillGroups = [
  {
    label: "Backend",
    items: ["PHP", "Laravel", "RESTful API", "Livewire"],
  },
  {
    label: "Data",
    items: ["MySQL", "MariaDB", "Desain skema", "Multi-database"],
  },
  {
    label: "Frontend",
    items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    label: "Operasional",
    items: ["Git", "Linux Ubuntu", "CLI", "Performance", "Debugging"],
  },
];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
          04 — About
        </p>

        <div className="mt-10 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <div>
            <blockquote className="max-w-3xl font-display font-medium text-3xl leading-[1.12] tracking-[-0.02em] text-balance sm:text-4xl lg:text-5xl">
              “Fullstack Web Developer dengan fokus pada pengembangan website
              secara fullstack dengan memperhatikan alur data dan struktur
              sistem aplikasi.”
            </blockquote>
            <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Ringkasan profil — CV
            </p>

            <div className="mt-12 flex max-w-2xl flex-col gap-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Saya terbiasa membangun aplikasi web end-to-end, mulai dari
                implementasi antarmuka hingga pengelolaan logika bisnis dan
                database. Integrasi API, arsitektur aplikasi, performa, dan
                maintainability menjadi bagian dari proses yang sama.
              </p>
              <p>
                Banyak pekerjaan saya berada di lingkungan pemerintahan dan
                sistem internal: aplikasi yang harus jelas alur datanya, bisa
                dirawat oleh orang lain, dan tetap berjalan setelah rilis.
              </p>
            </div>

            <div className="mt-10 flex items-start gap-3 border-t border-border pt-6">
              <GraduationCap className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  SMK PASIM PLUS Kota Sukabumi
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Rekayasa Perangkat Lunak (RPL)
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="border-t border-border">
              {skillGroups.map((group) => (
                <div
                  key={group.label}
                  className="grid gap-3 border-b border-border py-5 sm:grid-cols-[7rem_1fr]"
                >
                  <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    {group.label}
                  </p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-card p-5 ring-1 ring-border">
              <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                Basis
              </p>
              <p className="mt-2 text-sm">{siteConfig.location}</p>
              <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                Fokus saat ini
              </p>
              <p className="mt-2 text-sm">
                Backend, alur data, dan aplikasi fullstack yang maintainable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
