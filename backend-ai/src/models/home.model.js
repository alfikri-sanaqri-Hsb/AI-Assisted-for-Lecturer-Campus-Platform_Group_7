const pool = require('../config/database');

async function getUserSummary(userId) {
  const [rows] = await pool.query(
    `SELECT u.email, u.is_premium, p.full_name, p.major, p.university, p.profile_picture
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  return rows[0] || null;
}

// Materi terakhir yang diselesaikan user (untuk "Lanjutkan Belajar")
async function getLastCompletedMaterial(userId) {
  const [rows] = await pool.query(
    `SELECT m.subject, m.title, p.completed_at
     FROM user_material_progress p
     JOIN materials m ON m.id = p.material_id
     WHERE p.user_id = ?
     ORDER BY p.completed_at DESC, p.id DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

// Tryout 2 hari terakhir beserta jumlah soal yang dijawab
async function getRecentAttempts(userId) {
  const [rows] = await pool.query(
    `SELECT a.id, a.submitted_at,
            (SELECT COUNT(*) FROM attempt_answers ans
             WHERE ans.attempt_id = a.id AND ans.selected_option IS NOT NULL) AS answered
     FROM tryout_attempts a
     WHERE a.user_id = ? AND a.submitted_at >= NOW() - INTERVAL 2 DAY`,
    [userId]
  );
  return rows;
}

// Jadwal yang aktif, mulai dari kemarin
async function getUpcomingSchedules() {
  const [rows] = await pool.query(
    `SELECT id, type, title, starts_at
     FROM schedules
     WHERE is_active = 1 AND starts_at >= NOW() - INTERVAL 1 DAY
     ORDER BY starts_at ASC
     LIMIT 5`
  );
  return rows;
}

async function getTestimonials() {
  const [rows] = await pool.query(
    `SELECT id, name, university, message
     FROM testimonials
     WHERE is_published = 1
     ORDER BY sort_order, id
     LIMIT 10`
  );
  return rows;
}

module.exports = {
  getUserSummary,
  getLastCompletedMaterial,
  getRecentAttempts,
  getUpcomingSchedules,
  getTestimonials,
};