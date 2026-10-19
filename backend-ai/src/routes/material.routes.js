/**
 * MATERIAL ROUTES
 * Semua route materi wajib login (Bearer token)
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {
  getMaterials,
  getMaterialById,
  completeMaterial,
} = require('../controllers/material.controller');

router.use(authMiddleware);

// GET /api/materials
router.get('/', getMaterials);

// GET /api/materials/:id
router.get('/:id', getMaterialById);

// POST /api/materials/:id/complete
router.post('/:id/complete', completeMaterial);

module.exports = router;