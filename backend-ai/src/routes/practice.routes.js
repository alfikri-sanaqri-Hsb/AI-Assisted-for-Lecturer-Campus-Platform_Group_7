const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const practiceController = require('../controllers/practice.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/questions', practiceController.getQuestions);
router.post('/submit', practiceController.submitPractice);

module.exports = router;