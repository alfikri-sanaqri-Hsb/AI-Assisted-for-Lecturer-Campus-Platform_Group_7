const crypto = require('crypto');
const pool = require('../config/database');
const userModel = require('../models/user.model');
const { hashPassword } = require('../utils/password');
const { sendResetCode } = require('../utils/mailer');

const CODE_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const MIN_PASSWORD_LENGTH = 8;

// Batas anti-spam per email (tambahan 21 Nov 2026):
const MAX_CODES_PER_HOUR = 3; // maksimal 3 kode baru per jam untuk satu email
const LOCKOUT_MINUTES = 15; // setelah 5 kali salah, email dikunci 15 menit
const LOCKOUT_ATTEMPTS = 5; // jumlah percobaan salah yang memicu kunci

function makeCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

// Berapa kode yang dibuat untuk email ini dalam 1 jam terakhir?
async function countRecentCodes(email) {
  const [[row]] = await pool.query(
    'SELECT COUNT(*) AS total FROM password_resets WHERE email = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)',
    [email]
  );
  return Number(row.total);
}

// Total percobaan salah untuk email ini dalam 15 menit terakhir
// (hanya kode yang belum dipakai; kode yang sudah berhasil tidak dihitung).
async function countRecentWrongAttempts(email) {
  const [[row]] = await pool.query(
    `SELECT COALESCE(SUM(attempts), 0) AS total FROM password_resets
      WHERE email = ? AND used_at IS NULL AND created_at >= DATE_SUB(NOW(), INTERVAL ${LOCKOUT_MINUTES} MINUTE)`,
    [email]
  );
  return Number(row.total);
}

// Kalau email sedang dikunci, kembalikan pesan kunci (atau null kalau aman).
async function checkLockout(email) {
  const wrong = await countRecentWrongAttempts(email);
  if (wrong >= LOCKOUT_ATTEMPTS) {
    return `Terlalu banyak percobaan salah. Coba lagi dalam ${LOCKOUT_MINUTES} menit.`;
  }
  return null;
}

// POST /api/auth/password-reset/request
const requestReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ success: false, message: 'Email tidak valid' });
    }
    const normalized = String(email).trim().toLowerCase();
    const user = await userModel.findUserByEmail(normalized);
    // Selalu jawab sukses supaya orang luar tidak bisa menebak email terdaftar.
    if (user) {
      const locked = await checkLockout(normalized);
      if (locked) {
        return res.status(429).json({ success: false, message: locked });
      }
      const recent = await countRecentCodes(normalized);
      if (recent >= MAX_CODES_PER_HOUR) {
        return res.status(429).json({ success: false, message: `Maksimal ${MAX_CODES_PER_HOUR} kode reset per jam. Coba lagi nanti.` });
      }
      const code = makeCode();
      const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);
      await pool.query(
        'INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, ?)',
        [normalized, code, expiresAt]
      );
      await sendResetCode(normalized, code);
    }
    return res.status(200).json({
      success: true,
      message: 'Kode verifikasi dikirim jika email terdaftar. Periksa kotak masuk.',
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/password-reset/confirm
const confirmReset = async (req, res, next) => {
  try {
    const { email, code, new_password } = req.body;
    if (!email || !code || !new_password) {
      return res.status(400).json({ success: false, message: 'Email, kode, dan password baru wajib diisi' });
    }
    if (String(new_password).length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password baru minimal ${MIN_PASSWORD_LENGTH} karakter`,
      });
    }
    const normalized = String(email).trim().toLowerCase();
    const locked = await checkLockout(normalized);
    if (locked) {
      return res.status(429).json({ success: false, message: locked });
    }
    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE email = ? AND used_at IS NULL ORDER BY created_at DESC LIMIT 1',
      [normalized]
    );
    const row = rows[0];
    if (!row) {
      return res.status(400).json({ success: false, message: 'Kode tidak ditemukan. Minta kode baru.' });
    }
    if (row.attempts >= MAX_ATTEMPTS) {
      return res.status(400).json({ success: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${LOCKOUT_MINUTES} menit.` });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'Kode sudah kedaluwarsa. Minta kode baru.' });
    }
    if (String(code).trim() !== String(row.code)) {
      await pool.query('UPDATE password_resets SET attempts = attempts + 1 WHERE id = ?', [row.id]);
      return res.status(400).json({ success: false, message: 'Kode salah.' });
    }
    const user = await userModel.findUserByEmail(normalized);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email tidak terdaftar.' });
    }
    const passwordHash = await hashPassword(String(new_password));
    await userModel.updatePasswordHash(user.id, passwordHash);
    await pool.query('UPDATE password_resets SET used_at = NOW() WHERE id = ?', [row.id]);
    return res.status(200).json({ success: true, message: 'Kata sandi berhasil diperbarui. Silakan login kembali.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { requestReset, confirmReset };