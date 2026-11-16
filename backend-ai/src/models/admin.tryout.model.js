const pool = require('../config/database');

async function listTryouts() {
  const [rows] = await pool.query(
    `SELECT t.id, t.title, t.description, t.duration_minutes, t.is_published,
            COUNT(q.id) AS question_count
     FROM tryouts t LEFT JOIN questions q ON q.tryout_id = t.id
     GROUP BY t.id ORDER BY t.id`
  );
  return rows;
}

async function createTryout({ title, description, duration_minutes, is_published }) {
  const [r] = await pool.query(
    'INSERT INTO tryouts (title, description, duration_minutes, is_published) VALUES (?, ?, ?, ?)',
    [title, description || null, duration_minutes || 0, is_published ? 1 : 0]
  );
  return r.insertId;
}

async function updateTryout(id, { title, description, duration_minutes, is_published }) {
  const [r] = await pool.query(
    'UPDATE tryouts SET title = ?, description = ?, duration_minutes = ?, is_published = ? WHERE id = ?',
    [title, description || null, duration_minutes || 0, is_published ? 1 : 0, id]
  );
  return r.affectedRows;
}

async function deleteTryout(id) {
  const [r] = await pool.query('DELETE FROM tryouts WHERE id = ?', [id]);
  return r.affectedRows;
}

async function listQuestions(tryoutId) {
  const [rows] = await pool.query(
    `SELECT id, subject, question_text, option_a, option_b, option_c, option_d,
            correct_option, sort_order FROM questions
     WHERE tryout_id = ? ORDER BY sort_order, id`,
    [tryoutId]
  );
  return rows;
}

async function createQuestion(tryoutId, q) {
  const [r] = await pool.query(
    `INSERT INTO questions (tryout_id, subject, question_text, option_a, option_b,
       option_c, option_d, correct_option, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tryoutId, q.subject, q.question_text, q.option_a, q.option_b,
     q.option_c, q.option_d, q.correct_option, q.sort_order || 0]
  );
  return r.insertId;
}

async function updateQuestion(id, q) {
  const [r] = await pool.query(
    `UPDATE questions SET subject = ?, question_text = ?, option_a = ?, option_b = ?,
       option_c = ?, option_d = ?, correct_option = ?, sort_order = ? WHERE id = ?`,
    [q.subject, q.question_text, q.option_a, q.option_b, q.option_c,
     q.option_d, q.correct_option, q.sort_order || 0, id]
  );
  return r.affectedRows;
}

async function deleteQuestion(id) {
  const [r] = await pool.query('DELETE FROM questions WHERE id = ?', [id]);
  return r.affectedRows;
}

module.exports = {
  listTryouts, createTryout, updateTryout, deleteTryout,
  listQuestions, createQuestion, updateQuestion, deleteQuestion,
};
