import * as z from "zod";

export const PROJECT_LIMIT_OPTIONS = [10, 25, 50] as const;
export const PROJECT_DEFAULT_LIMIT = 10;

export const PROJECT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Terbit" },
] as const;

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(160, "Maksimal 160 karakter."),
  slug: z
    .string()
    .trim()
    .max(160, "Maksimal 160 karakter.")
    .regex(/^[a-z0-9-]*$/, "Hanya huruf kecil, angka, dan tanda hubung."),
  summary: z
    .string()
    .trim()
    .min(1, "Ringkasan wajib diisi.")
    .max(320, "Maksimal 320 karakter."),
  description: z.string().trim().max(20000, "Maksimal 20.000 karakter."),
  role: z.string().trim().max(120, "Maksimal 120 karakter."),
  year: z
    .string()
    .trim()
    .regex(/^\d*$/, "Tahun harus angka.")
    .max(4, "Format 4 digit."),
  techStack: z.string().trim().max(500, "Maksimal 500 karakter."),
  status: z.enum(["draft", "published"]),
  sortOrder: z.string().trim().regex(/^\d*$/, "Urutan harus angka."),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

/** "SaaS Analytics 2026!" → "saas-analytics-2026" */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}
