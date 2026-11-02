const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

// Tes koneksi saat server pertama kali jalan
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database terhubung');
    conn.release();
  } catch (err) {
    console.error('❌ Gagal terhubung ke database');
    console.error('   Code   :', err.code || '-');
    console.error('   Errno  :', err.errno || '-');
    console.error('   Pesan  :', err.message || '(kosong)');
    console.error('   Config :', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });
    process.exit(1);
  }
})();

module.exports = pool;