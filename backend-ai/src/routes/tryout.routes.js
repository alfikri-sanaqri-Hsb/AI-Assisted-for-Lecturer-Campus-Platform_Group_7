const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const c = require('../controllers/tryout.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', c.getTryouts);                        // GET  daftar tryout
router.get('/attempts/:attemptId', c.getAttemptResult); // GET  lihat hasil lagi
router.get('/:id/questions', c.getTryoutQuestions);   // GET  soal (tanpa kunci)
router.post('/:id/submit', c.submitTryout);           // POST kirim jawaban, dapat nilai

module.exports = router;