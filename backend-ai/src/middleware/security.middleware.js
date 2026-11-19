/**
 * HEADER KEAMANAN (tanpa library)
 * - nosniff: browser tidak menebak tipe konten
 * - X-Frame-Options: API tidak boleh dimuat dalam iframe
 * - no-store: jawaban API (token, data akun) tidak disimpan cache browser/proxy
 * - HSTS hanya di production (butuh HTTPS)
 */
function securityHeaders(req, res, next) {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('Cache-Control', 'no-store');
  if (process.env.NODE_ENV === 'production') {
    res.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }
  next();
}

module.exports = securityHeaders;
