const pool = require('../config/database');

async function getVideos(userId, subject, dateWib) {
  const params = [userId, dateWib];
  let where = 'WHERE v.is_published = 1';
  if (subject) {
    where += ' AND v.subject = ?';
    params.push(subject);
  }

  const [rows] = await pool.query(
    `SELECT v.id, v.subject, v.title, v.url, v.duration_minutes,
            (uv.video_id IS NOT NULL) AS watched_today
     FROM videos v
     LEFT JOIN user_video_views uv
       ON uv.video_id = v.id AND uv.user_id = ? AND uv.watched_date = ?
     ${where}
     ORDER BY v.sort_order, v.id`,
    params
  );
  return rows;
}

async function findPublishedVideo(videoId) {
  const [rows] = await pool.query(
    'SELECT id FROM videos WHERE id = ? AND is_published = 1',
    [videoId]
  );
  return rows[0] || null;
}

// INSERT IGNORE: menonton video yang sama dua kali di hari yang sama tidak dihitung dobel
async function markWatched(userId, videoId, dateWib) {
  await pool.query(
    'INSERT IGNORE INTO user_video_views (user_id, video_id, watched_date) VALUES (?, ?, ?)',
    [userId, videoId, dateWib]
  );
}

async function countWatchedOn(userId, dateWib) {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM user_video_views WHERE user_id = ? AND watched_date = ?',
    [userId, dateWib]
  );
  return Number(rows[0].total);
}

module.exports = { getVideos, findPublishedVideo, markWatched, countWatchedOn };