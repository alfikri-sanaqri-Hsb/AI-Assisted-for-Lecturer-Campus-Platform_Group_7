/**
 * MAIN SERVER - EXPRESS
 * Tempat setup middleware, routes, lalu menjalankan server
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/config/env.check')();
const securityHeaders = require('./src/middleware/security.middleware');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const materialRoutes = require('./src/routes/material.routes');
const tryoutRoutes = require('./src/routes/tryout.routes');
const progressRoutes = require('./src/routes/progress.routes');
const homeRoutes = require('./src/routes/home.routes');
const rankingRoutes = require('./src/routes/ranking.routes');
const settingsRoutes = require('./src/routes/settings.routes');
const practiceRoutes = require('./src/routes/practice.routes');
const videoRoutes = require('./src/routes/video.routes');
const subscriptionRoutes = require('./src/routes/subscription.routes');
const feedbackRoutes = require('./src/routes/feedback.routes');
const errorHandler = require('./src/middleware/error.middleware');
const mentorRoutes = require('./src/routes/mentor.routes');
const aiRoutes = require('./src/routes/ai.routes');
const ptnRoutes = require('./src/routes/ptn.routes');
const adminRoutes = require('./src/routes/admin.routes');
const mentorPanelRoutes = require('./src/routes/mentor.panel.routes');

// Mengimpor database agar koneksi dicek saat server start
require('./src/config/database');

const app = express();
app.disable('x-powered-by');
// Di belakang proxy/hosting (Render, Railway, Nginx) isi TRUST_PROXY=1 di .env agar IP asli terbaca
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
app.use(securityHeaders);
const PORT = process.env.PORT || 5000;

// 1. CORS: izinkan request dari frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 2. Membaca body JSON dari request
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 3. Logger sederhana: catat setiap request
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Health check untuk mengecek server hidup
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/tryouts', tryoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ptn', ptnRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/panel/mentor', mentorPanelRoutes);

// 4. 404: jika tidak ada route yang cocok
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

// 5. Error handler: WAJIB paling akhir
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}\n`);
});