/** ADMIN WEB (fix8): semua endpoint baru untuk dashboard web Ryan.
    Polanya sama seperti controller admin lain: bungkus handler, validator v.*,
    amplop { success, message, data } + meta untuk daftar. */
const model = require('../models/admin.web.model');
const contentModel = require('../models/admin.content.model');
const { applyAction } = require('./admin.content.controller');
const handler = require('../utils/handler');
const v = require('../utils/validators');
const { parseListQuery, buildMeta } = require('../utils/listQuery');
const { logAdminAction } = require('../utils/auditLog');
const { hashPassword } = require('../utils/password');
const pool = require('../config/database');

const notFound = (what) => v.bad(`${what} tidak ditemukan`, 404);

// Terima status dari web (UPPERCASE: DRAFT/SUBMITTED/...) maupun dari backend
// (lowercase: draft/review/...). Kembalikan nilai lowercase yang disimpan di DB.
const WEB_STATUS_MAP = {
  DRAFT: 'draft', SUBMITTED: 'review', APPROVED: 'approved',
  REJECTED: 'rejected', PUBLISHED: 'published', DEACTIVATED: 'draft',
};
function normalizeStatus(raw, allowed) {
  if (raw === undefined || raw === null || String(raw).trim() === '') throw v.bad('status wajib diisi');
  const s = String(raw).trim();
  const lower = WEB_STATUS_MAP[s.toUpperCase()] || s.toLowerCase();
  if (!allowed.includes(lower)) throw v.bad(`status harus salah satu dari: ${allowed.join(', ')}`);
  return lower;
}

// Bentuk baris soal dari DB jadi bentuk yang dimengerti web:
// option_a..e dirangkai jadi array options, plus field camelCase pendamping.
function toQuestionRow(q) {
  if (!q) return null;
  const options = [
    { key: 'A', text: q.option_a },
    { key: 'B', text: q.option_b },
    { key: 'C', text: q.option_c },
    { key: 'D', text: q.option_d },
  ];
  if (q.option_e !== null && q.option_e !== undefined && q.option_e !== '') {
    options.push({ key: 'E', text: q.option_e });
  }
  return { ...q, options, correct_answer: q.correct_option, question_text: q.question_text, history: [] };
}

function toScheduleRow(s) {
  if (!s) return null;
  let studentIds = s.student_ids;
  if (typeof studentIds === 'string') {
    try { studentIds = JSON.parse(studentIds); } catch { studentIds = []; }
  }
  if (!Array.isArray(studentIds)) studentIds = [];
  return { ...s, student_ids: studentIds, student_names: s.student_names || [] };
}

// Lengkapi student_names untuk beberapa baris jadwal sekaligus (1 query tambahan).
async function attachStudentNames(rows) {
  const ids = [...new Set(rows.flatMap((r) => toScheduleRow(r).student_ids))];
  if (!ids.length) return rows.map(toScheduleRow);
  const [users] = await pool.query(
    `SELECT u.id, COALESCE(p.full_name, u.email) AS name
       FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.id IN (${ids.map(() => '?').join(',')})`,
    ids
  );
  const byId = {};
  for (const u of users) byId[u.id] = u.name;
  return rows.map((r) => {
    const row = toScheduleRow(r);
    row.student_names = row.student_ids.map((id) => byId[id]).filter(Boolean);
    return row;
  });
}

function ratingValue(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 5) throw v.bad('rating harus angka 0 sampai 5');
  return Math.round(n * 100) / 100;
}

/* ================= 1. PENUGASAN MENTOR -> SISWA ================= */

// GET /api/admin/mentors/:id/students?halaman=&per_halaman=&cari=
const listMentorStudents = handler(async (req, res) => {
  const mentorId = v.id(req.params.id, 'mentor_id');
  if (!(await model.mentorExists(mentorId))) throw notFound('Mentor');
  const f = parseListQuery(req.query, { terbaru: 'u.id', nama: 'name' });
  const { rows, total } = await model.listStudentsByMentor(mentorId, f);
  res.json({ success: true, message: 'Daftar siswa binaan', data: rows, meta: buildMeta(f, total) });
});

// POST /api/admin/mentors/:id/students   body: { "student_id": 3 }
const assignStudent = handler(async (req, res) => {
  const mentorId = v.id(req.params.id, 'mentor_id');
  const studentId = v.int(req.body.student_id, 'student_id', { min: 1, required: true });
  if (!(await model.mentorExists(mentorId))) throw notFound('Mentor');
  if (!(await model.studentExists(studentId))) throw v.bad('student_id harus akun siswa yang ada');
  const id = await model.assignStudent(mentorId, studentId);
  await logAdminAction(req, 'Tugaskan siswa ke mentor', 'MENTOR', mentorId, null, `student_id=${studentId}`);
  res.status(201).json({ success: true, message: 'Siswa ditugaskan ke mentor', data: { id, mentor_id: mentorId, student_id: studentId } });
});

// DELETE /api/admin/mentors/:id/students/:studentId
const unassignStudent = handler(async (req, res) => {
  const mentorId = v.id(req.params.id, 'mentor_id');
  const studentId = v.id(req.params.studentId, 'student_id');
  if (!(await model.unassignStudent(mentorId, studentId))) throw notFound('Penugasan');
  await logAdminAction(req, 'Lepas siswa dari mentor', 'MENTOR', mentorId, null, `student_id=${studentId}`);
  res.json({ success: true, message: 'Siswa dilepas dari mentor', data: { mentor_id: mentorId, student_id: studentId } });
});

/* ================= 2. MENTOR: izin, status, rating, profil ================= */

// PATCH /api/admin/mentors/:id/permissions
// body: { canCreateMaterials, canCreateQuestions, canCreateTryouts, canDirectPublish }
// (boleh juga dibungkus: { "permissions": { ...4 field... } })
const updateMentorPermissions = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const src = req.body.permissions !== undefined ? req.body.permissions : req.body;
  const current = await model.getMentorFull(id);
  if (!current) throw notFound('Mentor');
  const next = {
    canCreateMaterials: src.canCreateMaterials !== undefined
      ? v.bool(src.canCreateMaterials, 'canCreateMaterials') : current.permissions.canCreateMaterials,
    canCreateQuestions: src.canCreateQuestions !== undefined
      ? v.bool(src.canCreateQuestions, 'canCreateQuestions') : current.permissions.canCreateQuestions,
    canCreateTryouts: src.canCreateTryouts !== undefined
      ? v.bool(src.canCreateTryouts, 'canCreateTryouts') : current.permissions.canCreateTryouts,
    canDirectPublish: src.canDirectPublish !== undefined
      ? v.bool(src.canDirectPublish, 'canDirectPublish') : current.permissions.canDirectPublish,
  };
  // v.bool mengembalikan 1/0, nilai lama dari DB sudah boolean; samakan dulu ke boolean.
  const asBool = {
    canCreateMaterials: next.canCreateMaterials === 1 || next.canCreateMaterials === true,
    canCreateQuestions: next.canCreateQuestions === 1 || next.canCreateQuestions === true,
    canCreateTryouts: next.canCreateTryouts === 1 || next.canCreateTryouts === true,
    canDirectPublish: next.canDirectPublish === 1 || next.canDirectPublish === true,
  };
  await model.setMentorPermissions(id, asBool);
  const m = await model.getMentorFull(id);
  await logAdminAction(req, 'Ubah izin mentor', 'MENTOR', id, m.name);
  res.json({ success: true, message: 'Izin mentor diperbarui', data: m });
});

// PATCH /api/admin/mentors/:id/status   body: { "status": "Cuti", "rating": 4.5 }
const updateMentorStatus = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const status = v.oneOf(req.body.status, 'status',
    ['Aktif', 'Menunggu Verifikasi', 'Cuti', 'Nonaktif'], { required: true });
  const rating = ratingValue(req.body.rating);
  const isActive = status === 'Nonaktif' ? 0 : status === 'Aktif' ? 1 : undefined;
  if (!(await model.getMentorFull(id))) throw notFound('Mentor');
  await model.setMentorStatus(id, { status, rating, isActive });
  const m = await model.getMentorFull(id);
  await logAdminAction(req, `Ubah status mentor menjadi ${status}`, 'MENTOR', id, m.name);
  res.json({ success: true, message: `Status mentor diubah menjadi ${status}`, data: m });
});

// DELETE /api/admin/mentors/:id (sesi live + penugasan ikut terhapus via CASCADE)
const deleteMentor = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const m = await model.getMentorFull(id);
  if (!m) throw notFound('Mentor');
  await model.deleteMentor(id);
  await logAdminAction(req, 'Hapus mentor', 'MENTOR', id, m.name);
  res.json({ success: true, message: 'Mentor dihapus', data: { id } });
});

// GET /api/admin/mentors/:id/profile
const getMentorProfile = handler(async (req, res) => {
  const m = await model.getMentorFull(v.id(req.params.id));
  if (!m) throw notFound('Mentor');
  res.json({
    success: true, message: 'Profil mentor', data: toMentorProfile(m),
  });
});

// PUT /api/admin/mentors/:id/profile
// body: { name?, title?, subject?, bio?, availability_notes?, phone?, rating? }
// title -> major, subject -> subjects (kolom yang memang ada di tabel mentors).
const updateMentorProfile = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const m = await model.getMentorFull(id);
  if (!m) throw notFound('Mentor');
  const d = {
    name: req.body.name !== undefined ? v.str(req.body.name, 'name', { max: 100 }) : undefined,
    major: req.body.title !== undefined ? v.str(req.body.title, 'title', { max: 100 }) : undefined,
    subjects: req.body.subject !== undefined ? v.str(req.body.subject, 'subject', { max: 255 }) : undefined,
    bio: req.body.bio !== undefined ? v.str(req.body.bio, 'bio', { max: 5000 }) : undefined,
    availability_notes: req.body.availability_notes !== undefined
      ? v.str(req.body.availability_notes, 'availability_notes', { max: 5000 }) : undefined,
    rating: ratingValue(req.body.rating),
  };
  await model.updateMentorProfile(id, d);
  if (req.body.phone !== undefined) {
    await model.updateMentorPhone(m.user_id, v.str(req.body.phone, 'phone', { max: 20 }));
  }
  const updated = await model.getMentorFull(id);
  res.json({ success: true, message: 'Profil mentor diperbarui', data: toMentorProfile(updated) });
});

function toMentorProfile(m) {
  return {
    id: m.id,
    name: m.name,
    email: m.mentor_email || '',
    phone: m.mentor_phone || '',
    title: m.major || '',
    subject: m.subjects || '',
    bio: m.bio || '',
    availability_notes: m.availability_notes || '',
    rating: Number(m.rating) || 0,
    total_students_assisted: Number(m.assigned_students_count) || 0,
  };
}

/* ================= SISWA (lengkapi adapter) ================= */

// GET /api/admin/students/:id
const getStudentDetail = handler(async (req, res) => {
  const s = await model.getStudentDetail(v.id(req.params.id));
  if (!s) throw notFound('Siswa');
  res.json({ success: true, message: 'Detail siswa', data: s });
});

// POST /api/admin/students
// body: { email, full_name, password? (min 8; kalau kosong dibuatkan 'Siswa123'), university?, major?, phone_number? }
const createStudent = handler(async (req, res) => {
  const email = v.str(req.body.email, 'email', { max: 255, required: true });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw v.bad('Format email tidak valid');
  const fullName = v.str(req.body.full_name, 'full_name', { max: 255, required: true });
  const password = req.body.password === undefined || req.body.password === ''
    ? 'Siswa123' : String(req.body.password);
  if (password.length < 8) throw v.bad('password minimal 8 karakter');
  if (await model.findStudentByEmail(email)) throw v.bad('Email sudah terdaftar', 409);
  const passwordHash = await hashPassword(password);
  const id = await model.createStudent({
    email,
    passwordHash,
    fullName,
    university: v.str(req.body.university, 'university', { max: 150 }),
    major: v.str(req.body.major, 'major', { max: 100 }),
    phoneNumber: v.str(req.body.phone_number, 'phone_number', { max: 20 }),
  });
  const s = await model.getStudentDetail(id);
  await logAdminAction(req, 'Buat akun siswa', 'STUDENT', id, fullName);
  const data = { ...s };
  if (req.body.password === undefined || req.body.password === '') data.temp_password = 'Siswa123';
  res.status(201).json({ success: true, message: 'Siswa dibuat', data });
});

// PUT /api/admin/students/:id
// body: { full_name?, university?, major?, phone_number?, date_of_birth?, status? (active/inactive) }
const updateStudent = handler(async (req, res) => {
  const id = v.id(req.params.id);
  if (!(await model.getStudentDetail(id))) throw notFound('Siswa');
  const d = {
    full_name: req.body.full_name !== undefined ? v.str(req.body.full_name, 'full_name', { max: 255 }) : undefined,
    university: req.body.university !== undefined ? v.str(req.body.university, 'university', { max: 150 }) : undefined,
    major: req.body.major !== undefined ? v.str(req.body.major, 'major', { max: 100 }) : undefined,
    phone_number: req.body.phone_number !== undefined ? v.str(req.body.phone_number, 'phone_number', { max: 20 }) : undefined,
    date_of_birth: undefined,
    status: req.body.status !== undefined
      ? v.oneOf(req.body.status, 'status', ['active', 'inactive']) : undefined,
  };
  if (req.body.date_of_birth !== undefined && req.body.date_of_birth !== null && req.body.date_of_birth !== '') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(req.body.date_of_birth))) {
      throw v.bad('date_of_birth harus YYYY-MM-DD');
    }
    d.date_of_birth = String(req.body.date_of_birth);
  }
  await model.updateStudent(id, d);
  const s = await model.getStudentDetail(id);
  await logAdminAction(req, 'Ubah data siswa', 'STUDENT', id, s.name);
  res.json({ success: true, message: 'Siswa diperbarui', data: s });
});

// DELETE /api/admin/students/:id (data ikutannya ikut terhapus via ON DELETE CASCADE)
const deleteStudent = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const s = await model.getStudentDetail(id);
  if (!s) throw notFound('Siswa');
  await model.deleteStudent(id);
  await logAdminAction(req, 'Hapus siswa', 'STUDENT', id, s.name);
  res.json({ success: true, message: 'Siswa dihapus', data: { id } });
});

/* ================= 3. BANK SOAL MANDIRI ================= */

// Body soal diterima dua bentuk (dipakai adapter web maupun Postman):
//  - bentuk web: { questionText, options: [{key:'A',text},...], correctAnswer, difficulty, explanation, ... }
//  - bentuk backend: { question_text, option_a..option_e, correct_option, ... }
// Aturan lama TETAP: option_a-d wajib. Baru di sini: boleh correct = E (wajib ada option_e).
function parseQuestionBody(body = {}) {
  const options = body.options;
  let a; let b; let c; let d; let e;
  if (Array.isArray(options)) {
    const byKey = {};
    for (const o of options) {
      if (o && o.key) byKey[String(o.key).toUpperCase()] = o.text;
    }
    a = byKey.A; b = byKey.B; c = byKey.C; d = byKey.D; e = byKey.E;
  } else {
    a = body.option_a; b = body.option_b; c = body.option_c; d = body.option_d; e = body.option_e;
  }
  const q = {
    tryout_id: (body.tryout_id === undefined || body.tryout_id === null || body.tryout_id === '')
      ? null : v.int(body.tryout_id, 'tryout_id', { min: 1 }),
    subject: v.str(body.subject || body.topic || body.subtest, 'subject', { max: 100, required: true }),
    question_text: v.str(body.question_text || body.questionText, 'question_text', { max: 5000, required: true }),
    option_a: v.str(a, 'option_a', { max: 5000, required: true }),
    option_b: v.str(b, 'option_b', { max: 5000, required: true }),
    option_c: v.str(c, 'option_c', { max: 5000, required: true }),
    option_d: v.str(d, 'option_d', { max: 5000, required: true }),
    option_e: v.str(e, 'option_e', { max: 5000 }),
    correct_option: v.oneOf(
      String(body.correct_option || body.correctAnswer || '').toUpperCase(),
      'correct_option', ['A', 'B', 'C', 'D', 'E'], { required: true }
    ),
    difficulty: v.oneOf(
      String(body.difficulty || 'sedang').toLowerCase(),
      'difficulty', ['mudah', 'sedang', 'sulit']
    ) || 'sedang',
    explanation: v.str(body.explanation, 'explanation', { max: 5000 }),
    image_url: v.url(body.image_url || body.imageUrl, 'image_url'),
    sort_order: v.int(body.sort_order, 'sort_order', { min: 0, max: 100000 }),
  };
  if (q.correct_option === 'E' && !q.option_e) throw v.bad('option_e wajib diisi bila correct_option = E');
  return q;
}

// GET /api/admin/questions?status=&subject=&tryout_id=&author_id=&cari=&halaman=&per_halaman=
const listQuestions = handler(async (req, res) => {
  const f = parseListQuery(req.query, model.QUESTION_SORT);
  const filter = {
    status: req.query.status !== undefined
      ? normalizeStatus(req.query.status, ['draft', 'review', 'approved', 'published', 'rejected']) : undefined,
    subject: v.str(req.query.subject, 'subject', { max: 100 }) || undefined,
    tryoutId: req.query.tryout_id !== undefined ? v.int(req.query.tryout_id, 'tryout_id', { min: 1 }) : undefined,
    authorId: req.query.author_id !== undefined ? v.int(req.query.author_id, 'author_id', { min: 1 }) : undefined,
  };
  const { rows, total } = await model.listQuestions(f, filter);
  res.json({ success: true, message: 'Daftar soal', data: rows.map(toQuestionRow), meta: buildMeta(f, total) });
});

// GET /api/admin/questions/:id
const getQuestion = handler(async (req, res) => {
  const q = await model.getQuestion(v.id(req.params.id));
  if (!q) throw notFound('Soal');
  res.json({ success: true, message: 'Detail soal', data: toQuestionRow(q) });
});

// POST /api/admin/questions (status awal selalu 'draft')
const createQuestion = handler(async (req, res) => {
  const q = parseQuestionBody(req.body);
  if (q.tryout_id !== null && !(await model.tryoutExists(q.tryout_id))) {
    throw v.bad('tryout_id tidak ditemukan');
  }
  const id = await model.createQuestion(q, req.user.id);
  const row = await model.getQuestion(id);
  await logAdminAction(req, 'Buat soal bank soal', 'QUESTION', id, q.subject);
  res.status(201).json({ success: true, message: 'Soal dibuat', data: toQuestionRow(row) });
});

// PUT /api/admin/questions/:id (body lengkap, sama seperti POST)
const updateQuestion = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const q = parseQuestionBody(req.body);
  if (q.tryout_id !== null && !(await model.tryoutExists(q.tryout_id))) {
    throw v.bad('tryout_id tidak ditemukan');
  }
  if (!(await model.updateQuestion(id, q))) throw notFound('Soal');
  const row = await model.getQuestion(id);
  await logAdminAction(req, 'Ubah soal bank soal', 'QUESTION', id, q.subject);
  res.json({ success: true, message: 'Soal diperbarui', data: toQuestionRow(row) });
});

// DELETE /api/admin/questions/:id
const deleteQuestion = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const q = await model.getQuestion(id);
  if (!q) throw notFound('Soal');
  await model.deleteQuestion(id);
  await logAdminAction(req, 'Hapus soal bank soal', 'QUESTION', id, q.subject);
  res.json({ success: true, message: 'Soal dihapus', data: { id } });
});

// PATCH /api/admin/questions/:id/status   body: { "status": "approved" | "rejected" | ..., "reason": "..." }
// reason wajib bila status = rejected (disimpan sebagai review_note).
const setQuestionStatus = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const status = normalizeStatus(req.body.status, ['draft', 'review', 'approved', 'published', 'rejected']);
  const reason = v.str(req.body.reason, 'reason', { max: 5000 });
  if (status === 'rejected' && !reason) throw v.bad('reason wajib diisi saat menolak soal');
  if (!(await model.getQuestion(id))) throw notFound('Soal');
  await model.setQuestionStatus(id, status, reason);
  const row = await model.getQuestion(id);
  await logAdminAction(req, `Ubah status soal menjadi ${status}`, 'QUESTION', id, row.subject, reason);
  res.json({ success: true, message: `Status soal diubah menjadi ${status}`, data: toQuestionRow(row) });
});

/* ================= 4. PAKET TRYOUT: status + subtes ================= */

// GET /api/admin/tryouts/:id (detail + subtests + question_ids; tidak ada di endpoint lama)
const getTryoutDetail = handler(async (req, res) => {
  const t = await model.getTryoutDetail(v.id(req.params.id));
  if (!t) throw notFound('Tryout');
  res.json({ success: true, message: 'Detail tryout', data: t });
});

// PATCH /api/admin/tryouts/:id/status   body: { "status": "approved" | "published" | ..., "reason": "..." }
// status='published' otomatis membuat is_published=1; status lain membuat is_published=0.
// reason wajib bila status = rejected.
const setTryoutStatus = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const status = normalizeStatus(req.body.status, ['draft', 'review', 'approved', 'published', 'rejected']);
  const reason = v.str(req.body.reason, 'reason', { max: 5000 });
  if (status === 'rejected' && !reason) throw v.bad('reason wajib diisi saat menolak tryout');
  if (!(await model.getTryoutDetail(id))) throw notFound('Tryout');
  await model.setTryoutStatus(id, status, reason);
  const t = await model.getTryoutDetail(id);
  await logAdminAction(req, `Ubah status tryout menjadi ${status}`, 'TRYOUT', id, t.title, reason);
  res.json({ success: true, message: `Status tryout diubah menjadi ${status}`, data: t });
});

// POST /api/admin/tryouts/:id/request-withdrawal   body: { "reason": "..." }
const requestWithdrawal = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const reason = v.str(req.body.reason, 'reason', { max: 5000, required: true });
  if (!(await model.getTryoutDetail(id))) throw notFound('Tryout');
  await model.requestWithdrawal(id, reason);
  const t = await model.getTryoutDetail(id);
  await logAdminAction(req, 'Minta penarikan tryout', 'TRYOUT', id, t.title, reason);
  res.json({ success: true, message: 'Permintaan penarikan dicatat', data: t });
});

/* ---------- SUBTES ---------- */

function parseSubtestBody(body = {}) {
  return {
    name: v.str(body.name, 'name', { max: 100, required: true }),
    question_count: v.int(body.question_count, 'question_count', { min: 0, max: 10000 }),
    duration_minutes: v.int(body.duration_minutes, 'duration_minutes', { min: 0, max: 10000 }),
    sort_order: v.int(body.sort_order, 'sort_order', { min: 0, max: 100000 }),
  };
}

// GET /api/admin/tryouts/:id/subtests
const listSubtests = handler(async (req, res) => {
  const id = v.id(req.params.id);
  if (!(await model.getTryoutDetail(id))) throw notFound('Tryout');
  const rows = await model.listSubtests(id);
  res.json({ success: true, message: 'Daftar subtes', data: rows });
});

// POST /api/admin/tryouts/:id/subtests
const createSubtest = handler(async (req, res) => {
  const id = v.id(req.params.id);
  if (!(await model.getTryoutDetail(id))) throw notFound('Tryout');
  const subId = await model.createSubtest(id, parseSubtestBody(req.body));
  const row = await model.getSubtest(subId);
  res.status(201).json({ success: true, message: 'Subtes dibuat', data: row });
});

// PUT /api/admin/tryouts/:id/subtests/:subtestId
const updateSubtest = handler(async (req, res) => {
  const tryoutId = v.id(req.params.id);
  const subId = v.id(req.params.subtestId, 'subtest_id');
  const sub = await model.getSubtest(subId);
  if (!sub || sub.tryout_id !== tryoutId) throw notFound('Subtes');
  await model.updateSubtest(subId, parseSubtestBody(req.body));
  const row = await model.getSubtest(subId);
  res.json({ success: true, message: 'Subtes diperbarui', data: row });
});

// DELETE /api/admin/tryouts/:id/subtests/:subtestId
const deleteSubtest = handler(async (req, res) => {
  const tryoutId = v.id(req.params.id);
  const subId = v.id(req.params.subtestId, 'subtest_id');
  const sub = await model.getSubtest(subId);
  if (!sub || sub.tryout_id !== tryoutId) throw notFound('Subtes');
  await model.deleteSubtest(subId);
  res.json({ success: true, message: 'Subtes dihapus', data: { id: subId } });
});

/* ================= 5. JADWAL ================= */

// Body jadwal diterima dua bentuk: snake_case backend dan camelCase web.
// date = YYYY-MM-DD, start_time/end_time = HH:MM. type web diterjemahkan:
// 'tryout' -> 'Simulasi Tryout', 'live_mentoring' -> 'Sesi Mentoring'.
const SCHEDULE_TYPES = ['Sesi Mentoring', 'Kelas Akademik', 'Briefing Mentor', 'Simulasi Tryout'];
const SCHEDULE_STATUSES = ['Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan'];

function parseScheduleBody(body = {}) {
  const date = v.str(body.date, 'date', { max: 10, required: true });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw v.bad('date harus YYYY-MM-DD');
  const startTime = v.str(body.start_time || body.startTime, 'start_time', { max: 5, required: true });
  const endTime = v.str(body.end_time || body.endTime, 'end_time', { max: 5, required: true });
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
    throw v.bad('start_time dan end_time harus HH:MM');
  }
  const startsAt = v.dateTime(`${date} ${startTime}`);
  const endsAt = v.dateTime(`${date} ${endTime}`);
  if (endsAt <= startsAt) throw v.bad('end_time harus setelah start_time');
  const typeRaw = String(body.type || 'Sesi Mentoring');
  const typeMap = { tryout: 'Simulasi Tryout', live_mentoring: 'Sesi Mentoring' };
  const type = typeMap[typeRaw] || v.oneOf(typeRaw, 'type', SCHEDULE_TYPES);
  let studentIds = body.student_ids !== undefined ? body.student_ids : body.studentIds;
  if (studentIds === undefined || studentIds === null) studentIds = [];
  if (!Array.isArray(studentIds)) throw v.bad('student_ids harus array berisi id siswa');
  for (const sid of studentIds) {
    if (!Number.isInteger(sid) || sid <= 0) throw v.bad('student_ids harus array berisi id siswa');
  }
  return {
    type,
    title: v.str(body.title, 'title', { max: 150, required: true }),
    starts_at: startsAt,
    ends_at: endsAt,
    mentor_id: (body.mentor_id === undefined && body.mentorId === undefined) ? null
      : v.int(body.mentor_id !== undefined ? body.mentor_id : body.mentorId, 'mentor_id', { min: 1 }),
    platform: v.oneOf(body.platform, 'platform', ['Zoom', 'Google Meet', 'Aplikasi Internal']) || 'Zoom',
    meet_url: v.url(body.meet_url || body.meetUrl, 'meet_url'),
    status: v.oneOf(body.status, 'status', SCHEDULE_STATUSES) || 'Terjadwal',
    student_ids: studentIds,
    notes: v.str(body.notes, 'notes', { max: 5000 }),
  };
}

// GET /api/admin/schedules?mentor_id=&status=&type=&date=&cari=&halaman=&per_halaman=
const listSchedules = handler(async (req, res) => {
  const f = parseListQuery(req.query, model.SCHEDULE_SORT, { urut: 'mulai', arah: 'asc' });
  const filter = {
    mentorId: req.query.mentor_id !== undefined ? v.int(req.query.mentor_id, 'mentor_id', { min: 1 }) : undefined,
    status: req.query.status !== undefined ? v.oneOf(req.query.status, 'status', SCHEDULE_STATUSES) : undefined,
    type: req.query.type !== undefined ? v.str(req.query.type, 'type', { max: 50 }) : undefined,
    date: undefined,
  };
  if (req.query.date !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(req.query.date))) throw v.bad('date harus YYYY-MM-DD');
    filter.date = String(req.query.date);
  }
  const { rows, total } = await model.listSchedules(f, filter);
  const data = await attachStudentNames(rows);
  res.json({ success: true, message: 'Daftar jadwal', data, meta: buildMeta(f, total) });
});

// GET /api/admin/schedules/:id
const getSchedule = handler(async (req, res) => {
  const row = await model.getSchedule(v.id(req.params.id));
  if (!row) throw notFound('Jadwal');
  const [data] = await attachStudentNames([row]);
  res.json({ success: true, message: 'Detail jadwal', data });
});

// POST /api/admin/schedules
const createSchedule = handler(async (req, res) => {
  const d = parseScheduleBody(req.body);
  if (d.mentor_id !== null && !(await model.mentorExists(d.mentor_id))) throw v.bad('mentor_id tidak ditemukan');
  const id = await model.createSchedule(d);
  const row = await model.getSchedule(id);
  const [data] = await attachStudentNames([row]);
  await logAdminAction(req, 'Buat jadwal', 'SCHEDULE', id, d.title);
  res.status(201).json({ success: true, message: 'Jadwal dibuat', data });
});

// PUT /api/admin/schedules/:id (body lengkap, sama seperti POST)
const updateSchedule = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const d = parseScheduleBody(req.body);
  if (d.mentor_id !== null && !(await model.mentorExists(d.mentor_id))) throw v.bad('mentor_id tidak ditemukan');
  if (!(await model.updateSchedule(id, d))) throw notFound('Jadwal');
  const row = await model.getSchedule(id);
  const [data] = await attachStudentNames([row]);
  await logAdminAction(req, 'Ubah jadwal', 'SCHEDULE', id, d.title);
  res.json({ success: true, message: 'Jadwal diperbarui', data });
});

// DELETE /api/admin/schedules/:id
const deleteSchedule = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const row = await model.getSchedule(id);
  if (!row) throw notFound('Jadwal');
  await model.deleteSchedule(id);
  await logAdminAction(req, 'Hapus jadwal', 'SCHEDULE', id, row.title);
  res.json({ success: true, message: 'Jadwal dihapus', data: { id } });
});

// GET /api/admin/mentors/:id/schedules
const listSchedulesByMentor = handler(async (req, res) => {
  const mentorId = v.id(req.params.id, 'mentor_id');
  if (!(await model.mentorExists(mentorId))) throw notFound('Mentor');
  const f = parseListQuery(req.query, model.SCHEDULE_SORT, { urut: 'mulai', arah: 'asc' });
  const { rows, total } = await model.listSchedules(f, { mentorId });
  const data = await attachStudentNames(rows);
  res.json({ success: true, message: 'Daftar jadwal mentor', data, meta: buildMeta(f, total) });
});

// GET /api/admin/schedules/check-conflicts?date=&startTime=&endTime=&mentorId=&excludeId=
// (WAJIB didaftarkan SEBELUM /schedules/:id di routes — lihat Langkah 3.)
const checkConflicts = handler(async (req, res) => {
  const date = v.str(req.query.date, 'date', { max: 10, required: true });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw v.bad('date harus YYYY-MM-DD');
  const startTime = v.str(req.query.startTime, 'startTime', { max: 5, required: true });
  const endTime = v.str(req.query.endTime, 'endTime', { max: 5, required: true });
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
    throw v.bad('startTime dan endTime harus HH:MM');
  }
  const mentorId = v.int(req.query.mentorId, 'mentorId', { min: 1, required: true });
  const excludeId = req.query.excludeId !== undefined
    ? v.int(req.query.excludeId, 'excludeId', { min: 1 }) : undefined;
  const start = `${date} ${startTime}:00`;
  const end = `${date} ${endTime}:00`;
  if (end <= start) throw v.bad('endTime harus setelah startTime');
  const rows = await model.findConflicts({ start, end, mentorId, excludeId });
  const data = await attachStudentNames(rows);
  res.json({ success: true, message: 'Cek bentrok jadwal', data });
});

/* ================= MATERI: status ala web ================= */

// PATCH /api/admin/materials/:id/status   body: { "status": "APPROVED" | "PUBLISHED" | ..., "reason": "..." }
// Memakai ulang alur yang sudah ada (submit/approve/reject/publish/unpublish) supaya
// tidak ada dua mesin status. DEACTIVATED dari web = tarik dari siswa (unpublish).
// 'draft' dari 'pending_review' = reject (wajib reason); dari 'approved' tidak ada jalurnya -> 409.
const setMaterialStatus = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const target = normalizeStatus(req.body.status, ['draft', 'review', 'approved', 'published', 'rejected']);
  const reason = v.str(req.body.reason, 'reason', { max: 5000 });
  const material = await contentModel.getMaterial(id);
  if (!material) throw notFound('Materi');
  const currentLower = material.status === 'pending_review' ? 'review' : material.status;
  if (currentLower === target) {
    return res.json({ success: true, message: 'Status materi tidak berubah', data: material });
  }
  let action;
  if (target === 'draft') {
    if (material.status === 'published') action = 'unpublish';
    else if (material.status === 'pending_review') {
      if (!reason) throw v.bad('reason wajib diisi saat mengembalikan materi ke draft');
      action = 'reject';
    } else {
      throw v.bad(`Materi berstatus "${material.status}" tidak bisa kembali ke draft`, 409);
    }
  } else if (target === 'review') action = 'submit';
  else if (target === 'approved') action = 'approve';
  else if (target === 'rejected') {
    if (!reason) throw v.bad('reason wajib diisi saat menolak materi');
    action = 'reject';
  } else if (target === 'published') action = 'publish';
  const updated = await applyAction(id, action, reason);
  await logAdminAction(req, `Ubah status materi menjadi ${target}`, 'MATERIAL', id, updated.title, reason);
  res.json({ success: true, message: `Status materi diubah menjadi ${target}`, data: updated });
});

/* ================= 6. PENGATURAN ADMIN ================= */

// Pengaturan disimpan key-value (snake_case di DB). GET mengembalikan objek lengkap
// dengan tipe benar (boolean/angka/string); yang belum pernah disimpan memakai default.
const SETTING_DEFS = [
  { key: 'platform_name', type: 'string', def: 'Sahabat AlFaRy' },
  { key: 'academic_year', type: 'string', def: '2026/2027' },
  { key: 'support_email', type: 'string', def: 'admin@sahabat-alfary.id' },
  { key: 'allow_student_registration', type: 'bool', def: true },
  { key: 'duplicate_similarity_threshold', type: 'number', def: 70 },
  { key: 'maintenance_mode', type: 'bool', def: false },
  { key: 'notify_on_content_submission', type: 'bool', def: true },
  { key: 'notify_on_schedule_conflict', type: 'bool', def: true },
];
const CAMEL_TO_KEY = {
  platformName: 'platform_name', academicYear: 'academic_year', supportEmail: 'support_email',
  allowStudentRegistration: 'allow_student_registration',
  duplicateSimilarityThreshold: 'duplicate_similarity_threshold',
  maintenanceMode: 'maintenance_mode',
  notifyOnContentSubmission: 'notify_on_content_submission',
  notifyOnScheduleConflict: 'notify_on_schedule_conflict',
};

function settingsObject(stored) {
  const out = {};
  for (const d of SETTING_DEFS) {
    const raw = stored[d.key];
    if (raw === undefined) { out[d.key] = d.def; continue; }
    if (d.type === 'bool') out[d.key] = raw === '1' || raw === 'true';
    else if (d.type === 'number') out[d.key] = Number(raw);
    else out[d.key] = raw;
  }
  return out;
}

// GET /api/admin/settings — JANGAN tertukar dengan GET /api/settings (pengaturan siswa).
const getSettings = handler(async (req, res) => {
  const stored = await model.getAllSettings();
  res.json({ success: true, message: 'Pengaturan admin', data: settingsObject(stored) });
});

// PUT /api/admin/settings — terima snake_case ATAU camelCase, sebagian boleh.
const updateSettings = handler(async (req, res) => {
  const pairs = [];
  for (const d of SETTING_DEFS) {
    const camelKey = Object.keys(CAMEL_TO_KEY).find((k) => CAMEL_TO_KEY[k] === d.key);
    const raw = req.body[d.key] !== undefined ? req.body[d.key]
      : (camelKey && req.body[camelKey] !== undefined ? req.body[camelKey] : undefined);
    if (raw === undefined) continue;
    if (d.type === 'bool') {
      pairs.push([d.key, v.bool(raw, d.key) ? '1' : '0']);
    } else if (d.type === 'number') {
      const n = v.int(raw, d.key, { min: 0, max: 100 });
      pairs.push([d.key, String(n)]);
    } else {
      pairs.push([d.key, v.str(raw, d.key, { max: 255 })]);
    }
  }
  if (!pairs.length) throw v.bad('Tidak ada pengaturan yang dikirim');
  await model.setSettings(pairs);
  const stored = await model.getAllSettings();
  await logAdminAction(req, 'Ubah pengaturan admin', 'SETTINGS', 'admin', 'Pengaturan admin');
  res.json({ success: true, message: 'Pengaturan admin diperbarui', data: settingsObject(stored) });
});

/* ================= 7. LOG AUDIT ================= */

// GET /api/admin/audit-logs?actor=ADMIN&target=TRYOUT&halaman=&per_halaman=
const listAuditLogs = handler(async (req, res) => {
  const f = parseListQuery(req.query, model.AUDIT_SORT);
  const filter = {
    actor: req.query.actor !== undefined
      ? v.oneOf(String(req.query.actor).toUpperCase(), 'actor', ['ADMIN', 'MENTOR']) : undefined,
    target: req.query.target !== undefined
      ? v.oneOf(String(req.query.target).toUpperCase(), 'target',
        ['STUDENT', 'MENTOR', 'MATERIAL', 'QUESTION', 'TRYOUT', 'SCHEDULE', 'SETTINGS']) : undefined,
  };
  const { rows, total } = await model.listAuditLogs(f, filter);
  res.json({ success: true, message: 'Daftar log audit', data: rows, meta: buildMeta(f, total) });
});

// POST /api/admin/audit-logs
// body: { action, target_type, target_id, target_title?, details?, actor_role?, actor_name? }
// actor diisi otomatis dari token admin bila tidak dikirim.
const createAuditLog = handler(async (req, res) => {
  const entry = {
    actor_role: (req.body.actor_role || req.body.actorRole || '')
      ? v.oneOf(String(req.body.actor_role || req.body.actorRole).toUpperCase(), 'actor_role', ['ADMIN', 'MENTOR'])
      : String((req.user && req.user.role) || 'admin').toUpperCase(),
    actor_name: v.str(req.body.actor_name || req.body.actorName, 'actor_name', { max: 255 })
      || (req.user && req.user.email) || 'Admin',
    action: v.str(req.body.action, 'action', { max: 100, required: true }),
    target_type: v.oneOf(
      String(req.body.target_type || req.body.targetType || '').toUpperCase(),
      'target_type', ['STUDENT', 'MENTOR', 'MATERIAL', 'QUESTION', 'TRYOUT', 'SCHEDULE', 'SETTINGS'],
      { required: true }
    ),
    target_id: v.str(req.body.target_id !== undefined ? req.body.target_id : req.body.targetId,
      'target_id', { max: 50, required: true }),
    target_title: v.str(req.body.target_title || req.body.targetTitle, 'target_title', { max: 255 }),
    details: v.str(req.body.details, 'details', { max: 5000 }),
  };
  const id = await model.createAuditLog(entry);
  const row = await model.getAuditLog(id);
  res.status(201).json({ success: true, message: 'Log audit dicatat', data: row });
});

module.exports = {
  listMentorStudents, assignStudent, unassignStudent,
  updateMentorPermissions, updateMentorStatus, deleteMentor, getMentorProfile, updateMentorProfile,
  getStudentDetail, createStudent, updateStudent, deleteStudent,
  listQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion, setQuestionStatus,
  getTryoutDetail, setTryoutStatus, requestWithdrawal,
  listSubtests, createSubtest, updateSubtest, deleteSubtest,
  listSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule,
  listSchedulesByMentor, checkConflicts,
  setMaterialStatus,
  getSettings, updateSettings,
  listAuditLogs, createAuditLog,
};