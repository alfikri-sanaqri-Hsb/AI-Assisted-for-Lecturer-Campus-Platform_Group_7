const multer = require('multer');

// Batas 10 MB = batas file gratis di Cloudinary. Disimpan di memori sementara (tidak ditulis ke disk server).
const MAX_BYTES = 10 * 1024 * 1024;
const parser = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES, files: 1 } }).single('file');

function uploadSingle(req, res, next) {
  parser(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: 'Ukuran file maksimal 10 MB' });
    }
    return res.status(400).json({ success: false, message: 'File tidak dapat dibaca. Kirim satu file pada field "file"' });
  });
}

module.exports = { uploadSingle, MAX_BYTES };
