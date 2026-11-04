const settingsModel = require('../models/settings.model');

// Teks statis untuk layar Tentang Kami dan Bantuan. Ganti dengan teks resmi dari tim.
const ABOUT = {
  about: {
    title: 'Tentang Kami',
    body: 'Sahabat AlFaRy adalah aplikasi belajar persiapan UTBK dan SNBT.',
  },
  help: {
    title: 'Bantuan dan Saran',
    body: 'Silakan hubungi tim Sahabat AlFaRy untuk bantuan atau saran.',
  },
};

// GET /api/settings
async function getSettings(req, res, next) {
  try {
    const userId = req.user.id;
    const [account, notifications] = await Promise.all([
      settingsModel.getAccountSettings(userId),
      settingsModel.getNotificationSettings(userId),
    ]);

    return res.json({
      success: true,
      message: 'Pengaturan',
      data: {
        profile: {
          full_name: account ? account.full_name : null,
          university: account ? account.university : null,
          profile_picture: account ? account.profile_picture : null,
        },
        is_premium: account ? Boolean(account.is_premium) : false,
        notifications,
      },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/settings/notifications
// Body contoh: { "reminder": true }
async function updateNotifications(req, res, next) {
  try {
    const body = req.body || {};
    const current = await settingsModel.getNotificationSettings(req.user.id);
    const updated = { ...current };
    let changed = false;

    for (const key of settingsModel.NOTIFICATION_KEYS) {
      if (body[key] === undefined) continue;
      if (typeof body[key] !== 'boolean') {
        return res.status(400).json({ success: false, message: `${key} harus true atau false` });
      }
      updated[key] = body[key];
      changed = true;
    }

    if (!changed) {
      return res.status(400).json({ success: false, message: 'Tidak ada pengaturan yang dikirim' });
    }

    await settingsModel.saveNotificationSettings(req.user.id, updated);

    return res.json({
      success: true,
      message: 'Pengaturan notifikasi disimpan',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/settings/about
function getAbout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Data tentang kami berhasil diambil',
    data: {
      about_text: 'Sahabat AlFaRy adalah platform belajar untuk persiapan UTBK. Isi teks ini sesuai desain.',
      social_links: [
        { name: 'facebook', url: 'https://facebook.com/ISI_AKUN' },
        { name: 'x', url: 'https://x.com/ISI_AKUN' },
        { name: 'instagram', url: 'https://instagram.com/ISI_AKUN' },
        { name: 'youtube', url: 'https://youtube.com/@ISI_AKUN' },
      ],
    },
  });
}

module.exports = { getSettings, updateNotifications, getAbout };