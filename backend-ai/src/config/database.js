/**
 * =========================================
 * DATABASE CONNECTION POOL
 * =========================================
 * File ini membuat koneksi ke MySQL dengan connection pooling
 * Pooling = menyediakan beberapa koneksi siap pakai
 * Lebih cepat & efisien dibanding buat koneksi baru tiap request
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Buat connection pool
 * Pool ini akan disimpan di memory dan digunakan untuk semua request
 */
const pool = mysql.createPool({
  // Database host (localhost = komputer lokal)
  host: process.env.DB_HOST || 'localhost',
  
  // Username MySQL (biasanya root untuk local development)
  user: process.env.DB_USER || 'root',
  
  // Password MySQL (kosong kalau tidak ada password)
  password: process.env.DB_PASSWORD || '',
  
  // Nama database yang akan digunakan
  database: process.env.DB_NAME || 'sahabat_alfary',
  
  // Port MySQL (default 3306)
  port: process.env.DB_PORT || 3306,
  
  /**
   * waitForConnections: true
   * Jika semua koneksi di pool sedang dipakai (10 koneksi)
   * Request baru akan menunggu sampai ada yang bebas
   * Jangan langsung error
   */
  waitForConnections: true,
  
  /**
   * connectionLimit: 10
   * Maksimal 10 koneksi aktif di pool sekaligus
   * Kalau ada request ke-11, dia akan menunggu
   * Nilai ini bisa di-adjust sesuai kebutuhan
   */
  connectionLimit: 10,
  
  /**
   * queueLimit: 0
   * Berapa request yang boleh menunggu
   * 0 = unlimited (bisa banyak yang menunggu)
   */
  queueLimit: 0,
  
  /**
   * enableKeepAlive: true
   * Menjaga koneksi tetap hidup saat idle
   * Mencegah "connection lost" error
   */
  enableKeepAlive: true,
  
  /**
   * keepAliveInitialDelayMs: 0
   * Seberapa lama sebelum mulai keep-alive
   */
  keepAliveInitialDelayMs: 0
});

/**
 * TEST KONEKSI SAAT STARTUP
 * Jika database tidak bisa di-connect, aplikasi akan error dengan pesan jelas
 * Ini lebih baik daripada error saat user request
 */
pool
  .getConnection()
  .then(connection => {
    console.log('\n✅ Database Connection Pool initialized successfully');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🖥️  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`👤 User: ${process.env.DB_USER}\n`);
    connection.release(); // Lepas koneksi setelah test
  })
  .catch(error => {
    console.error('\n❌ Failed to initialize database connection pool:');
    console.error(`Error: ${error.message}`);
    console.error('\nPastikan:');
    console.error('1. MySQL server sudah running');
    console.error(`2. Database "${process.env.DB_NAME}" sudah dibuat`);
    console.error(`3. Kredensial di .env sudah benar\n`);
    process.exit(1); // Stop aplikasi jika database error
  });

/**
 * EXPORT POOL
 * Pool ini dipakai di semua model files untuk query
 */
module.exports = pool;