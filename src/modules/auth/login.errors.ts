// Kode error dari `authClient.signIn.email` (lihat `better-auth`:
// `dist/api/routes/sign-in.mjs`, `dist/plugins/admin/error-codes.mjs`).
const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email atau password salah",
  CREDENTIAL_ACCOUNT_NOT_FOUND:
    "Akun ini belum punya password, gunakan metode login lain",
  EMAIL_NOT_VERIFIED: "Email belum diverifikasi, cek inbox kamu",
  BANNED_USER: "Akun kamu diblokir, hubungi administrator",
  EMAIL_PASSWORD_DISABLED: "Login email/password sedang nonaktif",
};

export function getLoginErrorMessage(code?: string | null): string {
  if (code && LOGIN_ERROR_MESSAGES[code]) return LOGIN_ERROR_MESSAGES[code];
  return LOGIN_ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD;
}

export const LOGIN_NETWORK_ERROR_MESSAGE =
  "Tidak dapat terhubung ke server, coba lagi";
