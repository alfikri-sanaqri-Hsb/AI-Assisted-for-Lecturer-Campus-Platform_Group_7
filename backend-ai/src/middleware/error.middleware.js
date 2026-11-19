/**
 * ERROR HANDLER MIDDLEWARE
 * Harus punya 4 parameter (err, req, res, next)
 * Ini yang menangkap semua error dari route/controller
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Status code default
  const statusCode = err.statusCode || 500;
  // Di production, detail error server (mis. pesan SQL) tidak boleh bocor ke klien
  const hideDetail = statusCode >= 500 && process.env.NODE_ENV === 'production';
  const message = hideDetail ? 'Terjadi kesalahan pada server' : (err.message || 'Internal Server Error');

  // Kirim response error dengan format konsisten
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
};

module.exports = errorHandler;