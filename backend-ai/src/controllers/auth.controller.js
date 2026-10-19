/**
 * AUTH CONTROLLER
 * Validasi input, register, dan login untuk user (siswa)
 */

const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const userModel = require('../models/user.model');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, dan nama lengkap wajib diisi',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(fullName).trim();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Format email tidak valid' });
    }

    if (String(password).length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password minimal ${MIN_PASSWORD_LENGTH} karakter`,
      });
    }

    if (trimmedName === '') {
      return res.status(400).json({ success: false, message: 'Nama lengkap tidak boleh kosong' });
    }

    const existingUser = await userModel.findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const passwordHash = await hashPassword(String(password));
    const userId = await userModel.createUserWithProfile({
      email: normalizedEmail,
      passwordHash,
      fullName: trimmedName,
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: { id: userId, email: normalizedEmail, fullName: trimmedName },
    });
  } catch (error) {
    // Dua request register bersamaan dengan email sama akan lolos cek di atas,
    // lalu ditolak oleh UNIQUE di database
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userModel.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const isPasswordMatch = await comparePassword(String(password), user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Akun tidak aktif' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: { id: user.id, email: user.email, token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};