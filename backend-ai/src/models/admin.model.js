const pool = require('../config/database');

async function getDashboardSummary() {
  const [[students]] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
  const [[tryouts]] = await pool.query('SELECT COUNT(*) AS total FROM tryouts WHERE is_published = 1');
  const [[materials]] = await pool.query('SELECT COUNT(*) AS total FROM materials');
  const [[insights]] = await pool.query('SELECT COUNT(*) AS total FROM ai_insights');
  return {
    total_students: students.total,
    total_tryouts: tryouts.total,
    total_materials: materials.total,
    total_ai_insights: insights.total,
  };
}

module.exports = { getDashboardSummary };
