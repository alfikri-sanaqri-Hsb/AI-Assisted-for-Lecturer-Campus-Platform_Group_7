/**
 * AUTH ROUTES
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimit.middleware');

// POST /api/auth/register
router.post('/register', registerLimiter, register);

// POST /api/auth/login
router.post('/login', loginLimiter, login);

module.exports = router;