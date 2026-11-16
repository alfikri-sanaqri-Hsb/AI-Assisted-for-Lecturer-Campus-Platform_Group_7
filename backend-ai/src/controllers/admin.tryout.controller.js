const model = require('../models/admin.tryout.model');

function badId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ success: false, message: 'ID tidak valid' });
    return null;
  }
  return id;
}

function validQuestion(q) {
  if (!q || !q.subject || !q.question_text || !q.option_a || !q.option_b
      || !q.option_c || !q.option_d) return 'subject, question_text, dan option_a sampai option_d wajib diisi';
  if (!['A', 'B', 'C', 'D'].includes(q.correct_option)) return 'correct_option harus A, B, C, atau D';
  return null;
}

async function listTryouts(req, res, next) {
  try {
    const data = await model.listTryouts();
    return res.json({ success: true, message: 'Daftar tryout', data });
  } catch (err) { next(err); }
}

async function createTryout(req, res, next) {
  try {
    const { title, duration_minutes } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title wajib diisi' });
    if (duration_minutes !== undefined && (!Number.isInteger(duration_minutes) || duration_minutes < 0)) {
      return res.status(400).json({ success: false, message: 'duration_minutes harus bilangan bulat >= 0' });
    }
    const id = await model.createTryout(req.body);
    return res.status(201).json({ success: true, message: 'Tryout dibuat', data: { id } });
  } catch (err) { next(err); }
}

async function updateTryout(req, res, next) {
  try {
    const id = badId(req, res);
    if (id === null) return;
    const changed = await model.updateTryout(id, req.body);
    if (!changed) return res.status(404).json({ success: false, message: 'Tryout tidak ditemukan' });
    return res.json({ success: true, message: 'Tryout diperbarui', data: { id } });
  } catch (err) { next(err); }
}

async function deleteTryout(req, res, next) {
  try {
    const id = badId(req, res);
    if (id === null) return;
    const changed = await model.deleteTryout(id);
    if (!changed) return res.status(404).json({ success: false, message: 'Tryout tidak ditemukan' });
    return res.json({ success: true, message: 'Tryout dihapus', data: { id } });
  } catch (err) { next(err); }
}

async function listQuestions(req, res, next) {
  try {
    const id = badId(req, res);
    if (id === null) return;
    const data = await model.listQuestions(id);
    return res.json({ success: true, message: 'Soal tryout', data });
  } catch (err) { next(err); }
}

async function createQuestion(req, res, next) {
  try {
    const id = badId(req, res);
    if (id === null) return;
    const errMsg = validQuestion(req.body);
    if (errMsg) return res.status(400).json({ success: false, message: errMsg });
    const qid = await model.createQuestion(id, req.body);
    return res.status(201).json({ success: true, message: 'Soal ditambahkan', data: { id: qid } });
  } catch (err) { next(err); }
}

async function updateQuestion(req, res, next) {
  try {
    const id = badId(req, res);
    if (id === null) return;
    const errMsg = validQuestion(req.body);
    if (errMsg) return res.status(400).json({ success: false, message: errMsg });
    const changed = await model.updateQuestion(id, req.body);
    if (!changed) return res.status(404).json({ success: false, message: 'Soal tidak ditemukan' });
    return res.json({ success: true, message: 'Soal diperbarui', data: { id } });
  } catch (err) { next(err); }
}

async function deleteQuestion(req, res, next) {
  try {
    const id = badId(req, res);
    if (id === null) return;
    const changed = await model.deleteQuestion(id);
    if (!changed) return res.status(404).json({ success: false, message: 'Soal tidak ditemukan' });
    return res.json({ success: true, message: 'Soal dihapus', data: { id } });
  } catch (err) { next(err); }
}

module.exports = {
  listTryouts, createTryout, updateTryout, deleteTryout,
  listQuestions, createQuestion, updateQuestion, deleteQuestion,
};
