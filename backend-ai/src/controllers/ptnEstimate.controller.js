/**
 * PTN ESTIMATE CONTROLLER
 * Hanya urusan HTTP. Aturan ada di services/ptnEstimate.service.js.
 */

const ptnEstimateService = require('../services/ptnEstimate.service');

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

// POST /api/ai/insights/ptn            body (opsional): { "utbk_score": 650 }
async function createPtnEstimate(req, res, next) {
  try {
    const options = {};
    const raw = req.body && req.body.utbk_score;
    if (raw !== undefined && raw !== null && raw !== '') {
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 200 || n > 1000) throw badRequest('utbk_score harus angka antara 200 dan 1000');
      options.utbkScore = n;
    }
    const data = await ptnEstimateService.generate(req.user.id, options);
    return res.status(201).json({ success: true, message: 'Estimasi peluang PTN berhasil dibuat', data });
  } catch (err) {
    next(err);
  }
}

// GET /api/ai/insights/ptn/latest
async function getLatestPtnEstimate(req, res, next) {
  try {
    const data = await ptnEstimateService.latest(req.user.id);
    return res.json({ success: true, message: data ? 'Estimasi PTN terbaru' : 'Belum ada estimasi PTN', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPtnEstimate, getLatestPtnEstimate };
