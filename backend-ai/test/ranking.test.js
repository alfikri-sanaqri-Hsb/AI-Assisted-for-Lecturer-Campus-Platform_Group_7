const test = require('node:test');
const assert = require('node:assert/strict');

// Ganti pool database dengan tiruan supaya tes tidak butuh MySQL
const dbPath = require.resolve('../src/config/database');
const calls = [];
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: {
    query: async (sql) => {
      calls.push(sql);
      if (/COUNT\(\*\) AS total FROM users/.test(sql)) return [[{ total: 5 }]];
      return [[
        { user_id: 2, full_name: 'Budi', major: 'TI', points: '10', average_score: '88.5' },
        { user_id: 1, full_name: 'Ani', major: null, points: '7', average_score: '70' },
      ]];
    },
  },
};

const { getRanking } = require('../src/controllers/ranking.controller');

const run = (query, userId = 1) => new Promise((resolve, reject) => {
  const res = { json: (b) => resolve(b) };
  getRanking({ query, user: { id: userId } }, res, (err) => (err ? resolve({ err }) : reject(new Error('next tanpa error'))));
});

test('mode tryout: mengembalikan average_score sebagai angka + data saya', async () => {
  const r = await run({ mode: 'tryout', limit: '20' });
  assert.equal(r.data.mode, 'tryout');
  assert.equal(r.data.top[0].average_score, 88.5);
  assert.equal(r.data.top[0].rank, 1);
  assert.equal(r.data.my_rank, 2);
  assert.equal(r.data.my_average_score, 70);
  assert.equal(r.data.total_users, 5);
  assert.ok(/tryout_attempts/.test(calls[calls.length - 2] + calls[calls.length - 1]));
});

test('mode practice memakai query practice_answers', async () => {
  calls.length = 0;
  await run({ mode: 'practice' });
  assert.ok(calls.some((s) => /AVG\(pa\.is_correct\)/.test(s)));
});

test('tanpa mode = gabungan (perilaku lama), points tetap ada', async () => {
  const r = await run({});
  assert.equal(r.data.mode, 'all');
  assert.equal(r.data.top[0].points, 10);
});

test('mode tidak dikenal -> 400', async () => {
  const r = await run({ mode: 'hacker' });
  assert.equal(r.err.statusCode, 400);
});

test('limit dibatasi 1..100', async () => {
  const r = await run({ limit: '999' });
  assert.ok(r.data.top.length <= 100);
});
