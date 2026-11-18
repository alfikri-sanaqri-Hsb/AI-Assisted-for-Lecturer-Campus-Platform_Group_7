/** Model materi (berbasis link) dan video untuk admin dan mentor. Semua nilai lewat placeholder ?. */
const pool = require('../config/database');
const { searchClause } = require('../utils/listQuery');

const MATERIAL_SORT = { terbaru: 'm.id', judul: 'm.title', mapel: 'm.subject', diperbarui: 'm.updated_at' };
const VIDEO_SORT = { terbaru: 'id', judul: 'title', mapel: 'subject', urutan: 'sort_order' };

const MATERIAL_SELECT = `
  SELECT m.id, m.subject, m.title, m.description, m.content_url, m.image_url,
         m.estimated_minutes, m.sort_order, m.status, m.is_published,
         m.review_note, m.reviewed_at, m.author_id,
         COALESCE(p.full_name, u.email) AS author_name,
         m.created_at, m.updated_at,
         (SELECT COUNT(*) FROM user_material_progress x WHERE x.material_id = m.id) AS total_access
    FROM materials m
    LEFT JOIN users u ON u.id = m.author_id
    LEFT JOIN user_profiles p ON p.user_id = u.id`;

// filter: { status, subject, authorId }
async function listMaterials(f, filter = {}) {
  const s = searchClause(f.cari, ['m.title', 'm.subject']);
  const where = [...s.where];
  const params = [...s.params];
  if (filter.status) { where.push('m.status = ?'); params.push(filter.status); }
  if (filter.subject) { where.push('m.subject = ?'); params.push(filter.subject); }
  if (filter.authorId) { where.push('m.author_id = ?'); params.push(filter.authorId); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (f.halaman - 1) * f.perHalaman;

  const [rows] = await pool.query(
    `${MATERIAL_SELECT} ${whereSql}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, m.id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM materials m ${whereSql}`, params);
  return { rows, total: Number(total) };
}

async function getMaterial(id) {
  const [rows] = await pool.query(`${MATERIAL_SELECT} WHERE m.id = ?`, [id]);
  return rows[0] || null;
}

async function createMaterial(d, { status, isPublished, authorId }) {
  const [r] = await pool.query(
    `INSERT INTO materials
       (subject, title, description, content_url, image_url, estimated_minutes, sort_order, status, is_published, author_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [d.subject, d.title, d.description, d.content_url, d.image_url, d.estimated_minutes, d.sort_order,
     status, isPublished, authorId || null]
  );
  return r.insertId;
}

// authorId diisi => hanya baris milik penulis itu (dipakai panel mentor)
async function updateMaterial(id, d, authorId) {
  const params = [d.subject, d.title, d.description, d.content_url, d.image_url, d.estimated_minutes, d.sort_order, id];
  let sql = `UPDATE materials SET subject = ?, title = ?, description = ?, content_url = ?, image_url = ?,
                    estimated_minutes = ?, sort_order = ? WHERE id = ?`;
  if (authorId) { sql += ' AND author_id = ?'; params.push(authorId); }
  const [r] = await pool.query(sql, params);
  return r.affectedRows;
}

async function deleteMaterial(id, authorId) {
  const params = [id];
  let sql = 'DELETE FROM materials WHERE id = ?';
  if (authorId) { sql += ' AND author_id = ?'; params.push(authorId); }
  const [r] = await pool.query(sql, params);
  return r.affectedRows;
}

// Pindah status. "expected" = status yang dibaca tadi; kalau sudah berubah (balapan), 0 baris terubah.
async function setMaterialStatus(id, expected, next) {
  const sets = ['status = ?', 'is_published = ?'];
  const params = [next.status, next.isPublished];
  if (next.reviewNote !== undefined) { sets.push('review_note = ?'); params.push(next.reviewNote); }
  if (next.markReviewed) sets.push('reviewed_at = NOW()');
  params.push(id, expected);
  const [r] = await pool.query(`UPDATE materials SET ${sets.join(', ')} WHERE id = ? AND status = ?`, params);
  return r.affectedRows;
}

// Ringkasan milik satu mentor (untuk dashboard mentor)
async function ownSummary(authorId) {
  const [rows] = await pool.query(
    'SELECT status, COUNT(*) AS total FROM materials WHERE author_id = ? GROUP BY status',
    [authorId]
  );
  const [[rev]] = await pool.query(
    "SELECT COUNT(*) AS total FROM materials WHERE author_id = ? AND status = 'draft' AND review_note IS NOT NULL",
    [authorId]
  );
  const by = { draft: 0, pending_review: 0, approved: 0, published: 0 };
  for (const r of rows) by[r.status] = Number(r.total);
  return { total_materials: Object.values(by).reduce((a, b) => a + b, 0), by_status: by, needs_revision: Number(rev.total) };
}

/* ---------- VIDEO (cukup link) ---------- */

async function listVideos(f, filter = {}) {
  const s = searchClause(f.cari, ['title', 'subject']);
  const where = [...s.where];
  const params = [...s.params];
  if (filter.subject) { where.push('subject = ?'); params.push(filter.subject); }
  if (filter.published !== undefined) { where.push('is_published = ?'); params.push(filter.published); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (f.halaman - 1) * f.perHalaman;

  const [rows] = await pool.query(
    `SELECT id, subject, title, url, duration_minutes, sort_order, is_published
       FROM videos ${whereSql}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM videos ${whereSql}`, params);
  return { rows, total: Number(total) };
}

async function createVideo(d) {
  const [r] = await pool.query(
    'INSERT INTO videos (subject, title, url, duration_minutes, sort_order, is_published) VALUES (?, ?, ?, ?, ?, ?)',
    [d.subject, d.title, d.url, d.duration_minutes, d.sort_order, d.is_published]
  );
  return r.insertId;
}

async function updateVideo(id, d) {
  const [r] = await pool.query(
    `UPDATE videos SET subject = ?, title = ?, url = ?, duration_minutes = ?, sort_order = ?, is_published = ?
      WHERE id = ?`,
    [d.subject, d.title, d.url, d.duration_minutes, d.sort_order, d.is_published, id]
  );
  return r.affectedRows;
}

async function deleteVideo(id) {
  const [r] = await pool.query('DELETE FROM videos WHERE id = ?', [id]);
  return r.affectedRows;
}

module.exports = {
  MATERIAL_SORT, VIDEO_SORT,
  listMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial, setMaterialStatus, ownSummary,
  listVideos, createVideo, updateVideo, deleteVideo,
};
