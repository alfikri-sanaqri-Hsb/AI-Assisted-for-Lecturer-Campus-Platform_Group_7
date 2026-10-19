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
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, phoneNumber, dateOfBirth, major, profilePicture } = req.body;

    const validationError = validateProfileInput({ fullName, dateOfBirth });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const profile = await userModel.findUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profil tidak ditemukan' });
    }

    await userModel.updateUserProfile(userId, {
      full_name: fullName === undefined ? undefined : String(fullName).trim(),
      phone_number: emptyToNull(phoneNumber),
      date_of_birth: emptyToNull(dateOfBirth),
      major: emptyToNull(major),
      profile_picture: emptyToNull(profilePicture),
    });

    const updated = await userModel.getDashboardData(userId);

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diupdate',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan password baru wajib diisi',
      });
    }

    if (String(newPassword).length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password baru minimal ${MIN_PASSWORD_LENGTH} karakter`,
      });
    }

    if (currentPassword === newPassword) {
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
    const isCurrentPasswordValid = await comparePassword(String(currentPassword), user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, message: 'Password lama tidak sesuai' });
    }

    const newPasswordHash = await hashPassword(String(newPassword));
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