const express = require('express');
const router = express.Router();

// Endpoint contoh untuk mendapatkan daftar materi kursus
router.get('/materi', (req, res) => {
  res.json({
    message: 'Berhasil mengambil data daftar materi Sahabat Alfary',
    data: [
      { id: 1, title: 'Pengenalan Pemrograman Dasar', kategori: 'Teknologi' },
      { id: 2, title: 'Matematika Logika & Penalaran', kategori: 'Akademik' }
    ]
  });
});

module.exports = router;