const pool = require('../config/database');
const practiceModel = require('../models/practice.model');
const { recordActivity } = require('../models/progress.model');
const { toWibDate } = require('../utils/streak');

const OPTIONS = ['A', 'B', 'C', 'D'];

// GET /api/practice/questions?subject=Penalaran Umum&limit=10
async function getQuestions(req, res, next) {
  try {
    const subject = req.query.subject ? String(req.query.subject).trim() : null;
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const data = await practiceModel.getPracticeQuestions(subject, limit);
    return res.json({ success: true, message: 'Soal latihan', data });
  } catch (err) {
    next(err);
  }
}

// POST /api/practice/submit
// Body: { "answers": [{ "question_id": 1, "selected_option": "B" }] }
async function submitPractice(req, res, next) {
  try {
    const userId = req.user.id;
    const answers = req.body.answers;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'answers wajib berupa array' });
    }

    const cleaned = answers
      .map((a) => ({
        question_id: Number(a.question_id),
        selected_option: a.selected_option ? String(a.selected_option).toUpperCase() : null,
      }))
      .filter(
        (a) =>
          Number.isInteger(a.question_id) &&
          a.question_id > 0 &&
          (a.selected_option === null || OPTIONS.includes(a.selected_option))
      );

    if (cleaned.length === 0) {
      return res.status(400).json({ success: false, message: 'Format jawaban tidak valid' });
    }

    const keys = await practiceModel.getCorrectOptions(cleaned.map((a) => a.question_id));
    const keyMap = new Map(keys.map((k) => [k.id, k.correct_option]));

    const rows = cleaned
      .filter((a) => keyMap.has(a.question_id))
      .map((a) => ({
        question_id: a.question_id,
        selected_option: a.selected_option,
        is_correct: a.selected_option === keyMap.get(a.question_id) ? 1 : 0,
      }));

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan' });
    }

    const today = toWibDate();
    await practiceModel.insertPracticeAnswers(userId, rows, today);
    await recordActivity(pool, userId, today);

    const correct = rows.filter((r) => r.is_correct === 1).length;

    return res.status(201).json({
      success: true,
      message: 'Latihan tersimpan',
      data: { total: rows.length, correct, wrong: rows.length - correct },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getQuestions, submitPractice };