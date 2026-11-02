const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const feedbackController = require('../controllers/feedback.controller');

const router = express.Router();

router.use(authMiddleware);

router.post('/', feedbackController.createFeedback);

module.exports = router;