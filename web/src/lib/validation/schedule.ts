/**
 * Aturan bisnis jadwal. Dipakai di formulir (kemudahan bagi pengguna) DAN di
 * service (penegakan sebenarnya). Formulir tidak boleh jadi satu-satunya
 * penjaga, karena API nanti tidak melewati formulir.
 *
 * Aturan yang disepakati:
 * - Tanggal tidak boleh sebelum hari ini menurut WIB.
 * - Jam berada di rentang 06:00-22:00 WIB.
 * - Jam selesai harus setelah jam mulai.
 *
 * Format penyimpanan: tanggal "YYYY-MM-DD", jam "HH:MM" (24 jam).
 */

export const SCHEDULE_OPEN_TIME = "06:00";
export const SCHEDULE_CLOSE_TIME = "22:00";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Tanggal nyata di kalender (menolak mis. 2026-13-45 atau 2026-02-31). */
export function isValidIsoDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return (
    parsed.getUTCFullYear() === y &&
    parsed.getUTCMonth() === m - 1 &&
    parsed.getUTCDate() === d
  );
}

/** Jam 24 jam yang nyata (menolak mis. 27:00 atau 12:75). */
export function isValidTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

/** Tanggal hari ini menurut WIB (Asia/Jakarta), format YYYY-MM-DD. */
export function todayIsoWIB(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * `previousDate`: tanggal sebelum diubah (saat Ubah). Bila tanggal tidak
 * berubah, jadwal lama yang sudah lewat tetap boleh diedit (mis. status).
 */
export function validateScheduleDate(
  date: string,
  previousDate?: string
): string | null {
  if (!isValidIsoDate(date)) {
    return "Tanggal tidak valid. Pilih tanggal dari kalender.";
  }
  if (date !== previousDate && date < todayIsoWIB()) {
    return "Tanggal tidak boleh sebelum hari ini.";
  }
  return null;
}

export function validateScheduleTime(
  time: string,
  label: string
): string | null {
  if (!isValidTime(time)) {
    return `${label} tidak valid. Gunakan format 24 jam (contoh: 16:30).`;
  }
  if (time < SCHEDULE_OPEN_TIME || time > SCHEDULE_CLOSE_TIME) {
    return `${label} harus antara ${SCHEDULE_OPEN_TIME} dan ${SCHEDULE_CLOSE_TIME} WIB.`;
  }
  return null;
}

export function validateScheduleRange(
  startTime: string,
  endTime: string
): string | null {
  if (endTime <= startTime) {
    return "Jam selesai harus setelah jam mulai.";
  }
  return null;
}

type ScheduleSlot = { date: string; startTime: string; endTime: string };

/**
 * Validasi lengkap satu slot jadwal. Mengembalikan pesan galat pertama, atau
 * null bila valid. `previous` diisi saat Ubah; bila slot tidak berubah sama
 * sekali, tidak ada yang divalidasi (data lama tidak boleh memblokir edit
 * kolom lain).
 */
export function validateScheduleSlot(
  slot: ScheduleSlot,
  previous?: ScheduleSlot
): string | null {
  if (
    previous &&
    previous.date === slot.date &&
    previous.startTime === slot.startTime &&
    previous.endTime === slot.endTime
  ) {
    return null;
  }

  return (
    validateScheduleDate(slot.date, previous?.date) ??
    validateScheduleTime(slot.startTime, "Jam mulai") ??
    validateScheduleTime(slot.endTime, "Jam selesai") ??
    validateScheduleRange(slot.startTime, slot.endTime)
  );
}
