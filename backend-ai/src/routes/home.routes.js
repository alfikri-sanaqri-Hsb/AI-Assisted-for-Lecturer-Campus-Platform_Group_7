const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const homeController = require('../controllers/home.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/', homeController.getHome);

module.exports = router;