const pool = require('../config/database');

// Semua user yang punya poin, diurutkan dari poin tertinggi
async function getRankedUsers() {
  const [rows] = await pool.query(
    `SELECT u.id AS user_id,
            COALESCE(p.full_name, 'Pengguna') AS full_name,
            p.major,
            COUNT(*) AS points
     FROM (
       SELECT a.user_id, ans.question_id
       FROM attempt_answers ans
       JOIN tryout_attempts a ON a.id = ans.attempt_id
       WHERE ans.is_correct = 1
       UNION
       SELECT pa.user_id, pa.question_id
       FROM practice_answers pa
       WHERE pa.is_correct = 1
     ) s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN user_profiles p ON p.user_id = u.id
     GROUP BY u.id, p.full_name, p.major
     ORDER BY points DESC, u.id ASC`
  );
  return rows;
}

// Jumlah seluruh user terdaftar
async function getTotalUsers() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
  return Number(rows[0].total);
}

module.exports = { getRankedUsers, getTotalUsers };