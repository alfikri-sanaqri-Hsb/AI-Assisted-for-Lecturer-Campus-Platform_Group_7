const pool = require('../config/database');

// Siswa hanya melihat materi yang sudah TERBIT (is_published = 1) dan membawa link materinya (content_url)
async function findAllMaterials(userId, subject) {
  const params = [userId];
  let where = 'WHERE m.is_published = 1';
  if (subject) {
    where += ' AND m.subject = ?';
    params.push(subject);
  }

  const [rows] = await pool.query(
    `SELECT m.id, m.subject, m.title, m.description, m.content_url, m.image_url,
            m.estimated_minutes, m.sort_order,
            (p.id IS NOT NULL) AS is_completed
     FROM materials m
     LEFT JOIN user_material_progress p
       ON p.material_id = m.id AND p.user_id = ?
     ${where}
     ORDER BY m.subject, m.sort_order, m.id`,
    params
  );
  return rows;
}

async function findMaterialById(userId, materialId) {
  const [rows] = await pool.query(
    `SELECT m.id, m.subject, m.title, m.description, m.content_url, m.image_url,
            m.estimated_minutes, m.sort_order,
            (p.id IS NOT NULL) AS is_completed
     FROM materials m
     LEFT JOIN user_material_progress p
       ON p.material_id = m.id AND p.user_id = ?
     WHERE m.id = ? AND m.is_published = 1`,
    [userId, materialId]
  );
  return rows[0] || null;
}

async function markMaterialCompleted(userId, materialId) {
  await pool.query(
    `INSERT INTO user_material_progress (user_id, material_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE completed_at = CURRENT_TIMESTAMP`,
    [userId, materialId]
  );
}

module.exports = { findAllMaterials, findMaterialById, markMaterialCompleted };
