const test = require('node:test');
const assert = require('node:assert');
const { parseListQuery, searchClause, escapeLike, buildMeta } = require('../src/utils/listQuery');

const SORT = { terbaru: 'u.id', nama: 'name' };

test('default: halaman 1, per_halaman 10, urut terbaru desc', () => {
  const f = parseListQuery({}, SORT);
  assert.deepStrictEqual(f, { halaman: 1, perHalaman: 10, cari: '', orderColumn: 'u.id', arah: 'desc' });
});

test('urut valid dipetakan ke kolom SQL', () => {
  assert.strictEqual(parseListQuery({ urut: 'nama', arah: 'ASC' }, SORT).orderColumn, 'name');
});

test('urut di luar daftar ditolak 400 (anti SQL injection)', () => {
  assert.throws(() => parseListQuery({ urut: 'id; DROP TABLE users' }, SORT), (e) => e.statusCode === 400);
});

test('per_halaman 0, 101, dan non-angka ditolak', () => {
  for (const v of ['0', '101', 'abc', '-1']) {
    assert.throws(() => parseListQuery({ per_halaman: v }, SORT), (e) => e.statusCode === 400);
  }
});

test('halaman 0 ditolak, arah ngawur ditolak, cari > 100 karakter ditolak', () => {
  assert.throws(() => parseListQuery({ halaman: '0' }, SORT), (e) => e.statusCode === 400);
  assert.throws(() => parseListQuery({ arah: 'naik' }, SORT), (e) => e.statusCode === 400);
  assert.throws(() => parseListQuery({ cari: 'x'.repeat(101) }, SORT), (e) => e.statusCode === 400);
});

test('escapeLike mengamankan % _ |', () => {
  assert.strictEqual(escapeLike('50%_a|b'), '50|%|_a||b');
});

test('searchClause: tiap kata satu kelompok, nilai lewat parameter', () => {
  const s = searchClause('budi 100%', ['a', 'b']);
  assert.strictEqual(s.where.length, 2);
  assert.deepStrictEqual(s.params, ['%budi%', '%budi%', '%100|%%', '%100|%%']);
  assert.ok(!s.where.join('').includes('budi'));
});

test('searchClause kosong kalau tidak ada kata', () => {
  assert.deepStrictEqual(searchClause('   ', ['a']), { where: [], params: [] });
});

test('buildMeta menghitung total_halaman', () => {
  assert.deepStrictEqual(buildMeta({ halaman: 2, perHalaman: 10 }, 25), { halaman: 2, per_halaman: 10, total: 25, total_halaman: 3 });
});
