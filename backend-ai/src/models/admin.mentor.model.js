/** Model admin untuk mentor dan sesi live (Zoom/Meet). Chat mentor = link grup WhatsApp/Telegram (group_url). */
const pool = require('../config/database');
const { searchClause } = require('../utils/listQuery');

const SESSION_SORT = { mulai: 's.starts_at', terbaru: 's.id' };

async function getMentor(id) {
  const [rows] = await pool.query(
    `SELECT id, name, photo_url, university, major, bio, subjects, group_url,
            is_active, is_featured, user_id, created_at
       FROM mentors WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

// Akun yang ditautkan harus ada dan ber-role mentor
async function isMentorAccount(userId) {
  const [rows] = await pool.query("SELECT id FROM users WHERE id = ? AND role = 'mentor'", [userId]);
  return rows.length > 0;
}

async function createMentor(d) {
  const [r] = await pool.query(
    `INSERT INTO mentors (name, photo_url, university, major, bio, subjects, group_url, is_featured, is_active, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [d.name, d.photo_url, d.university, d.major, d.bio, d.subjects, d.group_url, d.is_featured, d.is_active, d.user_id]
  );
  return r.insertId;
}

async function updateMentor(id, d) {
  const [r] = await pool.query(
    `UPDATE mentors SET name = ?, photo_url = ?, university = ?, major = ?, bio = ?, subjects = ?,
            group_url = ?, is_featured = ?, is_active = ?, user_id = ? WHERE id = ?`,
    [d.name, d.photo_url, d.university, d.major, d.bio, d.subjects, d.group_url, d.is_featured, d.is_active, d.user_id, id]
  );
  return r.affectedRows;
}

async function setMentorActive(id, isActive) {
  const [r] = await pool.query('UPDATE mentors SET is_active = ? WHERE id = ?', [isActive, id]);
  return r.affectedRows;
}

/* ---------- SESI LIVE ---------- */

async function listSessions(f, filter = {}) {
  const s = searchClause(f.cari, ['s.title', 'm.name']);
  const where = [...s.where];
  const params = [...s.params];
  if (filter.mentorId) { where.push('s.mentor_id = ?'); params.push(filter.mentorId); }
  if (filter.upcoming) where.push('DATE_ADD(s.starts_at, INTERVAL s.duration_minutes MINUTE) >= NOW()');
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const from = `FROM mentor_sessions s JOIN mentors m ON m.id = s.mentor_id ${whereSql}`;
  const offset = (f.halaman - 1) * f.perHalaman;

  const [rows] = await pool.query(
    `SELECT s.id, s.mentor_id, m.name AS mentor_name, s.title, s.starts_at, s.duration_minutes,
            s.meeting_url, s.is_active, s.created_at
       ${from}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, s.id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total ${from}`, params);
  return { rows, total: Number(total) };
}

async function createSession(d) {
  const [r] = await pool.query(
    `INSERT INTO mentor_sessions (mentor_id, title, starts_at, duration_minutes, meeting_url, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [d.mentor_id, d.title, d.starts_at, d.duration_minutes, d.meeting_url, d.is_active]
  );
  return r.insertId;
}

async function updateSession(id, d) {
  const [r] = await pool.query(
    `UPDATE mentor_sessions SET mentor_id = ?, title = ?, starts_at = ?, duration_minutes = ?,
            meeting_url = ?, is_active = ? WHERE id = ?`,
    [d.mentor_id, d.title, d.starts_at, d.duration_minutes, d.meeting_url, d.is_active, id]
  );
  return r.affectedRows;
}

async function deleteSession(id) {
  const [r] = await pool.query('DELETE FROM mentor_sessions WHERE id = ?', [id]);
  return r.affectedRows;
}

module.exports = {
  SESSION_SORT,
  getMentor, isMentorAccount, createMentor, updateMentor, setMentorActive,
  listSessions, createSession, updateSession, deleteSession,
};
