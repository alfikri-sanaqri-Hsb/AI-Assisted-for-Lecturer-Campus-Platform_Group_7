const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const progressController = require('../controllers/progress.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', progressController.getSummary); // GET /api/progress/summary

module.exports = router;