const model = require('../models/subscription.model');

const IDEMPOTENCY_KEY_RE = /^[A-Za-z0-9._-]{8,100}$/;

function formatOrder(o) {
  return {
    order_id: o.id,
    plan_name: o.plan_name,
    duration_months: o.duration_months,
    amount: o.amount,
    payment_method: o.payment_method,
    status: o.status,
    paid_at: o.paid_at,
  };
}

function sendExisting(res, order, requestHash) {
  if (order.request_hash !== requestHash) {
    return res.status(422).json({
      success: false,
      message: 'Idempotency-Key ini sudah dipakai untuk request lain',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Pesanan sudah pernah dibuat dengan key ini',
    data: formatOrder(order),
  });
}

function getPlans(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Daftar paket berhasil diambil',
    data: model.getPlans(),
  });
}

async function getStatus(req, res, next) {
  try {
    await model.expireOldPremium();
    const { user, lastOrder } = await model.getStatus(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Status langganan berhasil diambil',
      data: {
        is_premium: Boolean(user.is_premium),
        premium_until: user.premium_until,
        last_order: lastOrder,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function checkout(req, res, next) {
  try {
    const userId = req.user.id;
    const key = req.get('Idempotency-Key');

    if (!key || !IDEMPOTENCY_KEY_RE.test(key)) {
      return res.status(400).json({
        success: false,
        message: 'Header Idempotency-Key wajib diisi, 8-100 karakter (huruf, angka, titik, strip, garis bawah)',
      });
    }

    const months = Number(req.body.duration_months);
    const paymentMethod = req.body.payment_method;

    const plan = model.getPlan(months);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Durasi paket tidak valid' });
    }
    if (!model.PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Metode pembayaran tidak valid' });
    }

    const requestHash = model.buildRequestHash(months, paymentMethod);

    const existing = await model.findByIdempotencyKey(userId, key);
    if (existing) {
      return sendExisting(res, existing, requestHash);
    }

    try {
      const orderId = await model.createOrder({
        userId,
        plan,
        months,
        paymentMethod,
        idempotencyKey: key,
        requestHash,
      });
      const order = await model.findOrderById(orderId, userId);
      return res.status(201).json({
        success: true,
        message: 'Pesanan dibuat, silakan lakukan pembayaran',
        data: formatOrder(order),
      });
    } catch (err) {
      // Dua request dengan key sama datang bersamaan: yang kalah ambil hasil yang menang.
      if (err.code === 'ER_DUP_ENTRY') {
        const winner = await model.findByIdempotencyKey(userId, key);
        if (winner) return sendExisting(res, winner, requestHash);
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

async function pay(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ success: false, message: 'ID pesanan tidak valid' });
    }

    const outcome = req.body.outcome ?? 'success';
    if (!['success', 'failed'].includes(outcome)) {
      return res.status(400).json({
        success: false,
        message: "outcome harus 'success' atau 'failed'",
      });
    }

    const { result, order } = await model.settleOrder(orderId, req.user.id, outcome);
    if (result === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    const { user } = await model.getStatus(req.user.id);
    const message = result === 'UPDATED'
      ? (outcome === 'success'
        ? 'Pembayaran berhasil (simulasi). Akses premium aktif.'
        : 'Pembayaran gagal (simulasi).')
      : 'Pesanan sudah diproses sebelumnya, status tidak berubah';

    return res.status(200).json({
      success: true,
      message,
      data: {
        ...formatOrder(order),
        is_premium: Boolean(user.is_premium),
        premium_until: user.premium_until,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPlans, getStatus, checkout, pay };