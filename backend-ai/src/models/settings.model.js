const pool = require('../config/database');

const DEFAULT_NOTIFICATIONS = { info: true, reminder: false, promo: true, online_class: true };
const NOTIFICATION_KEYS = Object.keys(DEFAULT_NOTIFICATIONS);

async function getAccountSettings(userId) {
  const [rows] = await pool.query(
    `SELECT u.is_premium, p.full_name, p.university, p.profile_picture
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  return rows[0] || null;
}

async function getNotificationSettings(userId) {
  const [rows] = await pool.query(
    `SELECT info, reminder, promo, online_class
     FROM user_notification_settings
     WHERE user_id = ?`,
    [userId]
  );
  if (rows.length === 0) return { ...DEFAULT_NOTIFICATIONS };

  const r = rows[0];
  return {
    info: Boolean(r.info),
    reminder: Boolean(r.reminder),
    promo: Boolean(r.promo),
    online_class: Boolean(r.online_class),
  };
}

async function saveNotificationSettings(userId, s) {
  await pool.query(
    `INSERT INTO user_notification_settings (user_id, info, reminder, promo, online_class)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE info = ?, reminder = ?, promo = ?, online_class = ?`,
    [userId, s.info, s.reminder, s.promo, s.online_class, s.info, s.reminder, s.promo, s.online_class]
  );
}

module.exports = {
  DEFAULT_NOTIFICATIONS,
  NOTIFICATION_KEYS,
  getAccountSettings,
  getNotificationSettings,
  saveNotificationSettings,
};