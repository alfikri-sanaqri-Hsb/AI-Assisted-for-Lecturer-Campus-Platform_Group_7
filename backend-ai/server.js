/**
 * MAIN SERVER - EXPRESS
 * Tempat setup middleware, routes, lalu menjalankan server
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const materialRoutes = require('./src/routes/material.routes');
const tryoutRoutes = require('./src/routes/tryout.routes');
const progressRoutes = require('./src/routes/progress.routes');
const errorHandler = require('./src/middleware/error.middleware');

// Mengimpor database agar koneksi dicek saat server start
require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS: izinkan request dari frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 2. Membaca body JSON dari request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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