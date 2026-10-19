/**
 * MATERIAL CONTROLLER
 * Daftar materi, detail materi, dan tandai materi selesai (untuk siswa)
 */

const materialModel = require('../models/material.model');
const pool = require('../config/database');
const { recordActivity } = require('../models/progress.model');
const { toWibDate } = require('../utils/streak');

// is_completed dari MySQL berupa 0/1, diubah menjadi true/false
const toMaterialResponse = (row) => ({
  ...row,
  is_completed: Boolean(row.is_completed),
});

// Mengembalikan angka id yang valid, atau null jika tidak valid
const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// GET /api/materials?subject=Penalaran%20Umum
const getMaterials = async (req, res, next) => {
  try {
    const subject = req.query.subject ? String(req.query.subject).trim() : undefined;
    const rows = await materialModel.findAllMaterials(req.user.id, subject);

    res.status(200).json({
      success: true,
      message: 'Daftar materi berhasil diambil',
      data: rows.map(toMaterialResponse),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/materials/:id
const getMaterialById = async (req, res, next) => {
  try {
    const materialId = parseId(req.params.id);
    if (!materialId) {
      return res.status(400).json({ success: false, message: 'ID materi tidak valid' });
    }

    const row = await materialModel.findMaterialById(req.user.id, materialId);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      message: 'Detail materi berhasil diambil',
      data: toMaterialResponse(row),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/materials/:id/complete
async function completeMaterial(req, res, next) {
  try {
    const materialId = parseId(req.params.id);
    if (!materialId) {
      return res.status(400).json({ success: false, message: 'ID materi tidak valid' });
    }

    const material = await materialModel.findMaterialById(req.user.id, materialId);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }

    await materialModel.markMaterialCompleted(req.user.id, materialId);

    // Selesai materi juga dihitung sebagai aktivitas belajar (streak)
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