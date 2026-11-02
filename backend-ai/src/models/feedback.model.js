const pool = require('../config/database');

async function insertFeedback(userId, topic, message) {
  const [result] = await pool.query(
    'INSERT INTO feedback (user_id, topic, message) VALUES (?, ?, ?)',
    [userId, topic, message]
  );
  return result.insertId;
}

module.exports = { insertFeedback };