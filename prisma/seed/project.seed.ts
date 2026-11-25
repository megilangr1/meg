import { PrismaClient } from "@/generated/prisma/client";

type ProjectSeed = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  year: number;
  techStack: string;
  liveUrl: string | null;
  sortOrder: number;
  publishedAt: Date;
  description: string;
};

const projects: ProjectSeed[] = [
  {
    slug: "sivaka",
    title: "SIVAKA",
    summary:
      "Pengajuan dan verifikasi rencana kerja anggaran Pemerintah Kota Sukabumi.",
    role: "Fullstack Developer",
    year: 2025,
    techStack: "Next.js 16, React, shadcn/ui, Tailwind CSS 4",
    liveUrl: "https://sivaka.sukabumikota.go.id",
    sortOrder: 1,
    publishedAt: new Date("2025-08-01"),
    description: `## Konteks
SIVAKA adalah sistem pengajuan dan verifikasi rencana kerja anggaran untuk lingkungan Pemerintah Kota Sukabumi. Proyek dikerjakan sebagai bagian dari pekerjaan freelance bersama Chiro IT Solution.

## Peran
Fullstack developer pada sisi aplikasi: antarmuka, alur data, integrasi dengan API, dan penyesuaian struktur halaman.

## Pendekatan
Antarmuka dibangun dengan Next.js 16, React, shadcn/ui, dan Tailwind CSS 4. Fokus pekerjaan ada pada keterbacaan alur pengajuan, konsistensi komponen, dan struktur data yang mengikuti proses verifikasi.

## Stack
Next.js 16, React, shadcn/ui, Tailwind CSS 4.

## Catatan
Studi kasus ini menjelaskan konteks dan stack proyek. Detail metrik dan hasil kuantitatif tidak ditampilkan karena belum diverifikasi.`,
  },
  {
    slug: "siadik",
    title: "SIADIK",
    summary:
      "Sistem arsip digital untuk pengelolaan dokumen di Pemerintah Kota Sukabumi.",
    role: "Fullstack Developer",
    year: 2025,
    techStack: "Laravel 12, Livewire 3, DaisyUI, Tailwind CSS 4",
    liveUrl: "https://siadik.sukabumikota.go.id",
    sortOrder: 2,
    publishedAt: new Date("2025-07-01"),
    description: `## Konteks
SIADIK adalah sistem arsip digital untuk Pemerintah Kota Sukabumi. Aplikasi ini menjadi tempat pengelolaan arsip dan pencarian dokumen internal.

## Peran
Fullstack developer. Pekerjaan mencakup alur data arsip, antarmuka pengelolaan, dan integrasi dengan database.

## Pendekatan
Aplikasi dibangun dengan Laravel 12 dan Livewire 3, dengan DaisyUI dan Tailwind CSS 4 di sisi tampilan. Struktur halaman dibuat mengikuti kebiasaan pengguna administrasi: daftar, pencarian, dan detail dokumen.

## Stack
Laravel 12, Livewire 3, DaisyUI, Tailwind CSS 4.

## Catatan
Studi kasus ini menjelaskan konteks dan stack proyek. Detail metrik dan hasil kuantitatif tidak ditampilkan karena belum diverifikasi.`,
  },
  {
    slug: "dashboard-sppt",
    title: "Dashboard SPPT",
    summary:
      "Dashboard internal untuk pengelolaan data SPPT di lingkungan BPKPD.",
    role: "Fullstack Developer",
    year: 2025,
    techStack: "Laravel 12, Livewire 3, DaisyUI, Tailwind CSS 4",
    liveUrl: "https://uptdppd.bpkpd-smi.com",
    sortOrder: 3,
    publishedAt: new Date("2025-06-01"),
    description: `## Konteks
Dashboard SPPT merupakan aplikasi internal untuk pengelolaan data SPPT. Proyek dikerjakan bersama Chiro IT Solution.

## Peran
Fullstack developer pada alur data, tampilan dashboard, dan integrasi database.

## Pendekatan
Aplikasi menggunakan Laravel 12, Livewire 3, DaisyUI, dan Tailwind CSS 4. Fokusnya adalah tabel data yang mudah dibaca, filter yang jelas, dan alur kerja administrasi yang singkat.

## Stack
Laravel 12, Livewire 3, DaisyUI, Tailwind CSS 4.

## Catatan
Studi kasus ini menjelaskan konteks dan stack proyek. Detail metrik dan hasil kuantitatif tidak ditampilkan karena belum diverifikasi.`,
  },
  {
    slug: "nsa-autoparts",
    title: "NSA Autoparts",
    summary:
      "Website e-commerce perusahaan untuk katalog dan penjualan produk otomotif.",
    role: "Fullstack Web Developer",
    year: 2026,
    techStack: "E-commerce, Fullstack web",
    liveUrl: "https://nsaautoparts.com",
    sortOrder: 4,
    publishedAt: new Date("2026-03-01"),
    description: `## Konteks
NSA Autoparts adalah website e-commerce perusahaan untuk NSA Performance. Proyek ini menjadi kanal katalog dan penjualan produk secara online.

## Peran
Fullstack Web Developer di PT Nosa Jaya Karya. Pekerjaan mencakup pengembangan website dan pengelolaan alur data produk.

## Pendekatan
Website dibangun sebagai aplikasi e-commerce yang menghubungkan katalog produk, halaman detail, dan proses pembelian. Fokus pekerjaan ada pada struktur data produk dan alur pengguna yang jelas.

## Catatan
Studi kasus ini menjelaskan konteks dan peran. Detail metrik dan hasil kuantitatif tidak ditampilkan karena belum diverifikasi.`,
  },
  {
    slug: "website-desa-cicadas",
    title: "Website Desa Cicadas",
    summary:
      "Website profil desa dengan antarmuka React dan data dari Laravel REST API.",
    role: "Fullstack Developer",
    year: 2025,
    techStack: "React, Vite, shadcn/ui, Laravel REST API",
    liveUrl: "https://desacicadas.id",
    sortOrder: 5,
    publishedAt: new Date("2025-05-01"),
    description: `## Konteks
Website Desa Cicadas adalah situs profil desa yang menampilkan informasi publik dan konten desa.

## Peran
Fullstack developer pada antarmuka dan integrasi data dari REST API.

## Pendekatan
Antarmuka dibangun dengan ViteJS dan React, memakai shadcn/ui untuk komponen. Data diambil dari Laravel melalui REST API, sehingga tampilan dan sumber data dipisahkan dengan jelas.

## Stack
ViteJS, React, shadcn/ui, Laravel REST API.

## Catatan
Studi kasus ini menjelaskan konteks dan stack proyek. Detail metrik dan hasil kuantitatif tidak ditampilkan karena belum diverifikasi.`,
  },
  {
    slug: "nsa-archives",
    title: "NSA Archives",
    summary:
      "Website e-commerce multi-brand untuk katalog produk dan arsip perusahaan.",
    role: "Fullstack Web Developer",
    year: 2026,
    techStack: "E-commerce, Multi-brand",
    liveUrl: "https://www.nsaarchives.com",
    sortOrder: 6,
    publishedAt: new Date("2026-04-01"),
    description: `## Konteks
NSA Archives adalah website e-commerce multi-brand perusahaan. Situs ini melengkapi kanal utama dengan katalog dan arsip produk.

## Peran
Fullstack Web Developer di PT Nosa Jaya Karya.

## Pendekatan
Pengembangan berfokus pada struktur katalog multi-brand, konsistensi data produk, dan alur navigasi antar-kategori.

## Catatan
Studi kasus ini menjelaskan konteks dan peran. Detail metrik dan hasil kuantitatif tidak ditampilkan karena belum diverifikasi.`,
  },
];

export async function seedProject(prisma: PrismaClient) {
  let created = 0;

  for (const project of projects) {
    const exists = await prisma.project.findUnique({
      where: { slug: project.slug },
      select: { id: true },
    });
    if (exists) continue;

    await prisma.project.create({ data: project });
    created += 1;
  }

  console.log(`=== PROJECT DATA SEEDED (${created} baru) ===`);
}
