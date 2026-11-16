/**
 * VALIDASI QUERY DAFTAR (dipakai endpoint admin: siswa, mentor, dst)
 * Aturan sama dengan ptnQuery.js (materi paginasi dosen):
 *  - halaman     : angka >= 1, default 1
 *  - per_halaman : 1-100, default 10
 *  - cari        : teks, maks 100 karakter
 *  - urut        : harus ada di daftar tetap (nama kolom tidak bisa pakai placeholder ?)
 *  - arah        : asc / desc
 * Nilai yang salah ditolak 400, bukan dibiarkan jadi error SQL.
 */

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

/** Escape karakter spesial LIKE (% dan _). Karakter escape = | */
function escapeLike(text) {
  return text.replace(/[|%_]/g, (c) => `|${c}`);
}

/**
 * sortMap: { nama_urut_di_url: 'kolom_sql' }, contoh { nama: 'name', terbaru: 'u.id' }
 * defaults: { urut: 'terbaru', arah: 'desc' }
 */
function parseListQuery(query = {}, sortMap, defaults = { urut: 'terbaru', arah: 'desc' }) {
  const halaman = toInt(query.halaman, 'halaman', { min: 1, max: 1000000, fallback: 1 });
  const perHalaman = toInt(query.per_halaman, 'per_halaman', { min: 1, max: 100, fallback: 10 });

  let cari = '';
  if (query.cari !== undefined) {
    cari = String(query.cari).trim();
    if (cari.length > 100) throw badRequest('cari maksimal 100 karakter');
  }

  const urut = query.urut === undefined || query.urut === '' ? defaults.urut : String(query.urut);
  if (!Object.prototype.hasOwnProperty.call(sortMap, urut)) {
    throw badRequest(`urut harus salah satu dari: ${Object.keys(sortMap).join(', ')}`);
  }

  const arah = query.arah === undefined || query.arah === '' ? defaults.arah : String(query.arah).toLowerCase();
  if (arah !== 'asc' && arah !== 'desc') throw badRequest('arah harus asc atau desc');

  return { halaman, perHalaman, cari, orderColumn: sortMap[urut], arah };
}

/** Bagian WHERE untuk pencarian: tiap kata harus cocok di salah satu kolom */
function searchClause(cari, columns) {
  const where = [];
  const params = [];
  for (const word of cari.split(/\s+/).filter(Boolean)) {
    where.push(`(${columns.map((c) => `${c} LIKE ? ESCAPE '|'`).join(' OR ')})`);
    for (let i = 0; i < columns.length; i++) params.push(`%${escapeLike(word)}%`);
  }
  return { where, params };
}

function buildMeta(f, total) {
  return { halaman: f.halaman, per_halaman: f.perHalaman, total, total_halaman: Math.ceil(total / f.perHalaman) };
}

module.exports = { parseListQuery, searchClause, escapeLike, buildMeta };
