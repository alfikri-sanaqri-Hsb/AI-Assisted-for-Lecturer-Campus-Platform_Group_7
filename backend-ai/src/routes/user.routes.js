/**
 * USER ROUTES
 * Semua route di sini wajib login (Bearer token)
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const { getDashboard, updateProfile, changePassword } = require('../controllers/user.controller');

router.use(authMiddleware);

// GET /api/users/dashboard
router.get('/dashboard', getDashboard);

// PUT /api/users/profile
router.put('/profile', updateProfile);

// PUT /api/users/password
router.put('/password', changePassword);

module.exports = router;