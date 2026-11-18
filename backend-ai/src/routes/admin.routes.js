const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const adminController = require('../controllers/admin.controller');
const adminTryoutController = require('../controllers/admin.tryout.controller');
const content = require('../controllers/admin.content.controller');
const manage = require('../controllers/admin.manage.controller');

const router = express.Router();

// Semua route di bawah ini: harus login DAN role admin
router.use(authMiddleware, requireRole('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Siswa
router.get('/students', adminController.listStudents);
router.put('/students/:id/status', manage.setStudentStatus);

// Mentor + sesi live + chat (group_url)
router.get('/mentors', adminController.listMentors);
router.post('/mentors', manage.createMentor);
router.get('/mentors/:id', manage.getMentor);
router.put('/mentors/:id', manage.updateMentor);
router.put('/mentors/:id/active', manage.setMentorActive);
router.get('/mentor-sessions', manage.listSessions);
router.post('/mentor-sessions', manage.createSession);
router.put('/mentor-sessions/:id', manage.updateSession);
router.delete('/mentor-sessions/:id', manage.deleteSession);

// Materi (link) + alur review konten
router.get('/materials', content.listMaterials);
router.post('/materials', content.createMaterial);
router.get('/materials/:id', content.getMaterial);
router.put('/materials/:id', content.updateMaterial);
router.delete('/materials/:id', content.deleteMaterial);
router.post('/materials/:id/review', content.reviewMaterial);
router.post('/materials/:id/publish', content.publishMaterial);
router.post('/materials/:id/unpublish', content.unpublishMaterial);
router.get('/content-review', content.listContentReview);

// Video (link)
router.get('/videos', content.listVideos);
router.post('/videos', content.createVideo);
router.put('/videos/:id', content.updateVideo);
router.delete('/videos/:id', content.deleteVideo);

// Pembayaran (pesanan langganan, hanya dibaca)
router.get('/orders', manage.listOrders);

// Tryout dan soal
router.get('/tryouts', adminTryoutController.listTryouts);
router.post('/tryouts', adminTryoutController.createTryout);
router.put('/tryouts/:id', adminTryoutController.updateTryout);
router.delete('/tryouts/:id', adminTryoutController.deleteTryout);
router.get('/tryouts/:id/questions', adminTryoutController.listQuestions);
router.post('/tryouts/:id/questions', adminTryoutController.createQuestion);
router.put('/questions/:id', adminTryoutController.updateQuestion);
router.delete('/questions/:id', adminTryoutController.deleteQuestion);

module.exports = router;
