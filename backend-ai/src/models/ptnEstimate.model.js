/** SQL untuk tabel ptn_estimates (hasil estimasi PTN dari AI) */
const pool = require('../config/database');

const saveEstimate = async ({ userId, output, provider, model }) => {
  const [result] = await pool.query(
    'INSERT INTO ptn_estimates (user_id, output_json, provider, model) VALUES (?, ?, ?, ?)',
    [userId, JSON.stringify(output), provider, model]
  );
  return result.insertId;
};

const getLatestEstimate = async (userId) => {
  const [rows] = await pool.query(
    'SELECT id, output_json, provider, model, created_at FROM ptn_estimates WHERE user_id = ? ORDER BY id DESC LIMIT 1',
    [userId]
  );
  return rows[0];
};

module.exports = { saveEstimate, getLatestEstimate };
