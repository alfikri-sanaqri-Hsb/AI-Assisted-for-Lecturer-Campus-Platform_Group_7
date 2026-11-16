const pool = require('../config/database');
const { searchClause } = require('../utils/listQuery');

// Nama urutan di URL -> kolom SQL (daftar tetap, aman ditempel ke ORDER BY)
const STUDENT_SORT = { terbaru: 'u.id', nama: 'name', email: 'u.email', tryout: 'tryout_count', skor: 'avg_score' };
const MENTOR_SORT = { terbaru: 'id', nama: 'name' };

async function getDashboardSummary() {
  const [[students]] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
  const [[mentors]] = await pool.query('SELECT COUNT(*) AS total FROM mentors WHERE is_active = 1');
  const [[tryouts]] = await pool.query('SELECT COUNT(*) AS total FROM tryouts WHERE is_published = 1');
  const [[materials]] = await pool.query('SELECT COUNT(*) AS total FROM materials');
  const [[insights]] = await pool.query('SELECT COUNT(*) AS total FROM ai_insights');
  return {
    total_students: students.total,
    total_mentors: mentors.total,
    total_tryouts: tryouts.total,
    total_materials: materials.total,
    total_ai_insights: insights.total,
  };
}

// Daftar siswa: data akun + profil + ringkasan tryout + target prodi pertama
async function listStudents(f) {
  const s = searchClause(f.cari, ['p.full_name', 'u.email', 'p.university']);
  const where = ["u.role = 'student'", ...s.where].join(' AND ');
  const offset = (f.halaman - 1) * f.perHalaman;

  const [rows] = await pool.query(
    `SELECT u.id,
            COALESCE(p.full_name, u.email) AS name,
            u.email,
            p.university AS school,
            u.status,
            u.is_premium,
            u.created_at AS joined_at,
            (SELECT COUNT(*) FROM tryout_attempts a WHERE a.user_id = u.id) AS tryout_count,
            (SELECT ROUND(AVG(a.score), 2) FROM tryout_attempts a WHERE a.user_id = u.id) AS avg_score,
            (SELECT CONCAT(pp.program_name, ' - ', pp.university)
               FROM user_targets t JOIN ptn_programs pp ON pp.id = t.program_id
              WHERE t.user_id = u.id ORDER BY t.id ASC LIMIT 1) AS target_major
       FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE ${where}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, u.id ASC
      LIMIT ? OFFSET ?`,
    [...s.params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE ${where}`,
    s.params
  );
  return { rows, total: Number(total) };
}

// Daftar mentor (tabel mentors)
async function listMentors(f) {
  const s = searchClause(f.cari, ['name', 'subjects', 'university']);
  const where = s.where.length ? `WHERE ${s.where.join(' AND ')}` : '';
  const offset = (f.halaman - 1) * f.perHalaman;

  const [rows] = await pool.query(
    `SELECT id, name, university, major, subjects, is_active, is_featured, created_at
       FROM mentors ${where}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, id ASC
      LIMIT ? OFFSET ?`,
    [...s.params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM mentors ${where}`, s.params);
  return { rows, total: Number(total) };
}

module.exports = { getDashboardSummary, listStudents, listMentors, STUDENT_SORT, MENTOR_SORT };
