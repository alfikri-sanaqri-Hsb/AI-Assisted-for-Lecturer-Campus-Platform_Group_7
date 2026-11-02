const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const mentorController = require('../controllers/mentor.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('student'));

router.get('/', mentorController.getMentors);
router.get('/sessions/next', mentorController.getNextSession);
router.get('/:id', mentorController.getMentorById);

module.exports = router;