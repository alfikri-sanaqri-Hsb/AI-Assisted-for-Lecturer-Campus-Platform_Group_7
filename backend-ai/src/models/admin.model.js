const pool = require('../config/database');
const { searchClause } = require('../utils/listQuery');

// Nama urutan di URL -> kolom SQL (daftar tetap, aman ditempel ke ORDER BY)
const STUDENT_SORT = { terbaru: 'u.id', nama: 'name', email: 'u.email', tryout: 'tryout_count', skor: 'avg_score' };
const MENTOR_SORT = { terbaru: 'id', nama: 'name' };
const ORDER_SORT = { terbaru: 'o.id', nominal: 'o.amount' };

async function getDashboardSummary() {
  const [[students]] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
  const [[mentors]] = await pool.query('SELECT COUNT(*) AS total FROM mentors WHERE is_active = 1');
  const [[tryouts]] = await pool.query('SELECT COUNT(*) AS total FROM tryouts WHERE is_published = 1');
  const [[materials]] = await pool.query('SELECT COUNT(*) AS total FROM materials');
  const [[pending]] = await pool.query("SELECT COUNT(*) AS total FROM materials WHERE status = 'pending_review'");
  const [[orders]] = await pool.query("SELECT COUNT(*) AS total FROM subscription_orders WHERE status = 'paid'");
  const [[insights]] = await pool.query('SELECT COUNT(*) AS total FROM ai_insights');
  return {
    total_students: students.total,
    total_mentors: mentors.total,
    total_tryouts: tryouts.total,
    total_materials: materials.total,
    pending_review: pending.total,
    paid_orders: orders.total,
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

// Aktifkan / nonaktifkan akun siswa (hanya role student, admin tidak bisa dikunci lewat sini)
async function setStudentStatus(id, status) {
  const [r] = await pool.query("UPDATE users SET status = ? WHERE id = ? AND role = 'student'", [status, id]);
  return r.affectedRows;
}

// Daftar mentor (tabel mentors)
async function listMentors(f) {
  const s = searchClause(f.cari, ['name', 'subjects', 'university']);
  const where = s.where.length ? `WHERE ${s.where.join(' AND ')}` : '';
  const offset = (f.halaman - 1) * f.perHalaman;

  const [rows] = await pool.query(
    `SELECT id, name, photo_url, university, major, bio, subjects, group_url,
            is_active, is_featured, user_id, created_at
       FROM mentors ${where}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, id ASC
      LIMIT ? OFFSET ?`,
    [...s.params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM mentors ${where}`, s.params);
  return { rows, total: Number(total) };
}

// Pesanan langganan (pembayaran simulasi), hanya dibaca
async function listOrders(f, status) {
  const s = searchClause(f.cari, ['p.full_name', 'u.email', 'o.plan_name']);
  const where = [...s.where];
  const params = [...s.params];
  if (status) { where.push('o.status = ?'); params.push(status); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const from = `FROM subscription_orders o
                JOIN users u ON u.id = o.user_id
                LEFT JOIN user_profiles p ON p.user_id = u.id ${whereSql}`;
  const offset = (f.halaman - 1) * f.perHalaman;

  const [rows] = await pool.query(
    `SELECT o.id, o.user_id, COALESCE(p.full_name, u.email) AS student_name, u.email,
            o.plan_name, o.duration_months, o.amount, o.payment_method, o.status, o.paid_at, o.created_at
       ${from}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, o.id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total ${from}`, params);
  const [[sum]] = await pool.query(
    "SELECT COUNT(*) AS paid_count, COALESCE(SUM(amount), 0) AS paid_amount FROM subscription_orders WHERE status = 'paid'"
  );
  return { rows, total: Number(total), summary: { paid_count: Number(sum.paid_count), paid_amount: Number(sum.paid_amount) } };
}

module.exports = {
  getDashboardSummary, listStudents, setStudentStatus, listMentors, listOrders,
  STUDENT_SORT, MENTOR_SORT, ORDER_SORT,
};
