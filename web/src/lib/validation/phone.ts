/**
 * Validasi nomor telepon seluler Indonesia.
 *
 * Aturan:
 * - Diawali 08 (awalan +62 atau 62 otomatis diubah menjadi 0).
 * - Total 10-13 digit.
 * - Digit ketiga salah satu dari 1, 2, 3, 5, 7, 8, 9 (awalan operator seluler
 *   yang umum: 0811, 0821, 0831, 0852, 0877, 0881, 0895, dst). Bila ada nomor
 *   sah yang ditolak, longgarkan MOBILE_PREFIX di bawah.
 *
 * Nilai yang disimpan hanya berisi angka, mis. "081234567890".
 */

const MOBILE_PREFIX = /^08[1235789]\d+$/;

/** Membuang spasi, strip, titik, dan kurung; +62 / 62 menjadi 0. */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    digits = "0" + digits.slice(2);
  }
  return digits;
}

/** Menerima nilai yang SUDAH dinormalkan. Mengembalikan pesan galat atau null. */
export function validatePhone(value: string): string | null {
  if (!value.startsWith("08")) {
    return "Nomor harus diawali 08 (atau +62).";
  }
  if (value.length < 10 || value.length > 13) {
    return "Nomor harus 10\u201313 digit.";
  }
  if (!MOBILE_PREFIX.test(value)) {
    return "Awalan operator tidak dikenali (contoh: 0812, 0857, 0878).";
  }
  return null;
}
