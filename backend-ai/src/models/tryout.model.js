const pool = require('../config/database');
const { recordActivity } = require('./progress.model');
const { toWibDate } = require('../utils/streak');

async function getTryouts() {
  const [rows] = await pool.query(
    'SELECT id, title, description, duration_minutes FROM tryouts WHERE is_published = 1 ORDER BY id'
  );
  return rows;
}

// Soal untuk dikerjakan: TANPA kunci jawaban
async function getQuestionsForTryout(tryoutId) {
  const [rows] = await pool.query(
    `SELECT id, subject, question_text, option_a, option_b, option_c, option_d, sort_order
     FROM questions WHERE tryout_id = ? ORDER BY sort_order, id`,
    [tryoutId]
  );
  return rows;
}

// Hitung nilai di database dalam satu transaksi
async function submitAttempt(userId, tryoutId, answers) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [questions] = await conn.query(
      'SELECT id, correct_option FROM questions WHERE tryout_id = ?',
      [tryoutId]
    );
    if (questions.length === 0) {
      const err = new Error('Tryout tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }

    const selected = new Map(answers.map((a) => [Number(a.question_id), a.selected_option]));
    let correctCount = 0;
    const rows = questions.map((q) => {
      const choice = selected.get(q.id) || null;
      const isCorrect = choice === q.correct_option ? 1 : 0;
      correctCount += isCorrect;
      return [q.id, choice, isCorrect];
    });

    const score = Math.round((correctCount / questions.length) * 10000) / 100;

    const [attempt] = await conn.query(
      `INSERT INTO tryout_attempts (user_id, tryout_id, correct_count, total_questions, score)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, tryoutId, correctCount, questions.length, score]
    );

    await conn.query(
      'INSERT INTO attempt_answers (attempt_id, question_id, selected_option, is_correct) VALUES ?',
      [rows.map((r) => [attempt.insertId, ...r])]
    );

    // Catat aktivitas belajar hari ini (untuk streak)
    await recordActivity(conn, userId, toWibDate());

    await conn.commit();
    return { attemptId: attempt.insertId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Ambil hasil. Hanya milik user yang login (user_id dicek).
async function getAttemptResult(userId, attemptId) {
  const [[attempt]] = await pool.query(
    `SELECT a.id, a.tryout_id, a.score, a.correct_count, a.total_questions,
            a.submitted_at, u.is_premium
     FROM tryout_attempts a
     JOIN users u ON u.id = a.user_id
     WHERE a.id = ? AND a.user_id = ?`,
    [attemptId, userId]
  );
  if (!attempt) return null;

  const [rows] = await pool.query(
    `SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
            q.correct_option, ans.selected_option, ans.is_correct
     FROM attempt_answers ans
     JOIN questions q ON q.id = ans.question_id
     WHERE ans.attempt_id = ?
     ORDER BY q.sort_order, q.id`,
    [attemptId]
  );

  return { attempt, rows };
}

module.exports = { getTryouts, getQuestionsForTryout, submitAttempt, getAttemptResult };