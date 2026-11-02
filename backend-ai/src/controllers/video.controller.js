const pool = require('../config/database');
const videoModel = require('../models/video.model');
const { recordActivity } = require('../models/progress.model');
const { toWibDate } = require('../utils/streak');

// GET /api/videos?subject=Penalaran Umum
async function getVideos(req, res, next) {
  try {
    const subject = req.query.subject ? String(req.query.subject).trim() : null;
    const rows = await videoModel.getVideos(req.user.id, subject, toWibDate());

    return res.json({
      success: true,
      message: 'Daftar video',
      data: rows.map((v) => ({ ...v, watched_today: Boolean(v.watched_today) })),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/videos/:id/watch
async function watchVideo(req, res, next) {
  try {
    const videoId = Number(req.params.id);
    if (!Number.isInteger(videoId) || videoId <= 0) {
      return res.status(400).json({ success: false, message: 'ID video tidak valid' });
    }

    const video = await videoModel.findPublishedVideo(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video tidak ditemukan' });
    }

    const today = toWibDate();
    await videoModel.markWatched(req.user.id, videoId, today);
    await recordActivity(pool, req.user.id, today);

    const totalToday = await videoModel.countWatchedOn(req.user.id, today);

    return res.json({
      success: true,
      message: 'Video dicatat sudah ditonton',
      data: { video_id: videoId, watched_today: true, total_watched_today: totalToday },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getVideos, watchVideo };