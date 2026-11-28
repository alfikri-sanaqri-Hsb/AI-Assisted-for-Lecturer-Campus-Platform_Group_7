const model = require('../models/subscription.model');
const payment = require('../services/payment.service');

// POST /api/payments/midtrans/notification — dipanggil server Midtrans (tanpa token login).
// Keamanan: tanda tangan SHA-512 wajib cocok, jumlah harus sama dengan pesanan, dan hanya pesanan 'pending' yang berubah.
async function midtransNotification(req, res, next) {
  try {
    const p = req.body || {};
    if (!payment.verifySignature(p)) {
      return res.status(403).json({ success: false, message: 'Tanda tangan tidak valid' });
    }
    const orderId = payment.fromGatewayOrderId(p.order_id);
    const order = orderId ? await model.findOrderByIdAny(orderId) : null;
    // Pesanan tidak dikenal (mis. tes dari dashboard Midtrans): jawab 200 agar Midtrans berhenti mengulang
    if (!order) return res.status(200).json({ success: true, message: 'Pesanan tidak dikenal, diabaikan' });

    if (Number(p.gross_amount) !== order.amount) {
      return res.status(400).json({ success: false, message: 'Jumlah pembayaran tidak sesuai pesanan' });
    }
    const outcome = payment.mapStatus(p);
    if (outcome !== 'pending') {
      await model.settleOrder(orderId, null, outcome === 'paid' ? 'success' : 'failed');
    }
    return res.status(200).json({ success: true, message: 'OK' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { midtransNotification };
