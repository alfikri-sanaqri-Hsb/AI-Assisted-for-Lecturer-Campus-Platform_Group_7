const pool = require('../config/database');

// Mencatat aktivitas belajar hari ini. Bisa dipanggil dengan pool atau conn.
async function recordActivity(db, userId, dateWib) {
  await db.query(
    `INSERT INTO user_activity_days (user_id, activity_date) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE activity_date = activity_date`,
    [userId, dateWib]
  );
}

// Poin = jumlah soal berbeda yang pernah dijawab benar, dari tryout dan latihan
async function getTotalPoints(userId) {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS total_points FROM (
       SELECT ans.question_id
       FROM attempt_answers ans
       JOIN tryout_attempts a ON a.id = ans.attempt_id
       WHERE a.user_id = ? AND ans.is_correct = 1
       UNION
       SELECT pa.question_id
       FROM practice_answers pa
       WHERE pa.user_id = ? AND pa.is_correct = 1
     ) s`,
    [userId, userId]
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

// Jumlah materi per subtes dan jumlah yang sudah selesai
async function getSubjectProgress(userId) {
  const [rows] = await pool.query(
    `SELECT m.subject,
            COUNT(DISTINCT m.id) AS materials_total,
            COUNT(DISTINCT p.material_id) AS materials_completed
     FROM materials m
     LEFT JOIN user_material_progress p
       ON p.material_id = m.id AND p.user_id = ?
     GROUP BY m.subject
     ORDER BY m.subject`,
    [userId]
  );
  return rows;
}

// Jawaban yang sudah dipilih user per subtes, dari tryout dan latihan
async function getSubjectAccuracy(userId) {
  const [rows] = await pool.query(
    `SELECT q.subject,
            COUNT(*) AS answered,
            COALESCE(SUM(s.is_correct), 0) AS correct
     FROM (
       SELECT ans.question_id, ans.is_correct
       FROM attempt_answers ans
       JOIN tryout_attempts a ON a.id = ans.attempt_id
       WHERE a.user_id = ? AND ans.selected_option IS NOT NULL
       UNION ALL
       SELECT pa.question_id, pa.is_correct
       FROM practice_answers pa
       WHERE pa.user_id = ? AND pa.selected_option IS NOT NULL
     ) s
     JOIN questions q ON q.id = s.question_id
     GROUP BY q.subject`,
    [userId, userId]
  );
  return rows;
}

// 10 tryout terakhir yang dikerjakan user
async function getTryoutHistory(userId) {
  const [rows] = await pool.query(
    `SELECT a.id AS attempt_id, a.tryout_id, t.title, a.score,
            a.correct_count, a.total_questions, a.submitted_at
     FROM tryout_attempts a
     JOIN tryouts t ON t.id = a.tryout_id
     WHERE a.user_id = ?
     ORDER BY a.submitted_at DESC, a.id DESC
     LIMIT 10`,
    [userId]
  );
  return rows;
}

module.exports = {
  recordActivity,
  getTotalPoints,
  getActivityDates,
  getSubjectProgress,
  getSubjectAccuracy,
  getTryoutHistory,
};