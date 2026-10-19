/**
 * USER MODEL
 * Satu-satunya tempat yang menulis SQL untuk tabel users dan user_profiles
 */

const pool = require('../config/database');

// Daftar kolom yang boleh diubah lewat updateUserProfile (whitelist)
const PROFILE_FIELDS = ['full_name', 'phone_number', 'date_of_birth', 'major', 'profile_picture'];

const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

/**
 * Membuat user dan profilnya dalam satu transaksi.
 * Kalau salah satu gagal, keduanya dibatalkan, sehingga tidak ada user tanpa profil.
 */
const createUserWithProfile = async ({ email, passwordHash, fullName }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, 'student']
    );

    await connection.query(
      'INSERT INTO user_profiles (user_id, full_name) VALUES (?, ?)',
      [userResult.insertId, fullName]
    );

    await connection.commit();
    return userResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const findUserProfile = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
  return rows[0];
};

/**
 * Update parsial: hanya kolom yang dikirim (tidak undefined) yang diubah.
 * Nilai null tetap diproses, supaya user bisa mengosongkan kolom opsional.
 */
const updateUserProfile = async (userId, fields) => {
  const changedColumns = PROFILE_FIELDS.filter((column) => fields[column] !== undefined);
  if (changedColumns.length === 0) return 0;

  const setClause = changedColumns.map((column) => `${column} = ?`).join(', ');
  const values = changedColumns.map((column) => fields[column]);

  const [result] = await pool.query(
    `UPDATE user_profiles SET ${setClause} WHERE user_id = ?`,
    [...values, userId]
  );
  return result.affectedRows;
};

const updatePasswordHash = async (userId, passwordHash) => {
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
};

// Data dashboard: user + profil. date_of_birth diformat di SQL agar tidak bergeser zona waktu.
const getDashboardData = async (userId) => {
  const query = `
    SELECT
      u.id, u.email, u.role, u.status,
      p.full_name, p.phone_number, p.profile_picture,
      DATE_FORMAT(p.date_of_birth, '%Y-%m-%d') AS date_of_birth,
      p.major
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = ?
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUserWithProfile,
  findUserProfile,
  updateUserProfile,
  updatePasswordHash,
  getDashboardData,
};