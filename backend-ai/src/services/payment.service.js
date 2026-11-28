/**
 * Penyedia pembayaran: Midtrans Snap. Tanpa library tambahan (fetch bawaan Node + crypto).
 * Kunci rahasia (MIDTRANS_SERVER_KEY) hanya dibaca dari .env di server.
 * Sandbox (uji coba, uang tidak sungguhan) aktif selama MIDTRANS_IS_PRODUCTION bukan "true".
 */
const crypto = require('crypto');

const isProduction = () => process.env.MIDTRANS_IS_PRODUCTION === 'true';
const serverKey = () => process.env.MIDTRANS_SERVER_KEY || '';
const snapUrl = () => (isProduction() ? 'https://app.midtrans.com/snap/v1/transactions' : 'https://app.sandbox.midtrans.com/snap/v1/transactions');
const statusUrl = (id) => `${isProduction() ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com'}/v2/${encodeURIComponent(id)}/status`;

const isEnabled = () => (process.env.PAYMENT_MODE || 'simulation') === 'midtrans';
const authHeader = () => `Basic ${Buffer.from(`${serverKey()}:`).toString('base64')}`;

// ID pesanan di Midtrans = "SAL-<id pesanan>" (unik, mudah dikembalikan ke id kita)
const toGatewayOrderId = (orderId) => `SAL-${orderId}`;
function fromGatewayOrderId(gatewayId) {
  const m = /^SAL-(\d+)$/.exec(String(gatewayId || ''));
  return m ? Number(m[1]) : null;
}

async function callMidtrans(url, options) {
  const res = await fetch(url, { ...options, headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: authHeader(), ...(options && options.headers) } });
  const json = await res.json().catch(() => null);
  if (!res.ok && !(json && json.status_code)) {
    const err = new Error('Penyedia pembayaran tidak merespons dengan benar');
    err.statusCode = 502;
    throw err;
  }
  return json;
}

// Membuat transaksi Snap -> { token, redirect_url }
async function createSnapTransaction({ order, customer }) {
  if (!serverKey()) {
    const err = new Error('Pembayaran belum dikonfigurasi di server (MIDTRANS_SERVER_KEY kosong)');
    err.statusCode = 503;
    throw err;
  }
  const body = {
    transaction_details: { order_id: toGatewayOrderId(order.id), gross_amount: order.amount },
    item_details: [{ id: `premium-${order.duration_months}`, price: order.amount, quantity: 1, name: String(order.plan_name).slice(0, 50) }],
    customer_details: { email: customer.email, first_name: String(customer.name || 'Siswa').slice(0, 50) },
  };
  const json = await callMidtrans(snapUrl(), { method: 'POST', body: JSON.stringify(body) });
  if (!json || !json.token || !json.redirect_url) {
    const err = new Error('Gagal membuat tautan pembayaran');
    err.statusCode = 502;
    throw err;
  }
  return { token: json.token, redirect_url: json.redirect_url };
}

// Cek status langsung ke Midtrans (dipakai tombol "Cek status pembayaran")
async function getTransactionStatus(orderId) {
  return callMidtrans(statusUrl(toGatewayOrderId(orderId)), { method: 'GET' });
}

// signature_key = SHA512(order_id + status_code + gross_amount + serverKey)
function verifySignature(payload) {
  if (!payload || !serverKey() || typeof payload.signature_key !== 'string') return false;
  const expected = crypto.createHash('sha512')
    .update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey()}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(payload.signature_key);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// 'paid' | 'failed' | 'pending'
function mapStatus(payload) {
  const t = payload && payload.transaction_status;
  if (t === 'settlement') return 'paid';
  if (t === 'capture') return payload.fraud_status === 'accept' ? 'paid' : 'pending';
  if (['deny', 'cancel', 'expire', 'failure'].includes(t)) return 'failed';
  return 'pending';
}

module.exports = {
  isEnabled, toGatewayOrderId, fromGatewayOrderId, createSnapTransaction, getTransactionStatus, verifySignature, mapStatus,
};
