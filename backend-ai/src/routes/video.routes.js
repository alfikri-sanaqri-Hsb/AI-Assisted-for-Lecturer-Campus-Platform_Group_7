const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const videoController = require('../controllers/video.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/', videoController.getVideos);
router.post('/:id/watch', videoController.watchVideo);

module.exports = router;