/**
 * Validasi alamat email.
 *
 * Yang bisa dibuktikan dari teks saja:
 * - sintaks yang benar,
 * - akhiran domain (TLD) termasuk daftar yang diizinkan,
 * - salah ketik pada penyedia populer (mis. gmial.com).
 *
 * Yang TIDAK bisa dibuktikan dari teks: apakah alamat itu benar-benar ada.
 * Itu hanya bisa dipastikan dengan email verifikasi (menunggu backend).
 */

/** Akhiran domain yang diizinkan. Tambahkan di sini bila ada yang sah ditolak. */
export const ALLOWED_EMAIL_SUFFIXES: ReadonlySet<string> = new Set([
  "com",
  "net",
  "org",
  "edu",
  "info",
  "id",
  "co.id",
  "ac.id",
  "sch.id",
  "go.id",
  "or.id",
  "web.id",
  "my.id",
  "net.id",
  "biz.id",
  "mil.id",
  "ponpes.id",
  "desa.id",
]);

/** Salah ketik yang umum pada penyedia populer -> bentuk yang benar. */
const DOMAIN_TYPOS: Readonly<Record<string, string>> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.id": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotmal.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "outlook.con": "outlook.com",
  "icloud.co": "icloud.com",
  "icloud.con": "icloud.com",
};

const LOCAL_PART = /^[a-z0-9]+(?:[._%+-][a-z0-9]+)*$/;
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/** Huruf kecil dan buang spasi di tepi. */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/** Menerima nilai yang SUDAH dinormalkan. Mengembalikan pesan galat atau null. */
export function validateEmail(value: string): string | null {
  if (value.length > 254) return "Email terlalu panjang.";

  const at = value.indexOf("@");
  if (at < 1 || at !== value.lastIndexOf("@")) {
    return "Format email tidak valid (harus berisi satu tanda @).";
  }

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);

  if (local.length > 64 || !LOCAL_PART.test(local)) {
    return "Bagian sebelum @ memuat karakter yang tidak valid.";
  }

  const labels = domain.split(".");
  if (labels.length < 2 || !labels.every((label) => DOMAIN_LABEL.test(label))) {
    return "Domain email tidak valid (contoh: nama@gmail.com).";
  }

  const typoFix = DOMAIN_TYPOS[domain];
  if (typoFix) {
    return `Maksud Anda ${local}@${typoFix}?`;
  }

  // "co.id" sendiri adalah akhiran, bukan domain yang punya kotak surat.
  if (ALLOWED_EMAIL_SUFFIXES.has(domain)) {
    return "Domain email tidak valid (contoh: nama@gmail.com).";
  }

  const suffix1 = labels[labels.length - 1];
  const suffix2 = labels.slice(-2).join(".");
  const hasKnownSuffix =
    (labels.length >= 3 && ALLOWED_EMAIL_SUFFIXES.has(suffix2)) ||
    ALLOWED_EMAIL_SUFFIXES.has(suffix1);

  if (!hasKnownSuffix) {
    return `Akhiran ".${suffix1}" tidak dikenali. Gunakan email aktif seperti nama@gmail.com.`;
  }

  return null;
}
