const test = require('node:test');
const assert = require('node:assert/strict');
const { createRateLimiter } = require('../src/middleware/rateLimit.middleware');

function fakeRes() {
  return {
    code: 200, headers: {}, body: null,
    set(k, v) { this.headers[k] = v; return this; },
    status(c) { this.code = c; return this; },
    json(b) { this.body = b; return this; },
  };
}

test('rate limit: lewat batas -> 429 + Retry-After, kunci lain tidak terpengaruh', () => {
  const limiter = createRateLimiter({ windowMs: 60000, max: 2, keyFn: (r) => r.k });
  let passed = 0;
  const next = () => { passed += 1; };

  limiter({ k: 'a' }, fakeRes(), next);
  limiter({ k: 'a' }, fakeRes(), next);
  const blocked = fakeRes();
  limiter({ k: 'a' }, blocked, next);

  assert.equal(passed, 2);
  assert.equal(blocked.code, 429);
  assert.equal(blocked.body.success, false);
  assert.ok(Number(blocked.headers['Retry-After']) >= 1);

  limiter({ k: 'b' }, fakeRes(), next);
  assert.equal(passed, 3);
});

test('rate limit: jendela waktu habis -> hitungan mulai lagi', async () => {
  const limiter = createRateLimiter({ windowMs: 30, max: 1, keyFn: () => 'x' });
  let passed = 0;
  const next = () => { passed += 1; };
  limiter({}, fakeRes(), next);
  const r = fakeRes();
  limiter({}, r, next);
  assert.equal(r.code, 429);
  await new Promise((ok) => setTimeout(ok, 50));
  limiter({}, fakeRes(), next);
  assert.equal(passed, 2);
});
