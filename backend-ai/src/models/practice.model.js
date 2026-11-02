const pool = require('../config/database');

// Soal acak untuk latihan. Kunci jawaban tidak diambil di sini.
async function getPracticeQuestions(subject, limit) {
  const params = [];
  let where = '';
  if (subject) {
    where = 'WHERE q.subject = ?';
    params.push(subject);
  }
  params.push(limit);

  const [rows] = await pool.query(
    `SELECT q.id, q.subject, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
     FROM questions q
     ${where}
     ORDER BY RAND()
     LIMIT ?`,
    params
  );
  return rows;
}

async function getCorrectOptions(questionIds) {
  const [rows] = await pool.query(
    'SELECT id, correct_option FROM questions WHERE id IN (?)',
    [questionIds]
  );
  return rows;
}

async function insertPracticeAnswers(userId, rows, dateWib) {
  await pool.query(
    `INSERT INTO practice_answers (user_id, question_id, selected_option, is_correct, answered_date)
     VALUES ?`,
    [rows.map((r) => [userId, r.question_id, r.selected_option, r.is_correct, dateWib])]
  );
}

async function countPracticeOn(userId, dateWib) {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM practice_answers WHERE user_id = ? AND answered_date = ?',
    [userId, dateWib]
  );
  return Number(rows[0].total);
}

module.exports = {
  getPracticeQuestions,
  getCorrectOptions,
  insertPracticeAnswers,
  countPracticeOn,
};