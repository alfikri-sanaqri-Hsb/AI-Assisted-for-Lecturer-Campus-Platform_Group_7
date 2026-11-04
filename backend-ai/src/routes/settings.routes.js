const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const settingsController = require('../controllers/settings.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', settingsController.getSettings);                       // GET  /api/settings
router.put('/notifications', settingsController.updateNotifications);  // PUT  /api/settings/notifications
router.get('/about', settingsController.getAbout);                     // GET  /api/settings/about

module.exports = router;