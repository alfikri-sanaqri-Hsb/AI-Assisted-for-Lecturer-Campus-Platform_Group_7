const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const adminController = require('../controllers/admin.controller');
const adminTryoutController = require('../controllers/admin.tryout.controller');
const content = require('../controllers/admin.content.controller');
const manage = require('../controllers/admin.manage.controller');
const web = require('../controllers/admin.web.controller');

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
router.put('/questions/:id', web.updateQuestion);
router.delete('/questions/:id', web.deleteQuestion);

// ---------- fix8: penugasan mentor ke siswa ----------
router.get('/mentors/:id/students', web.listMentorStudents);
router.post('/mentors/:id/students', web.assignStudent);
router.delete('/mentors/:id/students/:studentId', web.unassignStudent);
router.get('/mentors/:id/schedules', web.listSchedulesByMentor);

// ---------- fix8: izin / status / profil mentor ----------
router.patch('/mentors/:id/permissions', web.updateMentorPermissions);
router.patch('/mentors/:id/status', web.updateMentorStatus);
router.delete('/mentors/:id', web.deleteMentor);
router.get('/mentors/:id/profile', web.getMentorProfile);
router.put('/mentors/:id/profile', web.updateMentorProfile);

// ---------- fix8: siswa (lengkapi adapter) ----------
router.get('/students/:id', web.getStudentDetail);
router.post('/students', web.createStudent);
router.put('/students/:id', web.updateStudent);
router.delete('/students/:id', web.deleteStudent);

// ---------- fix8: bank soal mandiri ----------
// (PUT dan DELETE /questions/:id TIDAK ada di sini — keduanya sudah diganti
//  handler-nya di Langkah 3b, supaya tidak terdaftar dua kali.)
router.get('/questions', web.listQuestions);
router.get('/questions/:id', web.getQuestion);
router.post('/questions', web.createQuestion);
router.patch('/questions/:id/status', web.setQuestionStatus);

// ---------- fix8: paket tryout (status + subtes) ----------
router.get('/tryouts/:id', web.getTryoutDetail);
router.patch('/tryouts/:id/status', web.setTryoutStatus);
router.post('/tryouts/:id/request-withdrawal', web.requestWithdrawal);
router.get('/tryouts/:id/subtests', web.listSubtests);
router.post('/tryouts/:id/subtests', web.createSubtest);
router.put('/tryouts/:id/subtests/:subtestId', web.updateSubtest);
router.delete('/tryouts/:id/subtests/:subtestId', web.deleteSubtest);

// ---------- fix8: jadwal ----------
// PENTING: /schedules/check-conflicts HARUS di atas /schedules/:id,
// kalau tidak 'check-conflicts' dibaca sebagai :id.
router.get('/schedules/check-conflicts', web.checkConflicts);
router.get('/schedules', web.listSchedules);
router.get('/schedules/:id', web.getSchedule);
router.post('/schedules', web.createSchedule);
router.put('/schedules/:id', web.updateSchedule);
router.delete('/schedules/:id', web.deleteSchedule);

// ---------- fix8: materi (status ala web) ----------
router.patch('/materials/:id/status', web.setMaterialStatus);

// ---------- fix8: pengaturan admin + log audit ----------
router.get('/settings', web.getSettings);
router.put('/settings', web.updateSettings);
router.get('/audit-logs', web.listAuditLogs);
router.post('/audit-logs', web.createAuditLog);

module.exports = router;
