const express = require('express');
const { midtransNotification } = require('../controllers/payment.controller');

// Tanpa authMiddleware: pemanggilnya server Midtrans. Keamanan ada di verifikasi tanda tangan.
const router = express.Router();
router.post('/midtrans/notification', midtransNotification);

module.exports = router;
