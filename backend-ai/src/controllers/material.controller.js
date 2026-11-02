const pool = require('../config/database');
const materialModel = require('../models/material.model');
const { recordActivity } = require('../models/progress.model');
const { toWibDate } = require('../utils/streak');

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function toMaterialResponse(row) {
  return { ...row, is_completed: Boolean(row.is_completed) };
}

// GET /api/materials?subject=...
async function getMaterials(req, res, next) {
  try {
    const subject = req.query.subject ? String(req.query.subject).trim() : null;
    const rows = await materialModel.findAllMaterials(req.user.id, subject);

    return res.json({
      success: true,
      message: 'Daftar materi',
      data: rows.map(toMaterialResponse),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/materials/:id
async function getMaterialById(req, res, next) {
  try {
    const materialId = parseId(req.params.id);
    if (!materialId) {
      return res.status(400).json({ success: false, message: 'ID materi tidak valid' });
    }

    const row = await materialModel.findMaterialById(req.user.id, materialId);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }

    return res.json({
      success: true,
      message: 'Detail materi',
      data: toMaterialResponse(row),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/materials/:id/complete
async function completeMaterial(req, res, next) {
  try {
    const materialId = parseId(req.params.id);
    if (!materialId) {
      return res.status(400).json({ success: false, message: 'ID materi tidak valid' });
    }

    const row = await materialModel.findMaterialById(req.user.id, materialId);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }

    await materialModel.markMaterialCompleted(req.user.id, materialId);

    // Selesai materi dihitung sebagai aktivitas belajar (streak)
    await recordActivity(pool, req.user.id, toWibDate());

    return res.json({
      success: true,
      message: 'Materi ditandai selesai',
      data: { id: materialId, is_completed: true },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMaterials, getMaterialById, completeMaterial };