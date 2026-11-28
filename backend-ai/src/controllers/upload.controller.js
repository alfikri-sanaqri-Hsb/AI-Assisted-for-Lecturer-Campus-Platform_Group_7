const upload = require('../services/upload.service');
const userModel = require('../models/user.model');
const { detect, IMAGE_ONLY } = require('../utils/fileSignature');

// purpose -> siapa yang boleh, dan tipe file yang diizinkan
const PURPOSES = {
  profile: { roles: ['student', 'mentor', 'admin'], imageOnly: true },
  material: { roles: ['mentor', 'admin'], imageOnly: false },
  question: { roles: ['mentor', 'admin'], imageOnly: false },
  tryout: { roles: ['mentor', 'admin'], imageOnly: false },
};

// POST /api/uploads?purpose=profile|material|question|tryout  (multipart, field "file")
async function uploadFile(req, res, next) {
  try {
    const purpose = String(req.query.purpose || '');
    const rule = PURPOSES[purpose];
    if (!rule) {
      return res.status(400).json({ success: false, message: 'purpose harus profile, material, question, atau tryout' });
    }
    if (!rule.roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Anda tidak punya akses untuk mengunggah file ini' });
    }
    if (!upload.isConfigured()) {
      return res.status(503).json({ success: false, message: 'Layanan penyimpanan file belum dikonfigurasi di server' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File wajib dikirim pada field "file"' });
    }

    const found = detect(req.file.buffer, req.file.originalname);
    if (!found) {
      return res.status(415).json({ success: false, message: 'Tipe file tidak diizinkan. Gunakan JPG, PNG, WEBP, PDF, DOC, DOCX, atau PPTX' });
    }
    if (rule.imageOnly && !IMAGE_ONLY.includes(found.kind)) {
      return res.status(415).json({ success: false, message: 'Untuk tujuan ini hanya foto (JPG, PNG, WEBP) yang diizinkan' });
    }

    const result = await upload.uploadBuffer(req.file.buffer, { folder: purpose, resource: found.resource });

    // Foto profil langsung disimpan ke profil pengguna, jadi klien cukup satu kali panggil
    if (purpose === 'profile') {
      await userModel.updateUserProfile(req.user.id, { profile_picture: result.secure_url });
    }

    return res.status(201).json({
      success: true,
      message: 'File berhasil diunggah',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: found.resource,
        format: found.kind,
        bytes: result.bytes,
        purpose,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { uploadFile, PURPOSES };
