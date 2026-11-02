const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const materialController = require('../controllers/material.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/', materialController.getMaterials);
router.get('/:id', materialController.getMaterialById);
router.post('/:id/complete', materialController.completeMaterial);

module.exports = router;