const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.use(authMiddleware, requireRole('admin'));
router.get('/dashboard', adminController.getDashboard);
const adminTryoutController = require('../controllers/admin.tryout.controller');

router.get('/tryouts', adminTryoutController.listTryouts);
router.post('/tryouts', adminTryoutController.createTryout);
router.put('/tryouts/:id', adminTryoutController.updateTryout);
router.delete('/tryouts/:id', adminTryoutController.deleteTryout);
router.get('/tryouts/:id/questions', adminTryoutController.listQuestions);
router.post('/tryouts/:id/questions', adminTryoutController.createQuestion);
router.put('/questions/:id', adminTryoutController.updateQuestion);
router.delete('/questions/:id', adminTryoutController.deleteQuestion);

module.exports = router;
