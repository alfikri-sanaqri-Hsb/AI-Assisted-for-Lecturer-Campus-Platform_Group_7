const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const tryoutController = require('../controllers/tryout.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/', tryoutController.getTryouts);
router.get('/attempts/:attemptId', tryoutController.getAttemptResult);
router.get('/:id/questions', tryoutController.getTryoutQuestions);
router.post('/:id/submit', tryoutController.submitTryout);

module.exports = router;