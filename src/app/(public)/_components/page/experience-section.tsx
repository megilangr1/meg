const experience = [
  {
    period: "2026 — sekarang",
    role: "Fullstack Web Developer",
    company: "PT Nosa Jaya Karya (NSA Performance)",
    summary:
      "Membangun dan mengembangkan website e-commerce perusahaan serta situs multi-brand.",
    items: ["nsaautoparts.com", "nsaarchives.com"],
  },
  {
    period: "2025 — 2026",
    role: "Freelance Project",
    company: "Chiro IT Solution",
    summary:
      "Mengerjakan website pemerintahan dan sistem internal dengan beberapa stack berbeda.",
    items: [
      "Website Desa Cicadas — React + Laravel REST API",
      "SIADIK — Laravel 12 + Livewire 3",
      "SIVAKA — Next.js 16 + shadcn/ui",
      "Dashboard SPPT — Laravel 12 + Livewire 3",
    ],
  },
  {
    period: "2022 — 2024",
    role: "TKS — IT Support",
    company: "BPKPD Kota Sukabumi",
    summary:
      "Membangun aplikasi internal dan website profil dinas, dari antarmuka sampai alur data.",
    items: [
      "Pengelolaan Aset Daerah — Laravel 10 + Livewire 2",
      "Arsip Digital Surat Pertanggung Jawaban Belanja Daerah — Laravel 10",
      "Website profil dinas — Laravel 10 + Tailwind CSS 3",
    ],
  },
  {
    period: "2021 — 2022",
    role: "Backend Developer",
    company: "Equalindo Sinergi Perkasa",
    summary:
      "Maintenance produk, penambahan fitur, dan penerapan multi-database level pada aplikasi.",
    items: ["Laravel 8", "RESTful API", "Multi-database"],
  },
  {
    period: "2019 — 2020",
    role: "Programmer",
    company: "PT Salingka Global Indonesia",
    summary:
      "Membuat website berdasarkan kebutuhan klien dan merawat produk yang sudah berjalan.",
    items: ["Laravel 5.8 — 6.x", "Maintenance produk", "Fitur baru"],
  },
  {
    period: "2017 · 3 bulan",
    role: "IT Assistant — Magang",
    company: "Rumah Sakit Kartika Cibadak",
    summary: "Maintenance peralatan komputer dan dukungan operasional IT.",
    items: [],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.6fr] lg:gap-24 lg:py-28">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
            03 — Experience
          </p>
          <h2 className="mt-5 max-w-sm font-display font-medium text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl">
            Jalur yang membentuk cara kerja.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Dari IT support, backend, sampai fullstack. Semua tahap membuat saya
            terbiasa melihat aplikasi sebagai sistem, bukan halaman terpisah.
          </p>
        </header>

        <div className="border-t border-border">
          {experience.map((job, index) => (
            <article
              key={`${job.company}-${job.period}`}
              className="grid gap-5 border-b border-border py-7 sm:grid-cols-[7.5rem_1fr] sm:gap-8"
            >
              <div className="flex items-baseline justify-between gap-4 sm:flex-col sm:justify-start sm:gap-2">
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {job.period}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  {String(experience.length - index).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h3 className="font-display font-medium text-2xl leading-tight tracking-[-0.01em]">
                  {job.role}
                </h3>
                <p className="mt-1 text-sm font-medium">{job.company}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>
                {job.items.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {job.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 text-sm text-muted-foreground"
                      >
                        <span aria-hidden="true" className="text-brand">
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
