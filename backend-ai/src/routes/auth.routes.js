/**
 * AUTH ROUTES
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimit.middleware');
const { requestReset, confirmReset } = require('../controllers/passwordReset.controller');

// POST /api/auth/register
router.post('/register', registerLimiter, register);

// POST /api/auth/login
router.post('/login', loginLimiter, login);

// POST /api/auth/password-reset/request
router.post('/password-reset/request', registerLimiter, requestReset);

// POST /api/auth/password-reset/confirm
router.post('/password-reset/confirm', loginLimiter, confirmReset);

module.exports = router;