import * as z from "zod";

export const USER_LIMIT_OPTIONS = [10, 20, 50, 100] as const;
export const USER_DEFAULT_LIMIT = 10;
export const USER_ROLE = "user" as const;

export const userSearchFieldSchema = z.enum(["email", "name"]);
export type UserSearchField = z.infer<typeof userSearchFieldSchema>;

export const USER_SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name-asc", label: "Nama A–Z" },
  { value: "name-desc", label: "Nama Z–A" },
] as const;
export type UserSortKey = (typeof USER_SORT_OPTIONS)[number]["value"];
export const USER_DEFAULT_SORT: UserSortKey = "newest";
export const USER_SORT_MAP: Record<
  UserSortKey,
  { sortBy: string; sortDirection: "asc" | "desc" }
> = {
  newest: { sortBy: "createdAt", sortDirection: "desc" },
  oldest: { sortBy: "createdAt", sortDirection: "asc" },
  "name-asc": { sortBy: "name", sortDirection: "asc" },
  "name-desc": { sortBy: "name", sortDirection: "desc" },
};

export const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.email("Email tidak valid"),
  // Kosong = tidak ubah password (KISS: tanpa refine lintas-field).
  password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
});

export type UpdateUserForm = z.infer<typeof updateUserSchema>;

export const banUserSchema = z.object({
  banReason: z.string().min(1, "Alasan ban wajib diisi"),
});

export type BanUserForm = z.infer<typeof banUserSchema>;
