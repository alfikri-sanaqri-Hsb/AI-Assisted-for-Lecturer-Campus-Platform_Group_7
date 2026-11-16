const adminModel = require('../models/admin.model');
const { parseListQuery, buildMeta } = require('../utils/listQuery');

async function getDashboard(req, res, next) {
  try {
    const data = await adminModel.getDashboardSummary();
    return res.json({ success: true, message: 'Ringkasan dashboard admin', data });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/students?cari=&urut=nama&arah=asc&halaman=1&per_halaman=10
async function listStudents(req, res, next) {
  try {
    const filter = parseListQuery(req.query, adminModel.STUDENT_SORT);
    const { rows, total } = await adminModel.listStudents(filter);
    return res.json({ success: true, message: 'Daftar siswa', data: rows, meta: buildMeta(filter, total) });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/mentors?cari=&urut=nama&arah=asc&halaman=1&per_halaman=10
async function listMentors(req, res, next) {
  try {
    const filter = parseListQuery(req.query, adminModel.MENTOR_SORT);
    const { rows, total } = await adminModel.listMentors(filter);
    return res.json({ success: true, message: 'Daftar mentor', data: rows, meta: buildMeta(filter, total) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard, listStudents, listMentors };
