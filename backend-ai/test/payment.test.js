const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

process.env.MIDTRANS_SERVER_KEY = 'SB-Mid-server-TESTKEY';
process.env.PAYMENT_MODE = 'midtrans';

const put = (rel, exports) => { const p = require.resolve(rel); require.cache[p] = { id: p, filename: p, loaded: true, exports }; };
const calls = { settle: [], link: null, snap: 0, status: null };
const order = { id: 12, user_id: 3, amount: 175000, status: 'pending', plan_name: 'Sahabat Premium 3 Bulan', duration_months: 3, payment_url: null };
put('../src/config/database', { query: async () => [[]] });
put('../src/models/subscription.model', {
  PAYMENT_METHODS: ['qris', 'kartu_debit_kredit'],
  getPlan: () => ({ name: 'Sahabat Premium 3 Bulan', amount: 175000 }),
  buildRequestHash: () => 'h',
  findByIdempotencyKey: async () => null,
  createOrder: async () => 12,
  findOrderById: async () => ({ ...order }),
  findOrderByIdAny: async (id) => (id === 12 ? { ...order } : null),
  getCustomer: async () => ({ email: 's@x.id', name: 'Siswa' }),
  setPaymentLink: async (id, t, u) => { calls.link = { id, t, u }; order.payment_url = u; },
  settleOrder: async (id, uid, outcome) => { calls.settle.push([id, uid, outcome]); return { result: 'UPDATED', order }; },
  getStatus: async () => ({ user: { is_premium: 1, premium_until: null } }),
});

const payment = require('../src/services/payment.service');
payment.createSnapTransaction = async () => { calls.snap += 1; return { token: 'tok', redirect_url: 'https://app.sandbox.midtrans.com/snap/v4/redirection/tok' }; };
payment.getTransactionStatus = async () => calls.status;

const subs = require('../src/controllers/subscription.controller');
const hook = require('../src/controllers/payment.controller');

const run = (fn, req) => new Promise((resolve) => {
  const res = { code: 200, status(c) { this.code = c; return this; }, json(b) { resolve({ status: this.code, body: b }); } };
  fn({ params: {}, query: {}, body: {}, user: { id: 3, role: 'student' }, get: () => 'idem-key-12345', ...req }, res, (e) => resolve({ status: e.statusCode || 500, error: e.message }));
});
const sign = (p) => ({ ...p, signature_key: crypto.createHash('sha512').update(`${p.order_id}${p.status_code}${p.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex') });

test('id pesanan gateway <-> id kita', () => {
  assert.equal(payment.toGatewayOrderId(12), 'SAL-12');
  assert.equal(payment.fromGatewayOrderId('SAL-12'), 12);
  assert.equal(payment.fromGatewayOrderId('payment_notif_test_abc'), null);
});

test('tanda tangan: benar lolos, diubah/palsu ditolak', () => {
  const good = sign({ order_id: 'SAL-12', status_code: '200', gross_amount: '175000.00' });
  assert.equal(payment.verifySignature(good), true);
  assert.equal(payment.verifySignature({ ...good, gross_amount: '1.00' }), false);
  assert.equal(payment.verifySignature({ ...good, signature_key: 'abc' }), false);
  assert.equal(payment.verifySignature({ order_id: 'SAL-12' }), false);
});

test('pemetaan status Midtrans', () => {
  assert.equal(payment.mapStatus({ transaction_status: 'settlement' }), 'paid');
  assert.equal(payment.mapStatus({ transaction_status: 'capture', fraud_status: 'accept' }), 'paid');
  assert.equal(payment.mapStatus({ transaction_status: 'capture', fraud_status: 'challenge' }), 'pending');
  assert.equal(payment.mapStatus({ transaction_status: 'pending' }), 'pending');
  for (const t of ['deny', 'cancel', 'expire', 'failure']) assert.equal(payment.mapStatus({ transaction_status: t }), 'failed');
});

test('checkout mode midtrans: pesanan dibuat + payment_url dikembalikan', async () => {
  const r = await run(subs.checkout, { body: { duration_months: 3, payment_method: 'qris' } });
  assert.equal(r.status, 201);
  assert.match(r.body.data.payment_url, /^https:\/\/app\.sandbox\.midtrans\.com/);
  assert.equal(calls.snap, 1);
});

test('webhook: tanda tangan salah -> 403, pesanan tidak berubah', async () => {
  const r = await run(hook.midtransNotification, { body: { order_id: 'SAL-12', status_code: '200', gross_amount: '175000.00', transaction_status: 'settlement', signature_key: 'palsu' }, user: undefined });
  assert.equal(r.status, 403); assert.equal(calls.settle.length, 0);
});

test('webhook settlement sah -> pesanan lunas (tanpa filter pemilik)', async () => {
  const r = await run(hook.midtransNotification, { body: sign({ order_id: 'SAL-12', status_code: '200', gross_amount: '175000.00', transaction_status: 'settlement' }) });
  assert.equal(r.status, 200);
  assert.deepEqual(calls.settle.at(-1), [12, null, 'success']);
});

test('webhook: jumlah tidak cocok ditolak; pesanan asing / tes dashboard dijawab 200', async () => {
  const bad = await run(hook.midtransNotification, { body: sign({ order_id: 'SAL-12', status_code: '200', gross_amount: '1000.00', transaction_status: 'settlement' }) });
  assert.equal(bad.status, 400);
  const n = calls.settle.length;
  const test_ = await run(hook.midtransNotification, { body: sign({ order_id: 'payment_notif_test_1', status_code: '200', gross_amount: '1.00', transaction_status: 'settlement' }) });
  assert.equal(test_.status, 200); assert.equal(calls.settle.length, n);
});

test('webhook expire -> failed; status pending tidak mengubah apa pun', async () => {
  await run(hook.midtransNotification, { body: sign({ order_id: 'SAL-12', status_code: '407', gross_amount: '175000.00', transaction_status: 'expire' }) });
  assert.equal(calls.settle.at(-1)[2], 'failed');
  const n = calls.settle.length;
  await run(hook.midtransNotification, { body: sign({ order_id: 'SAL-12', status_code: '201', gross_amount: '175000.00', transaction_status: 'pending' }) });
  assert.equal(calls.settle.length, n);
});

test('verify: tanya Midtrans lalu lunaskan; 404 Midtrans = belum ada transaksi', async () => {
  calls.status = { status_code: '404' };
  let n = calls.settle.length;
  await run(subs.verify, { params: { id: '12' } });
  assert.equal(calls.settle.length, n);
  calls.status = { status_code: '200', transaction_status: 'settlement', gross_amount: '175000.00' };
  const r = await run(subs.verify, { params: { id: '12' } });
  assert.equal(r.status, 200);
  assert.deepEqual(calls.settle.at(-1), [12, 3, 'success']);
});
