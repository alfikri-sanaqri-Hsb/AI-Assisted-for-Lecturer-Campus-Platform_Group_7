/**
 * RATE LIMIT SEDERHANA (tanpa library, disimpan di memori server)
 * Membatasi jumlah request per kunci (mis. IP + email) dalam satu jendela waktu.
 * Catatan: hitungan hilang saat server restart, dan tidak dibagi antar server.
 * Cukup untuk satu server; untuk banyak server pakai penyimpanan bersama (Redis).
 */

function createRateLimiter({ windowMs, max, keyFn, message }) {
  const hits = new Map();

  // Bersihkan entri kedaluwarsa agar memori tidak membengkak
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, Math.min(windowMs, 60 * 1000));
  if (timer.unref) timer.unref();

  return function rateLimit(req, res, next) {
    const now = Date.now();
    const key = keyFn(req);

    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    if (entry.count > max) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        success: false,
        message: message || 'Terlalu banyak percobaan, coba lagi nanti',
      });
    }
    return next();
  };
}

const num = (value, fallback) => (Number(value) > 0 ? Number(value) : fallback);

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: num(process.env.RATE_LIMIT_LOGIN_MAX, 10),
  keyFn: (req) => `${req.ip}|${String((req.body && req.body.email) || '').trim().toLowerCase()}`,
  message: 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.',
});

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: num(process.env.RATE_LIMIT_REGISTER_MAX, 10),
  keyFn: (req) => req.ip,
  message: 'Terlalu banyak pendaftaran dari alamat ini. Coba lagi nanti.',
});

module.exports = { createRateLimiter, loginLimiter, registerLimiter };
