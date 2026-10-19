/**
 * =========================================
 * JWT UTILITIES - JSON Web Token
 * =========================================
 * File ini handle generate dan verify JWT token
 * 
 * KENAPA PAKAI JWT?
 * - Stateless authentication (tidak perlu session di server)
 * - Token berisi user info, browser/app simpan & kirim setiap request
 * - Server hanya perlu verify signature token, tidak perlu query database
 * - Cocok untuk mobile app, SPA, microservices
 * 
 * JWT STRUCTURE: header.payload.signature
 * Contoh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTcyODk0OTUwMCwiZXhwIjoxNzI5NTU0MzAwfQ.xxx
 * 
 * FLOW:
 * 1. User login dengan email & password
 * 2. Password verify ✅
 * 3. Generate JWT token dengan user data di dalam
 * 4. Server kirim token ke client
 * 5. Client (browser/app) simpan token
 * 6. Setiap request, client kirim token di Authorization header
 * 7. Server verify signature token
 * 8. Jika valid, ambil user data dari token (tidak perlu query DB!)
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * GENERATE TOKEN
 * Digunakan saat user berhasil login
 * 
 * @param {Object} user - Data user yang akan di-encode ke token
 * @param {number} user.id - User ID
 * @param {string} user.email - User email
 * @returns {string} - JWT token
 * 
 * CONTOH PENGGUNAAN:
 * const token = generateToken({ id: 1, email: 'user@gmail.com' });
 * // Hasil: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwi..."
 */
const generateToken = (user) => {
  try {
    /**
     * jwt.sign(payload, secret, options)
     * 
     * payload = data yang dimasukkan ke token
     *   - id: user ID (unik)
     *   - email: user email
     *   
     * secret = JWT_SECRET dari .env (kunci untuk sign & verify)
     *   - HARUS panjang & random
     *   - JANGAN share ke orang lain
     *   
     * options:
     *   - expiresIn: berapa lama token berlaku
     *     "7d" = 7 hari
     *     "24h" = 24 jam
     *     "30m" = 30 menit
     */
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * VERIFY TOKEN
 * Digunakan di middleware auth untuk verify token dari client
 * 
 * @param {string} token - JWT token dari Authorization header
 * @returns {Object} - User data yang ter-decode dari token (id, email)
 * @throws {Error} - Jika token invalid atau expired
 * 
 * CONTOH PENGGUNAAN:
 * try {
 *   const user = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *   console.log(user.id);    // 1
 *   console.log(user.email); // user@gmail.com
 * } catch (error) {
 *   console.log('Token invalid atau expired');
 * }
 */
const verifyToken = (token) => {
  try {
    /**
     * jwt.verify(token, secret)
     * 
     * Proses verifikasi:
     * 1. Cek format token (header.payload.signature)
     * 2. Verify signature menggunakan secret yang sama
     * 3. Cek apakah token sudah expired
     * 4. Jika semua valid, decode & return payload (user data)
     * 5. Jika invalid/expired, throw error
     * 
     * SECURITY:
     * - Token tidak bisa di-modify tanpa secret
     * - Kalau hacker ubah payload, signature jadi invalid
     * - Kalau secret kebocor, hacker bisa forge token baru
     *   → JANGAN PERNAH SHARE JWT_SECRET!
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
};

/**
 * DECODE TOKEN (TANPA VERIFY)
 * Kadang kita perlu lihat isi token tanpa verify signature
 * (Tidak disarankan untuk auth, tapi berguna untuk debugging)
 * 
 * @param {string} token - JWT token
 * @returns {Object} - Payload (tanpa cek signature)
 * 
 * PERBEDAAN:
 * - verifyToken() = cek signature + payload (AMAN untuk auth)
 * - decodeToken() = lihat payload saja (TIDAK AMAN, hanya untuk debug)
 */
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    throw new Error(`Token decode failed: ${error.message}`);
  }
};

/**
 * EXPORT FUNCTIONS
 */
module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};