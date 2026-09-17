import * as z from "zod";

export const authLoginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type AuthLoginForm = z.infer<typeof authLoginSchema>;
