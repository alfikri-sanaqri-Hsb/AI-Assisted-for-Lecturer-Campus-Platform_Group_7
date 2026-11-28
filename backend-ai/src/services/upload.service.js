/** Mengunggah file ke Cloudinary (penyimpanan file online). Rahasia diambil dari .env, tidak pernah di kode. */
let cloudinary = null;

function isConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function client() {
  if (!cloudinary) {
    // eslint-disable-next-line global-require
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return cloudinary;
}

// resource: 'image' (foto) atau 'raw' (pdf/word)
function uploadBuffer(buffer, { folder, resource }) {
  return new Promise((resolve, reject) => {
    const stream = client().uploader.upload_stream(
      { folder: `sahabat-alfary/${folder}`, resource_type: resource, use_filename: false, unique_filename: true, overwrite: false },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

module.exports = { isConfigured, uploadBuffer };
