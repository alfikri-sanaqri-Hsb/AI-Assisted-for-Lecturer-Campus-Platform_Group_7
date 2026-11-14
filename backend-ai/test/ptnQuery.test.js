const test = require('node:test');
const assert = require('node:assert/strict');
const { parseProgramQuery, escapeLike } = require('../src/utils/ptnQuery');

const fails = (q, re) => assert.throws(() => parseProgramQuery(q), (e) => e.statusCode === 400 && re.test(e.message));

test('default saat query kosong', () => {
  const r = parseProgramQuery({});
  assert.equal(r.halaman, 1); assert.equal(r.perHalaman, 10);
  assert.equal(r.orderColumn, 'score_avg'); assert.equal(r.arah, 'desc');
});
test('teks angka diubah jadi angka', () => {
  const r = parseProgramQuery({ halaman: '2', per_halaman: '25' });
  assert.equal(r.halaman, 2); assert.equal(r.perHalaman, 25);
});
test('halaman=abc ditolak 400', () => fails({ halaman: 'abc' }, /halaman/));
test('halaman=0 dan negatif ditolak', () => { fails({ halaman: '0' }, /halaman/); fails({ halaman: '-1' }, /halaman/); });
test('per_halaman di luar 1-100 ditolak', () => { fails({ per_halaman: '1000000' }, /per_halaman/); fails({ per_halaman: '0' }, /per_halaman/); });
test('urut harus dari daftar tetap (anti SQL injection)', () => {
  fails({ urut: 'score_avg; DROP TABLE users' }, /urut/);
  fails({ urut: 'toString' }, /urut/);
  assert.equal(parseProgramQuery({ urut: 'prodi' }).orderColumn, 'program_name');
});
test('arah hanya asc/desc', () => { fails({ arah: 'sideways' }, /arah/); assert.equal(parseProgramQuery({ arah: 'ASC' }).arah, 'asc'); });
test('cari maksimal 100 karakter', () => fails({ cari: 'x'.repeat(101) }, /cari/));
test('jenjang divalidasi', () => { fails({ jenjang: 'S3' }, /jenjang/); assert.equal(parseProgramQuery({ jenjang: 's1' }).jenjang, 'S1'); });
test('skor_maks < skor_min ditolak', () => fails({ skor_min: '600', skor_maks: '500' }, /skor_maks/));
test('escapeLike: % dan _ jadi teks biasa', () => {
  assert.equal(escapeLike('100%_a|b'), '100|%|_a||b');
});
