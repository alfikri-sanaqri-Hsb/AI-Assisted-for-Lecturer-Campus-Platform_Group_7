/**
 * Pemformat tampilan. Data disimpan dalam format mesin (ISO), lalu diubah
 * menjadi teks Indonesia hanya saat ditampilkan.
 */

const MONTHS_ID_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/**
 * "2026-11-20" -> "20 Nov 2026". Nama bulan ditulis tetap (bukan dari Intl)
 * agar hasilnya sama di semua browser dan server. Masukan yang bukan format
 * YYYY-MM-DD dikembalikan apa adanya.
 */
export function formatDateId(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthName = MONTHS_ID_SHORT[Number(month) - 1];
  return monthName ? `${day} ${monthName} ${year}` : iso;
}
