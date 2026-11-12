const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const aiController = require('../controllers/ai.controller');

const router = express.Router();

// Hanya siswa yang sudah login
router.use(authMiddleware, requireRole('student'));

router.post('/insights/study', aiController.createStudyInsight);
router.get('/insights/study/latest', aiController.getLatestStudyInsight);

module.exports = router;
