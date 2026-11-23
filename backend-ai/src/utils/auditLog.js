// Helper kecil: catat aksi admin/mentor ke tabel audit_logs.
// Dipanggil dengan await, TAPI tidak pernah melempar error (try/catch di dalam),
// jadi kalau pencatatan gagal, aksi utamanya tetap jalan dan demo tidak rusak.
const pool = require('../config/database');

async function logAdminAction(req, action, targetType, targetId, targetTitle, details) {
  try {
    const rawRole = String((req.user && req.user.role) || 'admin').toUpperCase();
    const role = rawRole === 'MENTOR' ? 'MENTOR' : 'ADMIN';
    // Token JWT hanya berisi id/email/role, jadi nama aktor = email admin yang login.
    const name = (req.user && (req.user.full_name || req.user.name || req.user.email)) || 'Admin';
    await pool.query(
      `INSERT INTO audit_logs (actor_role, actor_name, action, target_type, target_id, target_title, details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [role, String(name), action, targetType, String(targetId), targetTitle || null, details || null]
    );
  } catch (err) {
    console.error('audit log gagal:', err.message);
  }
}

module.exports = { logAdminAction };