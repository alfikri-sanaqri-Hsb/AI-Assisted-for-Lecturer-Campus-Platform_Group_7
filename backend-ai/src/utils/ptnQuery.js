/**
 * VALIDASI QUERY DAFTAR PROGRAM STUDI
 * Semua nilai di req.query itu TEKS, jadi diubah ke tipe yang benar lalu divalidasi.
 * Nilai yang salah ditolak dengan 400 (bukan dibiarkan jadi error SQL).
 *
 * Aturan (mengikuti materi paginasi dan pencarian):
 *  - halaman     : angka >= 1, default 1
 *  - per_halaman : 1-100, default 10 (tanpa batas atas = bisa kirim seluruh tabel)
 *  - cari        : teks, maks 100 karakter
 *  - urut        : harus ada di daftar tetap (placeholder ? tidak bisa dipakai untuk nama kolom)
 *  - arah        : asc / desc
 */

const SORT_COLUMNS = {
  skor: 'score_avg',
  skor_terendah: 'score_min',
  skor_tertinggi: 'score_max',
  peminat: 'applicants',
  universitas: 'university',
  prodi: 'program_name',
  terbaru: 'id',
};
const DEGREES = ['S1', 'D3', 'D4'];

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function toInt(value, name, { min, max, fallback }) {
  if (value === undefined || value === '') return fallback;
  if (!/^\d+$/.test(String(value))) throw badRequest(`${name} harus berupa angka bulat`);
  const n = Number(value);
  if (n < min || n > max) throw badRequest(`${name} harus antara ${min} dan ${max}`);
  return n;
}

function toNumber(value, name) {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw badRequest(`${name} harus berupa angka`);
  return n;
}

/** Escape karakter spesial LIKE (% dan _) supaya dianggap teks biasa. Karakter escape = | */
function escapeLike(text) {
  return text.replace(/[|%_]/g, (c) => `|${c}`);
}

function parseProgramQuery(query = {}) {
  const halaman = toInt(query.halaman, 'halaman', { min: 1, max: 1000000, fallback: 1 });
  const perHalaman = toInt(query.per_halaman, 'per_halaman', { min: 1, max: 100, fallback: 10 });

  let cari = '';
  if (query.cari !== undefined) {
    cari = String(query.cari).trim();
    if (cari.length > 100) throw badRequest('cari maksimal 100 karakter');
  }

  const urut = query.urut === undefined || query.urut === '' ? 'skor' : String(query.urut);
  if (!Object.prototype.hasOwnProperty.call(SORT_COLUMNS, urut)) {
    throw badRequest(`urut harus salah satu dari: ${Object.keys(SORT_COLUMNS).join(', ')}`);
  }

  const arah = query.arah === undefined || query.arah === '' ? 'desc' : String(query.arah).toLowerCase();
  if (arah !== 'asc' && arah !== 'desc') throw badRequest('arah harus asc atau desc');

  let jenjang;
  if (query.jenjang !== undefined && query.jenjang !== '') {
    jenjang = String(query.jenjang).toUpperCase();
    if (!DEGREES.includes(jenjang)) throw badRequest(`jenjang harus salah satu dari: ${DEGREES.join(', ')}`);
  }

  const skorMin = toNumber(query.skor_min, 'skor_min');
  const skorMaks = toNumber(query.skor_maks, 'skor_maks');
  if (skorMin !== undefined && skorMaks !== undefined && skorMaks < skorMin) {
    throw badRequest('skor_maks harus lebih besar atau sama dengan skor_min');
  }

  const universitas = query.universitas ? String(query.universitas).trim().slice(0, 100) : '';

  return {
    halaman, perHalaman, cari, universitas, jenjang, skorMin, skorMaks,
    orderColumn: SORT_COLUMNS[urut], // sudah lewat daftar tetap, aman ditempel ke ORDER BY
    arah,
  };
}

module.exports = { parseProgramQuery, escapeLike, SORT_COLUMNS };
