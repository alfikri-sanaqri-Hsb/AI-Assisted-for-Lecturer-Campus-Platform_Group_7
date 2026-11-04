/**
 * =========================================
 * PASSWORD UTILITIES - bcryptjs
 * =========================================
 * File ini handle password hashing dan verification
 * 
 * KENAPA PAKAI BCRYPTJS?
 * - Password tidak boleh disimpan plain text (sangat berbahaya!)
 * - bcryptjs menggunakan algoritma salting (tambah random string)
 * - Password yang sudah di-hash TIDAK BISA di-reverse (irreversible)
 * - Bahkan developer/dosen tidak bisa lihat password asli user
 * 
 * FLOW:
 * 1. User input password "123456"
 * 2. bcryptjs hash → "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3..."
 * 3. Simpan hash di database, bukan plain text
 * 4. Saat login, compare input dengan hash menggunakan bcryptjs.compare()
 */

const bcrypt = require('bcryptjs');

/**
 * HASH PASSWORD
 * Digunakan saat user register atau ubah password
 * 
 * @param {string} password - Password plain text dari user
 * @returns {Promise<string>} - Password yang sudah di-hash
 * 
 * CONTOH PENGGUNAAN:
 * const hashedPassword = await hashPassword('123456');
 * // Hasil: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3..."
 */
const hashPassword = async (password) => {
  try {
    /**
     * bcrypt.hash(password, saltRounds)
     * saltRounds = berapa kali algorithm dijalankan (semakin tinggi, semakin aman tapi lambat)
     * 10 = standar yang bagus (aman tapi tidak terlalu lambat)
     * 
     * FLOW HASHING:
     * 1. Generate random "salt" (string random)
     * 2. Combine password + salt
     * 3. Hash 10 kali (iterasi) dengan algoritma bcrypt
     * 4. Hasil = "$2b$10$..." (include salt dan hash)
     */
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};

/**
 * COMPARE PASSWORD
 * Digunakan saat user login untuk verify password
 * 
 * @param {string} password - Password plain text dari user (input login)
 * @param {string} hashedPassword - Password yang sudah di-hash (dari database)
 * @returns {Promise<boolean>} - true jika match, false jika tidak
 * 
 * CONTOH PENGGUNAAN:
 * const isMatch = await comparePassword('123456', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3...');
 * if (isMatch) {
 *   // Password benar, user bisa login
 * } else {
 *   // Password salah, tolak login
 * }
 * 
 * KENAPA TIDAK BISA DI-REVERSE?
 * Hash adalah SATU ARAH, tidak bisa di-reverse:
 * 
 * "123456" → hash → "$2b$10$N9qo8..." ✅ Bisa
 * "$2b$10$N9qo..." → reverse → "123456" ❌ TIDAK BISA!
 * 
 * Satu-satunya cara verify adalah:
 * 1. Hash password input user
 * 2. Compare hash input dengan hash di database
 * 3. Kalau match, password benar
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    /**
     * bcrypt.compare(password, hash)
     * Internally:
     * 1. Extract salt dari hash
     * 2. Hash input password dengan salt yang sama
     * 3. Compare hasil dengan hash di database
     * 4. Return true/false
     */
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Password comparison failed: ${error.message}`);
  }
};

/**
 * EXPORT FUNCTIONS
 * Digunakan di controller
 */
module.exports = {
  hashPassword,
  comparePassword
};