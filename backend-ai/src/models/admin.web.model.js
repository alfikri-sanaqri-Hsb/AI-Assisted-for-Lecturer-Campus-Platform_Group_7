/** Model admin untuk kebutuhan web (fix8): penugasan mentor, bank soal, paket tryout,
    jadwal, pengaturan admin, log audit, dan siswa. Semua nilai lewat placeholder ?. */
const pool = require('../config/database');
const { searchClause } = require('../utils/listQuery');

/* ================= PENUGASAN MENTOR -> SISWA ================= */

async function mentorExists(id) {
  const [[row]] = await pool.query('SELECT id FROM mentors WHERE id = ?', [id]);
  return !!row;
}

async function studentExists(id) {
  const [[row]] = await pool.query("SELECT id FROM users WHERE id = ? AND role = 'student'", [id]);
  return !!row;
}

async function tryoutExists(id) {
  const [[row]] = await pool.query('SELECT id FROM tryouts WHERE id = ?', [id]);
  return !!row;
}

// Daftar siswa yang ditugaskan ke satu mentor (bentuk sama seperti daftar siswa admin)
async function listStudentsByMentor(mentorId, f) {
  const s = searchClause(f.cari, ['p.full_name', 'u.email', 'p.university']);
  const where = ['ms.mentor_id = ?', ...s.where].join(' AND ');
  const params = [mentorId, ...s.params];
  const offset = (f.halaman - 1) * f.perHalaman;
  const [rows] = await pool.query(
    `SELECT u.id,
            COALESCE(p.full_name, u.email) AS name,
            u.email,
            p.university AS school,
            p.major AS target_major,
            u.status,
            u.is_premium,
            u.created_at AS joined_at,
            ms.assigned_at,
            (SELECT COUNT(*) FROM tryout_attempts a WHERE a.user_id = u.id) AS tryout_count,
            (SELECT ROUND(AVG(a.score), 2) FROM tryout_attempts a WHERE a.user_id = u.id) AS avg_score
       FROM mentor_students ms
       JOIN users u ON u.id = ms.student_id
       LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE ${where}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, u.id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
       FROM mentor_students ms
       JOIN users u ON u.id = ms.student_id
       LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE ${where}`,
    params
  );
  return { rows, total: Number(total) };
}

async function assignStudent(mentorId, studentId) {
  const [r] = await pool.query(
    'INSERT INTO mentor_students (mentor_id, student_id) VALUES (?, ?)',
    [mentorId, studentId]
  );
  return r.insertId;
}

async function unassignStudent(mentorId, studentId) {
  const [r] = await pool.query(
    'DELETE FROM mentor_students WHERE mentor_id = ? AND student_id = ?',
    [mentorId, studentId]
  );
  return r.affectedRows;
}

/* ================= MENTOR: izin, status, rating, profil ================= */

const MENTOR_FULL_SELECT = `
  SELECT m.id, m.name, m.photo_url, m.university, m.major, m.bio, m.subjects, m.group_url,
         m.is_active, m.is_featured, m.user_id, m.rating, m.status, m.permissions,
         m.availability_notes, m.created_at,
         u.email AS mentor_email,
         p.phone_number AS mentor_phone,
         (SELECT COUNT(*) FROM mentor_students ms WHERE ms.mentor_id = m.id) AS assigned_students_count,
         (SELECT COUNT(*) FROM materials mt WHERE mt.author_id = m.user_id) AS materials_count,
         (SELECT COUNT(*) FROM questions q WHERE q.author_id = m.user_id) AS questions_count,
         (SELECT COUNT(*) FROM tryouts t WHERE t.author_id = m.user_id) AS tryouts_count
    FROM mentors m
    LEFT JOIN users u ON u.id = m.user_id
    LEFT JOIN user_profiles p ON p.user_id = u.id`;

function parsePermissions(raw) {
  const empty = { canCreateMaterials: false, canCreateQuestions: false, canCreateTryouts: false, canDirectPublish: false };
  if (raw === null || raw === undefined) return empty;
  let obj = raw;
  if (typeof raw === 'string') {
    try { obj = JSON.parse(raw); } catch { return empty; }
  }
  if (!obj || typeof obj !== 'object') return empty;
  return {
    canCreateMaterials: obj.canCreateMaterials === true || obj.canCreateMaterials === 1,
    canCreateQuestions: obj.canCreateQuestions === true || obj.canCreateQuestions === 1,
    canCreateTryouts: obj.canCreateTryouts === true || obj.canCreateTryouts === 1,
    canDirectPublish: obj.canDirectPublish === true || obj.canDirectPublish === 1,
  };
}

async function getMentorFull(id) {
  const [rows] = await pool.query(`${MENTOR_FULL_SELECT} WHERE m.id = ?`, [id]);
  if (!rows[0]) return null;
  const m = rows[0];
  m.permissions = parsePermissions(m.permissions);
  return m;
}

async function setMentorPermissions(id, permissions) {
  const [r] = await pool.query('UPDATE mentors SET permissions = ? WHERE id = ?', [JSON.stringify(permissions), id]);
  return r.affectedRows;
}

// status: 'Aktif' | 'Menunggu Verifikasi' | 'Cuti' | 'Nonaktif'
// is_active ikut disinkronkan hanya untuk 'Aktif' (1) dan 'Nonaktif' (0);
// 'Cuti' / 'Menunggu Verifikasi' tidak mengubah is_active (mentor tetap tampil, berlabel Cuti).
async function setMentorStatus(id, { status, rating, isActive }) {
  const sets = ['status = ?'];
  const params = [status];
  if (rating !== undefined) { sets.push('rating = ?'); params.push(rating); }
  if (isActive !== undefined) { sets.push('is_active = ?'); params.push(isActive); }
  params.push(id);
  const [r] = await pool.query(`UPDATE mentors SET ${sets.join(', ')} WHERE id = ?`, params);
  return r.affectedRows;
}

async function updateMentorProfile(id, d) {
  const sets = [];
  const params = [];
  if (d.name !== undefined) { sets.push('name = ?'); params.push(d.name); }
  if (d.major !== undefined) { sets.push('major = ?'); params.push(d.major); }
  if (d.subjects !== undefined) { sets.push('subjects = ?'); params.push(d.subjects); }
  if (d.bio !== undefined) { sets.push('bio = ?'); params.push(d.bio); }
  if (d.availability_notes !== undefined) { sets.push('availability_notes = ?'); params.push(d.availability_notes); }
  if (d.rating !== undefined) { sets.push('rating = ?'); params.push(d.rating); }
  if (!sets.length) return 0;
  params.push(id);
  const [r] = await pool.query(`UPDATE mentors SET ${sets.join(', ')} WHERE id = ?`, params);
  return r.affectedRows;
}

async function updateMentorPhone(userId, phoneNumber) {
  if (!userId) return 0;
  const [r] = await pool.query(
    `INSERT INTO user_profiles (user_id, full_name, phone_number)
     VALUES (?, '', ?)
     ON DUPLICATE KEY UPDATE phone_number = VALUES(phone_number)`,
    [userId, phoneNumber]
  );
  return r.affectedRows;
}

async function deleteMentor(id) {
  const [r] = await pool.query('DELETE FROM mentors WHERE id = ?', [id]);
  return r.affectedRows;
}

/* ================= BANK SOAL MANDIRI ================= */

const QUESTION_SORT = { terbaru: 'q.id', mapel: 'q.subject' };

const QUESTION_SELECT = `
  SELECT q.id, CONCAT('Q-', q.id) AS code, q.tryout_id, q.subject,
         q.subject AS topic, q.subject AS subtest,
         q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.option_e,
         q.correct_option,
         CONCAT(UPPER(SUBSTRING(q.difficulty, 1, 1)), SUBSTRING(q.difficulty, 2)) AS difficulty,
         q.explanation, q.image_url, q.sort_order, q.status,
         q.review_note AS rejection_reason,
         (q.status <> 'rejected') AS is_active,
         q.author_id, COALESCE(p.full_name, u.email) AS author_name,
         q.created_at, q.updated_at
    FROM questions q
    LEFT JOIN users u ON u.id = q.author_id
    LEFT JOIN user_profiles p ON p.user_id = u.id`;

async function listQuestions(f, filter = {}) {
  const s = searchClause(f.cari, ['q.question_text', 'q.subject']);
  const where = [...s.where];
  const params = [...s.params];
  if (filter.status) { where.push('q.status = ?'); params.push(filter.status); }
  if (filter.subject) { where.push('q.subject = ?'); params.push(filter.subject); }
  if (filter.tryoutId) { where.push('q.tryout_id = ?'); params.push(filter.tryoutId); }
  if (filter.authorId) { where.push('q.author_id = ?'); params.push(filter.authorId); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (f.halaman - 1) * f.perHalaman;
  const [rows] = await pool.query(
    `${QUESTION_SELECT} ${whereSql}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, q.id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM questions q ${whereSql}`, params);
  return { rows, total: Number(total) };
}

async function getQuestion(id) {
  const [rows] = await pool.query(`${QUESTION_SELECT} WHERE q.id = ?`, [id]);
  return rows[0] || null;
}

async function createQuestion(q, authorId) {
  const [r] = await pool.query(
    `INSERT INTO questions
       (tryout_id, subject, question_text, option_a, option_b, option_c, option_d, option_e,
        correct_option, difficulty, explanation, image_url, sort_order, status, author_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
    [q.tryout_id, q.subject, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
     q.option_e, q.correct_option, q.difficulty, q.explanation, q.image_url, q.sort_order, authorId || null]
  );
  return r.insertId;
}

async function updateQuestion(id, q) {
  // tryout_id memakai COALESCE: alur lama (editor soal tryout) tidak mengirim tryout_id,
  // jadi jangan sampai update soal malah melepas soal dari tryout-nya.
  const [r] = await pool.query(
    `UPDATE questions SET tryout_id = COALESCE(?, tryout_id), subject = ?, question_text = ?, option_a = ?, option_b = ?,
            option_c = ?, option_d = ?, option_e = ?, correct_option = ?, difficulty = ?,
            explanation = ?, image_url = ?, sort_order = ? WHERE id = ?`,
    [q.tryout_id, q.subject, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
     q.option_e, q.correct_option, q.difficulty, q.explanation, q.image_url, q.sort_order, id]
  );
  return r.affectedRows;
}

async function deleteQuestion(id) {
  const [r] = await pool.query('DELETE FROM questions WHERE id = ?', [id]);
  return r.affectedRows;
}

async function setQuestionStatus(id, status, reviewNote) {
  const [r] = await pool.query(
    'UPDATE questions SET status = ?, review_note = ? WHERE id = ?',
    [status, status === 'rejected' ? reviewNote : null, id]
  );
  return r.affectedRows;
}
/* ================= PAKET TRYOUT: status + subtes ================= */

const TRYOUT_DETAIL_SELECT = `
  SELECT t.id, t.title, t.description, '' AS target_batch, t.duration_minutes,
         (SELECT COUNT(*) FROM questions q WHERE q.tryout_id = t.id) AS total_questions,
         t.status, t.review_note AS rejection_reason, t.is_published AS is_active,
         t.withdrawal_requested, t.withdrawal_reason,
         t.author_id, COALESCE(p.full_name, u.email) AS author_name,
         t.created_at, t.updated_at
    FROM tryouts t
    LEFT JOIN users u ON u.id = t.author_id
    LEFT JOIN user_profiles p ON p.user_id = u.id`;

async function getTryoutDetail(id) {
  const [rows] = await pool.query(`${TRYOUT_DETAIL_SELECT} WHERE t.id = ?`, [id]);
  if (!rows[0]) return null;
  const t = rows[0];
  const [subtests] = await pool.query(
    `SELECT id, tryout_id, name, question_count, duration_minutes, sort_order, created_at, updated_at
       FROM tryout_subtests WHERE tryout_id = ? ORDER BY sort_order, id`,
    [id]
  );
  const [qs] = await pool.query('SELECT id FROM questions WHERE tryout_id = ? ORDER BY sort_order, id', [id]);
  t.subtests = subtests;
  t.question_ids = qs.map((q) => q.id);
  t.history = [];
  return t;
}

// status baru juga mengatur is_published (published=1, selain itu 0) dan
// menghapus permintaan penarikan kalau admin sudah bertindak (publish/draft).
async function setTryoutStatus(id, status, reviewNote) {
  const isPublished = status === 'published' ? 1 : 0;
  const [r] = await pool.query(
    `UPDATE tryouts SET status = ?, review_note = ?, is_published = ?,
            withdrawal_requested = 0, withdrawal_reason = NULL WHERE id = ?`,
    [status, status === 'rejected' ? reviewNote : null, isPublished, id]
  );
  return r.affectedRows;
}

async function requestWithdrawal(id, reason) {
  const [r] = await pool.query(
    'UPDATE tryouts SET withdrawal_requested = 1, withdrawal_reason = ? WHERE id = ?',
    [reason, id]
  );
  return r.affectedRows;
}

/* ---------- SUBTES ---------- */

async function listSubtests(tryoutId) {
  const [rows] = await pool.query(
    `SELECT id, tryout_id, name, question_count, duration_minutes, sort_order, created_at, updated_at
       FROM tryout_subtests WHERE tryout_id = ? ORDER BY sort_order, id`,
    [tryoutId]
  );
  return rows;
}

async function getSubtest(id) {
  const [rows] = await pool.query(
    `SELECT id, tryout_id, name, question_count, duration_minutes, sort_order, created_at, updated_at
       FROM tryout_subtests WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function createSubtest(tryoutId, d) {
  const [r] = await pool.query(
    `INSERT INTO tryout_subtests (tryout_id, name, question_count, duration_minutes, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [tryoutId, d.name, d.question_count, d.duration_minutes, d.sort_order]
  );
  return r.insertId;
}

async function updateSubtest(id, d) {
  const [r] = await pool.query(
    `UPDATE tryout_subtests SET name = ?, question_count = ?, duration_minutes = ?, sort_order = ?
      WHERE id = ?`,
    [d.name, d.question_count, d.duration_minutes, d.sort_order, id]
  );
  return r.affectedRows;
}

async function deleteSubtest(id) {
  const [r] = await pool.query('DELETE FROM tryout_subtests WHERE id = ?', [id]);
  return r.affectedRows;
}

/* ================= JADWAL ================= */

const SCHEDULE_SORT = { terbaru: 's.id', mulai: 's.starts_at' };

// type lama 'tryout'/'live_mentoring' diterjemahkan ke label web saat dibaca,
// supaya data lama tetap tampil benar di web.
const SCHEDULE_SELECT = `
  SELECT s.id, s.title,
         CASE s.type WHEN 'tryout' THEN 'Simulasi Tryout'
                     WHEN 'live_mentoring' THEN 'Sesi Mentoring'
                     ELSE s.type END AS type,
         DATE_FORMAT(s.starts_at, '%Y-%m-%d') AS date,
         DATE_FORMAT(s.starts_at, '%H:%i') AS start_time,
         DATE_FORMAT(COALESCE(s.ends_at, DATE_ADD(s.starts_at, INTERVAL 60 MINUTE)), '%H:%i') AS end_time,
         s.mentor_id, m.name AS mentor_name,
         s.student_ids, s.platform, s.meet_url, s.status, s.notes,
         s.managed_by_admin, s.is_active, s.created_at
    FROM schedules s
    LEFT JOIN mentors m ON m.id = s.mentor_id`;

async function listSchedules(f, filter = {}) {
  const s = searchClause(f.cari, ['s.title']);
  const where = [...s.where];
  const params = [...s.params];
  if (filter.mentorId) { where.push('s.mentor_id = ?'); params.push(filter.mentorId); }
  if (filter.status) { where.push('s.status = ?'); params.push(filter.status); }
  if (filter.type) { where.push('s.type = ?'); params.push(filter.type); }
  if (filter.date) { where.push('DATE(s.starts_at) = ?'); params.push(filter.date); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (f.halaman - 1) * f.perHalaman;
  const [rows] = await pool.query(
    `${SCHEDULE_SELECT} ${whereSql}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, s.id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM schedules s ${whereSql}`, params);
  return { rows, total: Number(total) };
}

async function getSchedule(id) {
  const [rows] = await pool.query(`${SCHEDULE_SELECT} WHERE s.id = ?`, [id]);
  return rows[0] || null;
}

async function createSchedule(d) {
  const [r] = await pool.query(
    `INSERT INTO schedules
       (type, title, starts_at, ends_at, mentor_id, platform, meet_url, status, student_ids, notes, managed_by_admin, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [d.type, d.title, d.starts_at, d.ends_at, d.mentor_id, d.platform, d.meet_url,
     d.status, JSON.stringify(d.student_ids || []), d.notes, d.status === 'Dibatalkan' ? 0 : 1]
  );
  return r.insertId;
}

async function updateSchedule(id, d) {
  const [r] = await pool.query(
    `UPDATE schedules SET type = ?, title = ?, starts_at = ?, ends_at = ?, mentor_id = ?,
            platform = ?, meet_url = ?, status = ?, student_ids = ?, notes = ?, is_active = ?
      WHERE id = ?`,
    [d.type, d.title, d.starts_at, d.ends_at, d.mentor_id, d.platform, d.meet_url,
     d.status, JSON.stringify(d.student_ids || []), d.notes, d.status === 'Dibatalkan' ? 0 : 1, id]
  );
  return r.affectedRows;
}

async function deleteSchedule(id) {
  const [r] = await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
  return r.affectedRows;
}

// Bentrok = jadwal lain milik mentor yang sama, di tanggal yang sama, yang jamnya
// beririsan dengan [start, end). Baris lama tanpa ends_at dianggap 60 menit.
async function findConflicts({ start, end, mentorId, excludeId }) {
  const params = [mentorId, start, end, start];
  let sql = `
    SELECT s.id, s.title, s.starts_at, s.ends_at, s.mentor_id, s.status
      FROM schedules s
     WHERE s.mentor_id = ?
       AND DATE(s.starts_at) = DATE(?)
       AND s.is_active = 1
       AND s.starts_at < ?
       AND COALESCE(s.ends_at, DATE_ADD(s.starts_at, INTERVAL 60 MINUTE)) > ?`;
  if (excludeId) { sql += ' AND s.id <> ?'; params.push(excludeId); }
  sql += ' ORDER BY s.starts_at ASC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

/* ================= PENGATURAN ADMIN + LOG AUDIT ================= */

async function getAllSettings() {
  const [rows] = await pool.query('SELECT `key`, `value` FROM admin_settings');
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

async function setSettings(pairs) {
  // pairs: array [key, value]
  for (const [key, value] of pairs) {
    await pool.query(
      'INSERT INTO admin_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      [key, value === null || value === undefined ? null : String(value)]
    );
  }
}

const AUDIT_SORT = { terbaru: 'id' };

async function listAuditLogs(f, filter = {}) {
  const where = [];
  const params = [];
  if (filter.actor) { where.push('actor_role = ?'); params.push(filter.actor); }
  if (filter.target) { where.push('target_type = ?'); params.push(filter.target); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (f.halaman - 1) * f.perHalaman;
  const [rows] = await pool.query(
    `SELECT id, actor_role, actor_name, action, target_type, target_id, target_title, details, created_at
       FROM audit_logs ${whereSql}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM audit_logs ${whereSql}`, params);
  return { rows, total: Number(total) };
}

async function createAuditLog(e) {
  const [r] = await pool.query(
    `INSERT INTO audit_logs (actor_role, actor_name, action, target_type, target_id, target_title, details)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [e.actor_role, e.actor_name, e.action, e.target_type, String(e.target_id), e.target_title || null, e.details || null]
  );
  return r.insertId;
}

async function getAuditLog(id) {
  const [rows] = await pool.query(
    `SELECT id, actor_role, actor_name, action, target_type, target_id, target_title, details, created_at
       FROM audit_logs WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

/* ================= SISWA (lengkapi adapter) ================= */

const STUDENT_DETAIL_SELECT = `
  SELECT u.id,
         COALESCE(p.full_name, u.email) AS name,
         u.email,
         p.phone_number AS phone,
         '' AS grade,
         p.university AS school,
         (SELECT CONCAT(pp.program_name, ' - ', pp.university)
            FROM user_targets t JOIN ptn_programs pp ON pp.id = t.program_id
           WHERE t.user_id = u.id ORDER BY t.id ASC LIMIT 1) AS target_major,
         (SELECT pp.university
            FROM user_targets t JOIN ptn_programs pp ON pp.id = t.program_id
           WHERE t.user_id = u.id ORDER BY t.id ASC LIMIT 1) AS target_campus,
         u.status,
         u.is_premium,
         u.created_at AS joined_at,
         (SELECT COUNT(*) FROM tryout_attempts a WHERE a.user_id = u.id) AS tryout_count,
         (SELECT ROUND(AVG(a.score), 2) FROM tryout_attempts a WHERE a.user_id = u.id) AS avg_score,
         ms.mentor_id AS assigned_mentor_id,
         mm.name AS assigned_mentor_name,
         NULL AS last_active,
         NULL AS notes
    FROM users u
    LEFT JOIN user_profiles p ON p.user_id = u.id
    LEFT JOIN mentor_students ms ON ms.student_id = u.id
    LEFT JOIN mentors mm ON mm.id = ms.mentor_id`;

async function getStudentDetail(id) {
  const [rows] = await pool.query(`${STUDENT_DETAIL_SELECT} WHERE u.id = ? AND u.role = 'student'`, [id]);
  return rows[0] || null;
}

async function findStudentByEmail(email) {
  const [[row]] = await pool.query("SELECT id FROM users WHERE email = ? AND role = 'student'", [email]);
  return row || null;
}

// Buat akun siswa (dipakai admin). Transaksi: kalau profil gagal, akun ikut batal.
async function createStudent({ email, passwordHash, fullName, university, major, phoneNumber }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [u] = await conn.query(
      "INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, 'student', 'active')",
      [email, passwordHash]
    );
    const userId = u.insertId;
    await conn.query(
      `INSERT INTO user_profiles (user_id, full_name, university, major, phone_number)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, fullName, university || null, major || null, phoneNumber || null]
    );
    await conn.commit();
    return userId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateStudent(id, d) {
  const cols = [];
  const vals = [];
  if (d.full_name !== undefined) { cols.push('full_name'); vals.push(d.full_name); }
  if (d.university !== undefined) { cols.push('university'); vals.push(d.university); }
  if (d.major !== undefined) { cols.push('major'); vals.push(d.major); }
  if (d.phone_number !== undefined) { cols.push('phone_number'); vals.push(d.phone_number); }
  if (d.date_of_birth !== undefined) { cols.push('date_of_birth'); vals.push(d.date_of_birth); }
  if (cols.length) {
    const [r] = await pool.query(
      `UPDATE user_profiles SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE user_id = ?`,
      [...vals, id]
    );
    if (r.affectedRows === 0) {
      // 0 baris bisa berarti "nilainya sama" atau "belum ada baris profil".
      // Cek dulu: hanya INSERT kalau baris profil memang belum ada.
      const [[exists]] = await pool.query('SELECT user_id FROM user_profiles WHERE user_id = ?', [id]);
      if (!exists) {
        const all = { full_name: '', university: null, major: null, phone_number: null, date_of_birth: null, ...d };
        await pool.query(
          `INSERT INTO user_profiles (user_id, full_name, university, major, phone_number, date_of_birth)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, all.full_name, all.university ?? null, all.major ?? null, all.phone_number ?? null, all.date_of_birth ?? null]
        );
      }
    }
  }
  if (d.status !== undefined) {
    const [r2] = await pool.query("UPDATE users SET status = ? WHERE id = ? AND role = 'student'", [d.status, id]);
    if (!r2.affectedRows) return 0;
  }
  return 1;
}

async function deleteStudent(id) {
  // Semua data ikutannya (profil, attempt, langganan, target) ikut terhapus oleh ON DELETE CASCADE.
  const [r] = await pool.query("DELETE FROM users WHERE id = ? AND role = 'student'", [id]);
  return r.affectedRows;
}

module.exports = {
  mentorExists, studentExists, tryoutExists,
  listStudentsByMentor, assignStudent, unassignStudent,
  MENTOR_FULL_SELECT, parsePermissions, getMentorFull,
  setMentorPermissions, setMentorStatus, updateMentorProfile, updateMentorPhone, deleteMentor,
  QUESTION_SORT, listQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion, setQuestionStatus,
  getTryoutDetail, setTryoutStatus, requestWithdrawal,
  listSubtests, getSubtest, createSubtest, updateSubtest, deleteSubtest,
  SCHEDULE_SORT, listSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule, findConflicts,
  getAllSettings, setSettings,
  AUDIT_SORT, listAuditLogs, createAuditLog, getAuditLog,
  getStudentDetail, findStudentByEmail, createStudent, updateStudent, deleteStudent,
};