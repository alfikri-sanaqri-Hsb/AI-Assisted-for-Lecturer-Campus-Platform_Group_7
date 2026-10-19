const tryoutModel = require('../models/tryout.model');

const FREE_KEY_LIMIT = Number(process.env.FREE_ANSWER_KEY_LIMIT) || 3;

// Aturan kunci jawaban: premium lihat semua, gratis hanya N soal pertama
function buildReview(rows, isPremium) {
  return rows.map((r, index) => {
    const unlocked = Boolean(isPremium) || index < FREE_KEY_LIMIT;
    return {
      question_id: r.id,
      question_text: r.question_text,
      options: { A: r.option_a, B: r.option_b, C: r.option_c, D: r.option_d },
      selected_option: r.selected_option,
      is_correct: Boolean(r.is_correct),
      answer_key_locked: !unlocked,
      correct_option: unlocked ? r.correct_option : null,
    };
  });
}

function formatResult(result) {
  const { attempt, rows } = result;
  return {
    attempt_id: attempt.id,
    tryout_id: attempt.tryout_id,
    score: Number(attempt.score),
    correct_count: attempt.correct_count,
    total_questions: attempt.total_questions,
    submitted_at: attempt.submitted_at,
    free_answer_key_limit: FREE_KEY_LIMIT,
    is_premium: Boolean(attempt.is_premium),
    review: buildReview(rows, attempt.is_premium),
  };
}

async function getTryouts(req, res, next) {
  try {
    const data = await tryoutModel.getTryouts();
    return res.json({ success: true, message: 'Daftar tryout', data });
  } catch (err) {
    next(err);
  }
}

async function getTryoutQuestions(req, res, next) {
  try {
    const tryoutId = Number(req.params.id);
    if (!Number.isInteger(tryoutId) || tryoutId <= 0) {
      return res.status(400).json({ success: false, message: 'ID tryout tidak valid' });
    }
    const data = await tryoutModel.getQuestionsForTryout(tryoutId);
    if (data.length === 0) {
      return res.status(404).json({ success: false, message: 'Tryout tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Soal tryout', data });
  } catch (err) {
    next(err);
  }
}

async function submitTryout(req, res, next) {
  try {
    const tryoutId = Number(req.params.id);
    const { answers } = req.body;

    if (!Number.isInteger(tryoutId) || tryoutId <= 0) {
      return res.status(400).json({ success: false, message: 'ID tryout tidak valid' });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'answers wajib berupa array' });
    }

    const { attemptId } = await tryoutModel.submitAttempt(req.user.id, tryoutId, answers);
    const result = await tryoutModel.getAttemptResult(req.user.id, attemptId);

    return res.status(201).json({ success: true, message: 'Tryout selesai', data: formatResult(result) });
  } catch (err) {
    next(err);
  }
}

async function getAttemptResult(req, res, next) {
  try {
    const attemptId = Number(req.params.attemptId);
    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      return res.status(400).json({ success: false, message: 'ID attempt tidak valid' });
    }
    const result = await tryoutModel.getAttemptResult(req.user.id, attemptId);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Hasil tidak ditemukan' });
    }
    return res.json({ success: true, message: 'Hasil tryout', data: formatResult(result) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTryouts, getTryoutQuestions, submitTryout, getAttemptResult };