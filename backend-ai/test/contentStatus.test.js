const test = require('node:test');
const assert = require('node:assert');
const { transition } = require('../src/utils/contentStatus');

test('alur normal: draft -> pending_review -> approved -> published', () => {
  assert.strictEqual(transition('draft', 'submit').status, 'pending_review');
  assert.strictEqual(transition('pending_review', 'approve').status, 'approved');
  const pub = transition('approved', 'publish');
  assert.strictEqual(pub.status, 'published');
  assert.strictEqual(pub.isPublished, 1);
});

test('hanya status published yang membuat is_published = 1', () => {
  for (const [from, action] of [['draft', 'submit'], ['pending_review', 'approve']]) {
    assert.strictEqual(transition(from, action).isPublished, 0);
  }
});

test('reject wajib catatan, kembali ke draft, catatan tersimpan', () => {
  assert.throws(() => transition('pending_review', 'reject', '  '), (e) => e.statusCode === 400);
  const r = transition('pending_review', 'reject', 'Link rusak');
  assert.strictEqual(r.status, 'draft');
  assert.strictEqual(r.reviewNote, 'Link rusak');
});

test('submit membersihkan catatan lama; aksi lain tidak menyentuh catatan', () => {
  assert.strictEqual(transition('draft', 'submit').reviewNote, null);
  assert.strictEqual(transition('pending_review', 'approve').reviewNote, undefined);
});

test('loncat status ditolak 409 (draft tidak bisa langsung publish)', () => {
  assert.throws(() => transition('draft', 'publish'), (e) => e.statusCode === 409);
  assert.throws(() => transition('published', 'approve'), (e) => e.statusCode === 409);
  assert.throws(() => transition('approved', 'submit'), (e) => e.statusCode === 409);
});

test('unpublish: published -> draft, is_published 0', () => {
  const r = transition('published', 'unpublish');
  assert.strictEqual(r.status, 'draft');
  assert.strictEqual(r.isPublished, 0);
});

test('aksi tidak dikenal ditolak 400', () => {
  assert.throws(() => transition('draft', 'hapus'), (e) => e.statusCode === 400);
});
