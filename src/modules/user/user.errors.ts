// Kode error dari `better-auth@1.7.5`:
// `dist/api/routes/*.mjs` + `dist/plugins/admin/error-codes.mjs`.
const USER_ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: "Email sudah dipakai pengguna lain",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Email sudah dipakai, gunakan email lain",
  INVALID_EMAIL: "Email tidak valid",
  USER_NOT_FOUND: "Pengguna tidak ditemukan",
  PASSWORD_TOO_SHORT: "Password terlalu pendek",
  PASSWORD_TOO_LONG: "Password terlalu panjang",
  NO_DATA_TO_UPDATE: "Tidak ada data yang diubah",
  PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER:
    "Password tidak bisa diubah lewat form ini",
  YOU_CANNOT_BAN_YOURSELF: "Tidak bisa ban akun sendiri",
  YOU_CANNOT_REMOVE_YOURSELF: "Tidak bisa hapus akun sendiri",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "Tidak punya izin membuat pengguna",
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "Tidak punya izin melihat pengguna",
  YOU_ARE_NOT_ALLOWED_TO_GET_USER: "Tidak punya izin melihat detail pengguna",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: "Tidak punya izin mengubah pengguna",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "Tidak punya izin menghapus pengguna",
  YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "Tidak punya izin memblokir pengguna",
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "Tidak punya izin mengatur password",
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: "Tidak punya izin mengubah email",
  YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "Tidak punya izin mengubah role",
  BANNED_USER: "Akun diblokir",
};

const FALLBACK = "Gagal memproses pengguna, coba lagi";

export function getUserErrorMessage(code?: string | null): string {
  if (code && USER_ERROR_MESSAGES[code]) return USER_ERROR_MESSAGES[code];
  return FALLBACK;
}

export const USER_NETWORK_ERROR_MESSAGE =
  "Tidak dapat terhubung ke server, coba lagi";
