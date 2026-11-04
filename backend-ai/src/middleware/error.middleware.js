/**
 * ERROR HANDLER MIDDLEWARE
 * Harus punya 4 parameter (err, req, res, next)
 * Ini yang menangkap semua error dari route/controller
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Status code default
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Kirim response error dengan format konsisten
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
};

module.exports = errorHandler;