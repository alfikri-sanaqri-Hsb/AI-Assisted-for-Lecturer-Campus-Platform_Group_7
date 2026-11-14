/**
 * PTN MODEL
 * Semua SQL untuk ptn_programs dan user_targets. Nilai selalu lewat placeholder ?
 * Satu-satunya yang ditempel langsung ke SQL adalah nama kolom ORDER BY,
 * dan itu sudah dipilih dari daftar tetap di utils/ptnQuery.js.
 */

const pool = require('../config/database');
const { escapeLike } = require('../utils/ptnQuery');

// Bangun bagian WHERE + nilainya dari filter
function buildWhere(f) {
  const where = [];
  const params = [];

  // Tiap kata pencarian harus ada di nama prodi ATAU nama universitas
  for (const word of f.cari.split(/\s+/).filter(Boolean)) {
    where.push("(program_name LIKE ? ESCAPE '|' OR university LIKE ? ESCAPE '|')");
    params.push(`%${escapeLike(word)}%`, `%${escapeLike(word)}%`);
  }
  if (f.universitas) {
    where.push("university LIKE ? ESCAPE '|'");
    params.push(`%${escapeLike(f.universitas)}%`);
  }
  if (f.jenjang) { where.push('degree = ?'); params.push(f.jenjang); }
  if (f.skorMin !== undefined) { where.push('score_avg >= ?'); params.push(f.skorMin); }
  if (f.skorMaks !== undefined) { where.push('score_avg <= ?'); params.push(f.skorMaks); }

  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

const listPrograms = async (f) => {
  const { sql, params } = buildWhere(f);
  const offset = (f.halaman - 1) * f.perHalaman;

  // ORDER BY: kolom dari daftar tetap + id sebagai pembeda supaya urutan stabil antar halaman
  const [rows] = await pool.query(
    `SELECT id, university, program_name, degree, path, year, score_min, score_avg, score_max,
          pct_choice1, pct_choice2, pct_choice3, pct_choice4, applicants, capacity, source, source_type
       FROM ptn_programs ${sql}
      ORDER BY ${f.orderColumn} ${f.arah === 'asc' ? 'ASC' : 'DESC'}, id ASC
      LIMIT ? OFFSET ?`,
    [...params, f.perHalaman, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ptn_programs ${sql}`, params);
  return { rows, total: Number(total) };
};

const getProgramById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM ptn_programs WHERE id = ?', [id]);
  return rows[0];
};

const listTargets = async (userId) => {
  const [rows] = await pool.query(
    `SELECT t.id, t.program_id, p.university, p.program_name, p.degree, p.year, p.score_min, p.score_avg, p.score_max, p.source_type
       FROM user_targets t JOIN ptn_programs p ON p.id = t.program_id
      WHERE t.user_id = ? ORDER BY t.id ASC`,
    [userId]
  );
  return rows;
};

const countTargets = async (userId) => {
  const [[row]] = await pool.query('SELECT COUNT(*) AS total FROM user_targets WHERE user_id = ?', [userId]);
  return Number(row.total);
};

const addTarget = async (userId, programId) => {
  await pool.query('INSERT INTO user_targets (user_id, program_id) VALUES (?, ?)', [userId, programId]);
};

const removeTarget = async (userId, programId) => {
  const [result] = await pool.query('DELETE FROM user_targets WHERE user_id = ? AND program_id = ?', [userId, programId]);
  return result.affectedRows > 0;
};

module.exports = { listPrograms, getProgramById, listTargets, countTargets, addTarget, removeTarget };
