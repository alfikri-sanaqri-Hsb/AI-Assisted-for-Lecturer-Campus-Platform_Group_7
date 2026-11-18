/** ADMIN: mentor (termasuk link grup chat), sesi live Zoom/Meet, status akun siswa, pesanan langganan */
const adminModel = require('../models/admin.model');
const mentorModel = require('../models/admin.mentor.model');
const handler = require('../utils/handler');
const v = require('../utils/validators');
const { parseListQuery, buildMeta } = require('../utils/listQuery');
const { parseMentorBody, parseSessionBody } = require('../utils/contentInput');

const notFound = (what) => v.bad(`${what} tidak ditemukan`, 404);

/* ---------- MENTOR ---------- */

async function checkAccount(d) {
  if (d.user_id !== null && !(await mentorModel.isMentorAccount(d.user_id))) {
    throw v.bad('user_id harus akun yang sudah ber-role mentor');
  }
}

const getMentor = handler(async (req, res) => {
  const m = await mentorModel.getMentor(v.id(req.params.id));
  if (!m) throw notFound('Mentor');
  res.json({ success: true, message: 'Detail mentor', data: m });
});

const createMentor = handler(async (req, res) => {
  const d = parseMentorBody(req.body);
  await checkAccount(d);
  const id = await mentorModel.createMentor(d);
  res.status(201).json({ success: true, message: 'Mentor dibuat', data: { id } });
});

const updateMentor = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const d = parseMentorBody(req.body);
  await checkAccount(d);
  if (!(await mentorModel.updateMentor(id, d))) throw notFound('Mentor');
  res.json({ success: true, message: 'Mentor diperbarui', data: { id } });
});

// PUT /api/admin/mentors/:id/active   body: { "is_active": false }
const setMentorActive = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const isActive = v.bool(req.body.is_active, 'is_active', null);
  if (isActive === null) throw v.bad('is_active wajib diisi');
  if (!(await mentorModel.setMentorActive(id, isActive))) throw notFound('Mentor');
  res.json({ success: true, message: isActive ? 'Mentor diaktifkan' : 'Mentor dinonaktifkan', data: { id, is_active: isActive } });
});

/* ---------- SESI LIVE (link Zoom/Meet) ---------- */

const listSessions = handler(async (req, res) => {
  const f = parseListQuery(req.query, mentorModel.SESSION_SORT, { urut: 'mulai', arah: 'desc' });
  const filter = {
    mentorId: req.query.mentor_id === undefined ? undefined : v.id(req.query.mentor_id, 'mentor_id'),
    upcoming: req.query.akan_datang === undefined ? undefined : v.bool(req.query.akan_datang, 'akan_datang'),
  };
  const { rows, total } = await mentorModel.listSessions(f, filter);
  res.json({ success: true, message: 'Daftar sesi live mentor', data: rows, meta: buildMeta(f, total) });
});

async function requireMentor(id) {
  if (!(await mentorModel.getMentor(id))) throw v.bad('mentor_id tidak ditemukan');
}

const createSession = handler(async (req, res) => {
  const d = parseSessionBody(req.body);
  await requireMentor(d.mentor_id);
  const id = await mentorModel.createSession(d);
  res.status(201).json({ success: true, message: 'Sesi live dibuat', data: { id } });
});

const updateSession = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const d = parseSessionBody(req.body);
  await requireMentor(d.mentor_id);
  if (!(await mentorModel.updateSession(id, d))) throw notFound('Sesi');
  res.json({ success: true, message: 'Sesi live diperbarui', data: { id } });
});

const deleteSession = handler(async (req, res) => {
  const id = v.id(req.params.id);
  if (!(await mentorModel.deleteSession(id))) throw notFound('Sesi');
  res.json({ success: true, message: 'Sesi live dihapus', data: { id } });
});

/* ---------- SISWA & PEMBAYARAN ---------- */

// PUT /api/admin/students/:id/status   body: { "status": "active" | "inactive" }
const setStudentStatus = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const status = v.oneOf(req.body.status, 'status', ['active', 'inactive'], { required: true });
  if (!(await adminModel.setStudentStatus(id, status))) throw notFound('Siswa');
  res.json({ success: true, message: status === 'active' ? 'Akun siswa diaktifkan' : 'Akun siswa dinonaktifkan', data: { id, status } });
});

// GET /api/admin/orders?status=paid&cari=&halaman=
const listOrders = handler(async (req, res) => {
  const f = parseListQuery(req.query, adminModel.ORDER_SORT);
  const status = v.oneOf(req.query.status, 'status', ['pending', 'paid', 'failed']);
  const { rows, total, summary } = await adminModel.listOrders(f, status);
  res.json({ success: true, message: 'Daftar pesanan langganan', data: rows, meta: { ...buildMeta(f, total), ...summary } });
});

module.exports = {
  getMentor, createMentor, updateMentor, setMentorActive,
  listSessions, createSession, updateSession, deleteSession,
  setStudentStatus, listOrders,
};
