const pool = require('../config/database');

async function getMentors(featuredOnly) {
  const [rows] = await pool.query(
    `SELECT id, name, photo_url, university, major, bio, subjects, group_url, is_featured
     FROM mentors
     WHERE is_active = 1 ${featuredOnly ? 'AND is_featured = 1' : ''}
     ORDER BY is_featured DESC, name ASC`
  );
  return rows;
}

async function findMentorById(id) {
  const [[row]] = await pool.query(
    `SELECT id, name, photo_url, university, major, bio, subjects, group_url, is_featured
     FROM mentors WHERE id = ? AND is_active = 1`,
    [id]
  );
  return row || null;
}

// Sesi yang belum selesai, diurutkan dari yang paling dekat.
async function getUpcomingSessions(limit, mentorId) {
  const params = [];
  let sql = `
    SELECT s.id, s.mentor_id, s.title, s.starts_at, s.duration_minutes, s.meeting_url,
           m.name AS mentor_name, m.photo_url AS mentor_photo, m.group_url
    FROM mentor_sessions s
    JOIN mentors m ON m.id = s.mentor_id
    WHERE s.is_active = 1 AND m.is_active = 1
      AND DATE_ADD(s.starts_at, INTERVAL s.duration_minutes MINUTE) >= NOW()`;
  if (mentorId) {
    sql += ' AND s.mentor_id = ?';
    params.push(mentorId);
  }
  sql += ' ORDER BY s.starts_at ASC LIMIT ?';
  params.push(limit);

  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { getMentors, findMentorById, getUpcomingSessions };