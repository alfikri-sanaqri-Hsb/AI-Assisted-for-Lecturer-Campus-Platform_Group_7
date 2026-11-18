/**
 * VALIDATOR INPUT (body request admin/mentor)
 * Semua kesalahan jadi error 400 dengan pesan jelas, bukan error SQL 500.
 */

function bad(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function str(value, name, { max = 255, required = false } = {}) {
  if (value === undefined || value === null || String(value).trim() === '') {
    if (required) throw bad(`${name} wajib diisi`);
    return null;
  }
  const s = String(value).trim();
  if (s.length > max) throw bad(`${name} maksimal ${max} karakter`);
  return s;
}

// Hanya http:// atau https:// (menolak javascript:, file:, dst)
function url(value, name, { required = false } = {}) {
  const s = str(value, name, { max: 500, required });
  if (s === null) return null;
  let u;
  try { u = new URL(s); } catch { throw bad(`${name} harus berupa URL yang valid`); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw bad(`${name} harus diawali http:// atau https://`);
  return s;
}

function int(value, name, { min = 0, max = 1000000, required = false, fallback = 0 } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw bad(`${name} wajib diisi`);
    return fallback;
  }
  if (typeof value === 'string' && !/^-?\d+$/.test(value.trim())) throw bad(`${name} harus berupa bilangan bulat`);
  const n = Number(value);
  if (!Number.isInteger(n)) throw bad(`${name} harus berupa bilangan bulat`);
  if (n < min || n > max) throw bad(`${name} harus antara ${min} dan ${max}`);
  return n;
}

// ID dari URL param (/:id)
function id(value, name = 'ID') {
  if (!/^\d+$/.test(String(value)) || Number(value) <= 0) throw bad(`${name} tidak valid`);
  return Number(value);
}

function bool(value, name, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  if ([true, 1, '1', 'true'].includes(value)) return 1;
  if ([false, 0, '0', 'false'].includes(value)) return 0;
  throw bad(`${name} harus true atau false`);
}

function oneOf(value, name, allowed, { required = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw bad(`${name} wajib diisi`);
    return undefined;
  }
  if (!allowed.includes(value)) throw bad(`${name} harus salah satu dari: ${allowed.join(', ')}`);
  return value;
}

// "2026-11-20 19:00" atau "2026-11-20T19:00:00" -> "2026-11-20 19:00:00"
function dateTime(value, name) {
  const s = str(value, name, { max: 30, required: true });
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(s);
  if (!m) throw bad(`${name} harus berformat YYYY-MM-DD HH:mm`);
  const [, y, mo, d, h, mi, se = '00'] = m;
  const date = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +se));
  if (date.getUTCMonth() !== +mo - 1 || date.getUTCDate() !== +d || +h > 23 || +mi > 59 || +se > 59) {
    throw bad(`${name} bukan tanggal/jam yang valid`);
  }
  return `${y}-${mo}-${d} ${h}:${mi}:${se}`;
}

// Error database yang umum -> pesan ramah
function mapDbError(err) {
  if (err && err.code === 'ER_DUP_ENTRY') return bad('Data sudah dipakai (duplikat)', 409);
  if (err && (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW')) {
    return bad('Data yang dirujuk tidak ditemukan', 400);
  }
  return err;
}

module.exports = { bad, str, url, int, id, bool, oneOf, dateTime, mapDbError };
