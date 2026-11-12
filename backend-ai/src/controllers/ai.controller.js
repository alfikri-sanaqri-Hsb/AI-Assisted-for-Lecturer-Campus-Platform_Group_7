/**
 * AI CONTROLLER
 * Hanya urusan HTTP. Aturan AI ada di services/insight.service.js.
 */

const insightService = require('../services/insight.service');

// POST /api/ai/insights/study  -> buat insight baru
async function createStudyInsight(req, res, next) {
  try {
    const data = await insightService.generate(req.user.id);
    return res.status(201).json({ success: true, message: 'Insight belajar berhasil dibuat', data });
  } catch (err) {
    next(err); // statusCode 422 / 429 / 502 dibaca error.middleware.js
  }
}

// GET /api/ai/insights/study/latest  -> insight terbaru (data: null kalau belum ada)
async function getLatestStudyInsight(req, res, next) {
  try {
    const data = await insightService.latest(req.user.id);
    return res.json({ success: true, message: data ? 'Insight belajar terbaru' : 'Belum ada insight belajar', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createStudyInsight, getLatestStudyInsight };
