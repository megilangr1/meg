const capabilities = [
  {
    number: "01",
    title: "API & integrasi",
    description:
      "Merancang dan menghubungkan RESTful API: kontrak endpoint, autentikasi, validasi, dan alur data antar-layanan.",
    items: ["RESTful API", "Integrasi layanan", "Validasi & error contract"],
  },
  {
    number: "02",
    title: "Data & database",
    description:
      "Menyusun skema yang mengikuti cara kerja aplikasi, bukan sekadar tabel. Termasuk relasi, migrasi, dan query.",
    items: ["MySQL / MariaDB", "Desain skema", "Multi-database"],
  },
  {
    number: "03",
    title: "Aplikasi & antarmuka",
    description:
      "Membangun aplikasi end-to-end dengan Laravel/Livewire di backend dan React/Next.js di sisi antarmuka.",
    items: ["Laravel / Livewire", "React / Next.js", "Tailwind CSS"],
  },
  {
    number: "04",
    title: "Operasi & rilis",
    description:
      "Menjaga aplikasi tetap jalan setelah deploy: server Linux, version control, debugging, dan optimasi performa.",
    items: ["Linux Ubuntu & CLI", "Git", "Deployment & debugging"],
  },
];

const flow = [
  { label: "Antarmuka", value: "React · Next.js · Livewire" },
  { label: "API", value: "REST · Laravel" },
  { label: "Domain", value: "Logika bisnis · validasi" },
  { label: "Data", value: "MySQL · MariaDB" },
  { label: "Runtime", value: "Linux · deployment" },
];

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-24">
          <header>
            <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
              02 — Capabilities
            </p>
            <h2 className="mt-5 max-w-sm font-display font-medium text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl">
              Dari alur data sampai rilis.
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Satu orang untuk lapisan yang biasanya terpecah: struktur data,
              logika aplikasi, antarmuka, dan server.
            </p>
          </header>

          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {capabilities.map((item) => (
              <article
                key={item.number}
                className="border-t border-border pt-5"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {item.number}
                </span>
                <h3 className="mt-3 font-display font-medium text-2xl tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase">
                  {item.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 border-y border-border">
          <p className="sr-only">Alur data aplikasi</p>
          <ol className="grid divide-y divide-border sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            {flow.map((step, index) => (
              <li key={step.label} className="relative px-4 py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    {step.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-snug">{step.value}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
