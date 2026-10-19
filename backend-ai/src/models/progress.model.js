const pool = require('../config/database');

// Mencatat aktivitas belajar hari ini. Bisa dipanggil dengan pool atau conn.
async function recordActivity(db, userId, dateWib) {
  await db.query(
    `INSERT INTO user_activity_days (user_id, activity_date) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE activity_date = activity_date`,
    [userId, dateWib]
  );
}

// Poin = jumlah soal berbeda yang pernah dijawab benar (jawaban terbaik per soal)
async function getTotalPoints(userId) {
  const [[row]] = await pool.query(
    `SELECT COUNT(DISTINCT ans.question_id) AS total_points
     FROM attempt_answers ans
     JOIN tryout_attempts a ON a.id = ans.attempt_id
     WHERE a.user_id = ? AND ans.is_correct = 1`,
    [userId]
  );
  return Number(row.total_points);
}

// Semua tanggal aktivitas user, urut dari paling lama
async function getActivityDates(userId) {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(activity_date, '%Y-%m-%d') AS d
     FROM user_activity_days
     WHERE user_id = ?
     ORDER BY activity_date ASC`,
    [userId]
  );
  return rows.map((r) => r.d);
}

module.exports = { recordActivity, getTotalPoints, getActivityDates };