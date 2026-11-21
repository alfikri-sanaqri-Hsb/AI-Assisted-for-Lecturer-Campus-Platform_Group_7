const pool = require('../config/database');

const MODES = ['all', 'practice', 'tryout'];

// Query per mode. Semua mengembalikan: user_id, full_name, major, points, average_score
const QUERIES = {
  // Gabungan latihan + tryout: poin = jumlah soal berbeda yang dijawab benar
  all: `SELECT u.id AS user_id,
               COALESCE(p.full_name, 'Pengguna') AS full_name,
               p.major,
               COUNT(*) AS points,
               COUNT(*) AS average_score
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
        ORDER BY points DESC, u.id ASC`,

  // Latihan: urut berdasarkan akurasi (%) lalu jumlah benar
  practice: `SELECT u.id AS user_id,
                    COALESCE(p.full_name, 'Pengguna') AS full_name,
                    p.major,
                    SUM(pa.is_correct) AS points,
                    ROUND(AVG(pa.is_correct) * 100, 1) AS average_score
             FROM practice_answers pa
             JOIN users u ON u.id = pa.user_id
             LEFT JOIN user_profiles p ON p.user_id = u.id
             GROUP BY u.id, p.full_name, p.major
             HAVING points > 0
             ORDER BY average_score DESC, points DESC, u.id ASC`,

  // Tryout: urut berdasarkan rata-rata skor semua percobaan
  tryout: `SELECT u.id AS user_id,
                  COALESCE(p.full_name, 'Pengguna') AS full_name,
                  p.major,
                  SUM(a.correct_count) AS points,
                  ROUND(AVG(a.score), 1) AS average_score
           FROM tryout_attempts a
           JOIN users u ON u.id = a.user_id
           LEFT JOIN user_profiles p ON p.user_id = u.id
           GROUP BY u.id, p.full_name, p.major
           HAVING points > 0
           ORDER BY average_score DESC, points DESC, u.id ASC`,
};

// mode: 'all' (default) | 'practice' | 'tryout'
async function getRankedUsers(mode = 'all') {
  const sql = QUERIES[MODES.includes(mode) ? mode : 'all'];
  const [rows] = await pool.query(sql);
  return rows;
}

// Jumlah seluruh user terdaftar
async function getTotalUsers() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
  return Number(rows[0].total);
}

module.exports = { getRankedUsers, getTotalUsers, MODES };
