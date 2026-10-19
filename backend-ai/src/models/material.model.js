/**
 * MATERIAL MODEL
 * Satu-satunya tempat SQL untuk tabel materials dan user_material_progress
 */

const pool = require('../config/database');

const findAllMaterials = async (userId, subject) => {
  const params = [userId];
  let whereClause = '';

  if (subject) {
    whereClause = 'WHERE m.subject = ?';
    params.push(subject);
  }

  const query = `
    SELECT
      m.id, m.subject, m.title, m.description, m.image_url,
      m.estimated_minutes, m.sort_order,
      (p.id IS NOT NULL) AS is_completed
    FROM materials m
    LEFT JOIN user_material_progress p
      ON p.material_id = m.id AND p.user_id = ?
    ${whereClause}
    ORDER BY m.subject, m.sort_order, m.id
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

const findMaterialById = async (userId, materialId) => {
  const query = `
    SELECT
      m.id, m.subject, m.title, m.description, m.image_url,
      m.estimated_minutes, m.sort_order,
      (p.id IS NOT NULL) AS is_completed
    FROM materials m
    LEFT JOIN user_material_progress p
      ON p.material_id = m.id AND p.user_id = ?
    WHERE m.id = ?
  `;

  const [rows] = await pool.query(query, [userId, materialId]);
  return rows[0];
};

// Jika sudah pernah selesai, cukup perbarui waktunya (tidak membuat duplikat)
const markMaterialCompleted = async (userId, materialId) => {
  await pool.query(
    `INSERT INTO user_material_progress (user_id, material_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE completed_at = CURRENT_TIMESTAMP`,
    [userId, materialId]
  );
};

module.exports = {
  findAllMaterials,
  findMaterialById,
  markMaterialCompleted,
};