/**
 * USER CONTROLLER
 * Dashboard, edit profil, dan ubah password untuk user (siswa)
 */

const userModel = require('../models/user.model');
const { comparePassword, hashPassword } = require('../utils/password');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MIN_PASSWORD_LENGTH = 6;

// String kosong dari form dianggap "dikosongkan" (null), bukan teks kosong
const emptyToNull = (value) => (value === '' ? null : value);

const validateProfileInput = ({ fullName, dateOfBirth }) => {
  if (fullName !== undefined && String(fullName).trim() === '') {
    return 'Nama lengkap tidak boleh kosong';
  }

  const hasDateOfBirth = dateOfBirth !== undefined && dateOfBirth !== null && dateOfBirth !== '';
  if (hasDateOfBirth) {
    const isValidFormat = DATE_PATTERN.test(String(dateOfBirth));
    if (!isValidFormat || Number.isNaN(Date.parse(dateOfBirth))) {
      return 'Format tanggal lahir harus YYYY-MM-DD';
    }
  }

  return null;
};

// GET /api/users/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await userModel.getDashboardData(req.user.id);

    if (!dashboard) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      message: 'Dashboard data berhasil diambil',
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const {
      full_name: fullName,
      nickname,
      phone_number: phoneNumber,
      date_of_birth: dateOfBirth,
      major,
      university,
      profile_picture: profilePicture,
    } = req.body;

    if (fullName !== undefined && String(fullName).trim() === '') {
      return res.status(400).json({ success: false, message: 'Nama lengkap tidak boleh kosong' });
    }
    if (nickname !== undefined && nickname !== null && String(nickname).length > 50) {
      return res.status(400).json({ success: false, message: 'Nama panggilan maksimal 50 karakter' });
    }

    const emptyToNull = (value) => (value === '' ? null : value);

    await userModel.updateUserProfile(userId, {
      full_name: fullName === undefined ? undefined : String(fullName).trim(),
      nickname: emptyToNull(nickname),
      phone_number: emptyToNull(phoneNumber),
      date_of_birth: emptyToNull(dateOfBirth),
      major: emptyToNull(major),
      university: emptyToNull(university),
      profile_picture: emptyToNull(profilePicture),
    });

    const profile = await userModel.findUserProfile(userId);

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan password baru wajib diisi',
      });
    }

    if (String(new_password).length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password baru minimal ${MIN_PASSWORD_LENGTH} karakter`,
      });
    }

    if (current_password === new_password) {
      return res.status(400).json({
        success: false,
        message: 'Password baru harus berbeda dari password lama',
      });
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    // Sengaja 400, bukan 401. Aplikasi Flutter akan logout otomatis saat menerima 401.
    const isCurrentPasswordValid = await comparePassword(String(current_password), user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, message: 'Password lama tidak sesuai' });
    }

    const newPasswordHash = await hashPassword(String(new_password));
    await userModel.updatePasswordHash(userId, newPasswordHash);

    res.status(200).json({ success: true, message: 'Password berhasil diubah' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  updateProfile,
  changePassword,
};