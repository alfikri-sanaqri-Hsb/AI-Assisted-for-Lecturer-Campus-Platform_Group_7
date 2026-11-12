/**
 * AI MODEL
 * SQL untuk tabel ai_insights dan ai_audit_logs.
 */

const pool = require('../config/database');

const saveInsight = async ({ userId, output, provider, model }) => {
  const [result] = await pool.query(
    'INSERT INTO ai_insights (user_id, output_json, provider, model) VALUES (?, ?, ?, ?)',
    [userId, JSON.stringify(output), provider, model]
  );
  return result.insertId;
};

const getLatestInsight = async (userId) => {
  const [rows] = await pool.query(
    'SELECT id, output_json, provider, model, created_at FROM ai_insights WHERE user_id = ? ORDER BY id DESC LIMIT 1',
    [userId]
  );
  return rows[0];
};

// Catat setiap pemanggilan AI (bukti audit)
const addAuditLog = async ({ userId, feature, status, detail }) => {
  await pool.query(
    'INSERT INTO ai_audit_logs (user_id, feature, status, detail) VALUES (?, ?, ?, ?)',
    [userId, feature, status, detail ? String(detail).slice(0, 300) : null]
  );
};

// Berapa kali siswa memakai AI hari ini (untuk batas harian)
const countUsageToday = async (userId, feature) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM ai_audit_logs WHERE user_id = ? AND feature = ? AND created_at >= CURDATE()',
    [userId, feature]
  );
  return Number(rows[0].total);
};

module.exports = { saveInsight, getLatestInsight, addAuditLog, countUsageToday };
