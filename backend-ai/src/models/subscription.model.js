const crypto = require('crypto');
const pool = require('../config/database');

// Harga dari Figma. Isi 1 dan 6 bulan sesuai desain.
const PLANS = {
  1: { name: 'Sahabat Premium 1 Bulan', amount: 0 },      // TODO isi harga dari Figma
  3: { name: 'Sahabat Premium 3 Bulan', amount: 175000 },
  6: { name: 'Sahabat Premium 6 Bulan', amount: 0 },      // TODO isi harga dari Figma
};

const PAYMENT_METHODS = ['qris', 'kartu_debit_kredit'];

function getPlans() {
  return Object.entries(PLANS).map(([months, p]) => ({
    duration_months: Number(months),
    plan_name: p.name,
    amount: p.amount,
  }));
}

function getPlan(months) {
  return PLANS[months] || null;
}

function buildRequestHash(months, paymentMethod) {
  return crypto.createHash('sha256').update(`${months}|${paymentMethod}`).digest('hex');
}

async function findByIdempotencyKey(userId, key) {
  const [[row]] = await pool.query(
    'SELECT * FROM subscription_orders WHERE user_id = ? AND idempotency_key = ?',
    [userId, key]
  );
  return row || null;
}

async function findOrderById(orderId, userId) {
  const [[row]] = await pool.query(
    'SELECT * FROM subscription_orders WHERE id = ? AND user_id = ?',
    [orderId, userId]
  );
  return row || null;
}

async function createOrder({ userId, plan, months, paymentMethod, idempotencyKey, requestHash }) {
  const [result] = await pool.query(
    `INSERT INTO subscription_orders
      (user_id, plan_name, duration_months, amount, payment_method, status, idempotency_key, request_hash)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [userId, plan.name, months, plan.amount, paymentMethod, idempotencyKey, requestHash]
  );
  return result.insertId;
}

// Simulasi callback dari gateway. Hanya pesanan 'pending' yang berubah,
// jadi memanggil ulang tidak menambah durasi premium dua kali.
async function settleOrder(orderId, userId, outcome) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[order]] = await conn.query(
      'SELECT * FROM subscription_orders WHERE id = ? AND user_id = ? FOR UPDATE',
      [orderId, userId]
    );
    if (!order) {
      await conn.rollback();
      return { result: 'NOT_FOUND', order: null };
    }
    if (order.status !== 'pending') {
      await conn.rollback();
      return { result: 'UNCHANGED', order };
    }

    if (outcome === 'failed') {
      await conn.query("UPDATE subscription_orders SET status = 'failed' WHERE id = ?", [orderId]);
    } else {
      await conn.query(
        "UPDATE subscription_orders SET status = 'paid', paid_at = NOW() WHERE id = ?",
        [orderId]
      );
      await conn.query(
        `UPDATE users
         SET is_premium = 1,
             premium_until = DATE_ADD(GREATEST(NOW(), COALESCE(premium_until, NOW())), INTERVAL ? MONTH)
         WHERE id = ?`,
        [order.duration_months, userId]
      );
    }

    await conn.commit();
    const updated = await findOrderById(orderId, userId);
    return { result: 'UPDATED', order: updated };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function expireOldPremium() {
  await pool.query(
    'UPDATE users SET is_premium = 0 WHERE is_premium = 1 AND premium_until IS NOT NULL AND premium_until < NOW()'
  );
}

async function getStatus(userId) {
  const [[user]] = await pool.query(
    'SELECT is_premium, premium_until FROM users WHERE id = ?',
    [userId]
  );
  const [[lastOrder]] = await pool.query(
    `SELECT id, plan_name, duration_months, amount, status, paid_at
     FROM subscription_orders WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
    [userId]
  );
  return { user, lastOrder: lastOrder || null };
}

module.exports = {
  PAYMENT_METHODS,
  getPlans,
  getPlan,
  buildRequestHash,
  findByIdempotencyKey,
  findOrderById,
  createOrder,
  settleOrder,
  expireOldPremium,
  getStatus,
};