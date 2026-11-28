const test = require('node:test');
const assert = require('node:assert/strict');

const put = (rel, exports) => { const p = require.resolve(rel); require.cache[p] = { id: p, filename: p, loaded: true, exports }; };
const state = { configured: true, uploaded: null, profile: null };
put('../src/services/upload.service', {
  isConfigured: () => state.configured,
  uploadBuffer: async (buf, opt) => { state.uploaded = opt; return { secure_url: 'https://res.cloudinary.com/x/y.png', public_id: 'sahabat-alfary/p/1', bytes: buf.length }; },
});
put('../src/models/user.model', { updateUserProfile: async (id, f) => { state.profile = { id, f }; return 1; } });

const { uploadFile } = require('../src/controllers/upload.controller');
const { detect } = require('../src/utils/fileSignature');

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(20)]);
const PDF = Buffer.from('%PDF-1.7\n....');
const EXE = Buffer.from('MZ\x90\x00\x03\x00\x00\x00');

const call = (req) => new Promise((resolve) => {
  const res = { code: 200, status(c) { this.code = c; return this; }, json(b) { resolve({ status: this.code, body: b }); } };
  uploadFile({ query: {}, user: { id: 5, role: 'student' }, ...req }, res, (e) => resolve({ status: 500, error: e.message }));
});
const file = (buffer, originalname) => ({ buffer, originalname });

test('deteksi tipe dari isi file + ekstensi harus cocok', () => {
  assert.equal(detect(PNG, 'a.png').kind, 'png');
  assert.equal(detect(PDF, 'materi.PDF').resource, 'raw');
  assert.equal(detect(PNG, 'a.pdf'), null);      // isi PNG tapi bernama .pdf
  assert.equal(detect(EXE, 'virus.png'), null);  // exe menyamar jadi png
  assert.equal(detect(Buffer.from('ab'), 'a.png'), null);
});

test('purpose tidak dikenal -> 400', async () => {
  assert.equal((await call({ query: { purpose: 'x' }, file: file(PNG, 'a.png') })).status, 400);
});

test('siswa tidak boleh mengunggah materi -> 403', async () => {
  assert.equal((await call({ query: { purpose: 'material' }, file: file(PDF, 'a.pdf') })).status, 403);
});

test('layanan belum dikonfigurasi -> 503', async () => {
  state.configured = false;
  assert.equal((await call({ query: { purpose: 'profile' }, file: file(PNG, 'a.png') })).status, 503);
  state.configured = true;
});

test('tanpa file -> 400; file palsu -> 415', async () => {
  assert.equal((await call({ query: { purpose: 'profile' } })).status, 400);
  assert.equal((await call({ query: { purpose: 'profile' }, file: file(EXE, 'a.png') })).status, 415);
});

test('foto profil: hanya gambar, URL langsung disimpan ke profil', async () => {
  assert.equal((await call({ query: { purpose: 'profile' }, file: file(PDF, 'a.pdf') })).status, 415);
  const r = await call({ query: { purpose: 'profile' }, file: file(PNG, 'foto.png') });
  assert.equal(r.status, 201);
  assert.equal(r.body.data.url, 'https://res.cloudinary.com/x/y.png');
  assert.deepEqual(state.profile, { id: 5, f: { profile_picture: 'https://res.cloudinary.com/x/y.png' } });
  assert.deepEqual(state.uploaded, { folder: 'profile', resource: 'image' });
});

test('mentor mengunggah PDF materi -> resource raw, profil tidak diubah', async () => {
  state.profile = null;
  const r = await call({ user: { id: 9, role: 'mentor' }, query: { purpose: 'material' }, file: file(PDF, 'modul.pdf') });
  assert.equal(r.status, 201); assert.equal(r.body.data.resource_type, 'raw');
  assert.equal(state.profile, null);
});
