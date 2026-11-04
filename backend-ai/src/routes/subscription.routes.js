const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const subscriptionController = require('../controllers/subscription.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/plans', subscriptionController.getPlans);
router.get('/status', subscriptionController.getStatus);
router.post('/checkout', subscriptionController.checkout);
router.post('/:id/pay', subscriptionController.pay);

module.exports = router;