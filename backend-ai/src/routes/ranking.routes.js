const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const rankingController = require('../controllers/ranking.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/', rankingController.getRanking);

module.exports = router;