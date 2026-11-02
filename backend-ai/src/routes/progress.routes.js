const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const progressController = require('../controllers/progress.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/summary', progressController.getSummary);
router.get('/overview', progressController.getOverview);

module.exports = router;