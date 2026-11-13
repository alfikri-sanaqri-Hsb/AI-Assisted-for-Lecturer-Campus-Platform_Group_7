const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const ptn = require('../controllers/ptn.controller');

const router = express.Router();

// Semua endpoint butuh login
router.use(authMiddleware);

// Daftar prodi boleh dibaca siswa maupun admin
router.get('/programs', ptn.listPrograms);
router.get('/programs/:id', ptn.getProgram);

// Target pilihan hanya untuk siswa
router.get('/targets', requireRole('student'), ptn.listTargets);
router.post('/targets', requireRole('student'), ptn.addTarget);
router.delete('/targets/:programId', requireRole('student'), ptn.removeTarget);

module.exports = router;
