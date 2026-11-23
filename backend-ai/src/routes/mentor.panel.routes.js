const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const panel = require('../controllers/mentor.panel.controller');

const router = express.Router();

// Hanya akun ber-role mentor
router.use(authMiddleware, requireRole('mentor'));

router.get('/summary', panel.summary);
router.get('/students', panel.getMyStudents);
router.get('/materials', panel.listOwn);
router.post('/materials', panel.create);
router.put('/materials/:id', panel.update);
router.post('/materials/:id/submit', panel.submit);
router.delete('/materials/:id', panel.remove);

module.exports = router;
