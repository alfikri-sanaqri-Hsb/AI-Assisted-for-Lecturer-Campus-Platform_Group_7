const test = require('node:test');
const assert = require('node:assert');
const v = require('../src/utils/validators');
const { parseMaterialBody, parseSessionBody, parseMentorBody, parseVideoBody } = require('../src/utils/contentInput');

const code = (c) => (e) => e.statusCode === c;

test('url: hanya http/https', () => {
  assert.strictEqual(v.url('https://youtu.be/abc', 'url'), 'https://youtu.be/abc');
  assert.throws(() => v.url('javascript:alert(1)', 'url'), code(400));
  assert.throws(() => v.url('file:///etc/passwd', 'url'), code(400));
  assert.throws(() => v.url('bukan url', 'url'), code(400));
  assert.strictEqual(v.url('', 'url'), null);
  assert.throws(() => v.url('', 'url', { required: true }), code(400));
});

test('int: batas dan bukan angka ditolak', () => {
  assert.strictEqual(v.int('5', 'x', { min: 1, max: 10 }), 5);
  assert.throws(() => v.int('abc', 'x'), code(400));
  assert.throws(() => v.int(11, 'x', { max: 10 }), code(400));
  assert.throws(() => v.int(1.5, 'x'), code(400));
  assert.strictEqual(v.int(undefined, 'x', { fallback: 60 }), 60);
});

test('id param harus bilangan bulat positif', () => {
  assert.strictEqual(v.id('12'), 12);
  for (const bad of ['0', '-1', 'abc', '1; DROP']) assert.throws(() => v.id(bad), code(400));
});

test('dateTime: format dan tanggal nyata', () => {
  assert.strictEqual(v.dateTime('2026-11-20 19:00', 'x'), '2026-11-20 19:00:00');
  assert.strictEqual(v.dateTime('2026-11-20T19:05:09', 'x'), '2026-11-20 19:05:09');
  assert.throws(() => v.dateTime('2026-02-30 10:00', 'x'), code(400));
  assert.throws(() => v.dateTime('2026-11-20 25:00', 'x'), code(400));
  assert.throws(() => v.dateTime('besok', 'x'), code(400));
});

test('bool dan oneOf', () => {
  assert.strictEqual(v.bool('true', 'x'), 1);
  assert.strictEqual(v.bool(false, 'x'), 0);
  assert.strictEqual(v.bool(undefined, 'x', 1), 1);
  assert.throws(() => v.bool('mungkin', 'x'), code(400));
  assert.strictEqual(v.oneOf('a', 'x', ['a', 'b']), 'a');
  assert.throws(() => v.oneOf('c', 'x', ['a', 'b']), code(400));
});

test('mapDbError: duplikat -> 409', () => {
  assert.strictEqual(v.mapDbError({ code: 'ER_DUP_ENTRY' }).statusCode, 409);
  const other = new Error('x');
  assert.strictEqual(v.mapDbError(other), other);
});

test('materi: link wajib, default angka 0', () => {
  const m = parseMaterialBody({ subject: 'Penalaran Umum', title: 'Modul 1', content_url: 'https://drive.google.com/x' });
  assert.strictEqual(m.estimated_minutes, 0);
  assert.strictEqual(m.description, null);
  assert.throws(() => parseMaterialBody({ subject: 'a', title: 'b' }), code(400));
  assert.throws(() => parseMaterialBody({ subject: 'a', title: 'b', content_url: 'ftp://x' }), code(400));
});

test('video, mentor, sesi: validasi dasar', () => {
  assert.strictEqual(parseVideoBody({ subject: 'a', title: 'b', url: 'https://youtu.be/x' }).is_published, 0);
  assert.throws(() => parseVideoBody({ subject: 'a', title: 'b' }), code(400));
  const mentor = parseMentorBody({ name: 'Rina', group_url: 'https://chat.whatsapp.com/abc' });
  assert.strictEqual(mentor.is_active, 1);
  assert.strictEqual(mentor.user_id, null);
  const s = parseSessionBody({ mentor_id: 1, title: 'Kelas', starts_at: '2026-11-20 19:00', meeting_url: 'https://zoom.us/j/1' });
  assert.strictEqual(s.duration_minutes, 60);
  assert.throws(() => parseSessionBody({ mentor_id: 1, title: 'Kelas', starts_at: 'x' }), code(400));
});
