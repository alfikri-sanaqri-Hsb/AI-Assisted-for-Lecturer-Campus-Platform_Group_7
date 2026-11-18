/** ADMIN: materi (link), alur review konten, dan video (link) */
const model = require('../models/admin.content.model');
const handler = require('../utils/handler');
const v = require('../utils/validators');
const { parseListQuery, buildMeta } = require('../utils/listQuery');
const { parseMaterialBody, parseVideoBody } = require('../utils/contentInput');
const { STATUSES, transition } = require('../utils/contentStatus');

const notFound = (what) => v.bad(`${what} tidak ditemukan`, 404);

async function applyAction(id, action, note, authorId) {
  const m = await model.getMaterial(id);
  if (!m || (authorId && m.author_id !== authorId)) throw notFound('Materi');
  const next = transition(m.status, action, note);
  const changed = await model.setMaterialStatus(id, m.status, next);
  if (!changed) throw v.bad('Status materi baru saja berubah, muat ulang lalu coba lagi', 409);
  return model.getMaterial(id);
}

/* ---------- MATERI ---------- */

// GET /api/admin/materials?status=&subject=&cari=&urut=&arah=&halaman=&per_halaman=
const listMaterials = handler(async (req, res) => {
  const f = parseListQuery(req.query, model.MATERIAL_SORT);
  const filter = {
    status: v.oneOf(req.query.status, 'status', STATUSES),
    subject: v.str(req.query.subject, 'subject', { max: 100 }) || undefined,
  };
  const { rows, total } = await model.listMaterials(f, filter);
  res.json({ success: true, message: 'Daftar materi', data: rows, meta: buildMeta(f, total) });
});

// GET /api/admin/content-review  (default: yang menunggu peninjauan)
const listContentReview = handler(async (req, res) => {
  const f = parseListQuery(req.query, model.MATERIAL_SORT, { urut: 'diperbarui', arah: 'asc' });
  const status = v.oneOf(req.query.status, 'status', STATUSES) || 'pending_review';
  const { rows, total } = await model.listMaterials(f, { status });
  res.json({ success: true, message: 'Antrean peninjauan konten', data: rows, meta: buildMeta(f, total) });
});

const getMaterial = handler(async (req, res) => {
  const m = await model.getMaterial(v.id(req.params.id));
  if (!m) throw notFound('Materi');
  res.json({ success: true, message: 'Detail materi', data: m });
});

// POST /api/admin/materials   admin boleh langsung status "draft" atau "published"
const createMaterial = handler(async (req, res) => {
  const d = parseMaterialBody(req.body);
  const status = v.oneOf(req.body.status, 'status', ['draft', 'published']) || 'draft';
  const id = await model.createMaterial(d, { status, isPublished: status === 'published' ? 1 : 0, authorId: req.user.id });
  res.status(201).json({ success: true, message: 'Materi dibuat', data: { id, status } });
});

const updateMaterial = handler(async (req, res) => {
  const id = v.id(req.params.id);
  const changed = await model.updateMaterial(id, parseMaterialBody(req.body));
  if (!changed) throw notFound('Materi');
  res.json({ success: true, message: 'Materi diperbarui', data: { id } });
});

const deleteMaterial = handler(async (req, res) => {
  const id = v.id(req.params.id);
  if (!(await model.deleteMaterial(id))) throw notFound('Materi');
  res.json({ success: true, message: 'Materi dihapus', data: { id } });
});

// POST /api/admin/materials/:id/review   body: { "decision": "approve" | "reject", "review_note": "..." }
const reviewMaterial = handler(async (req, res) => {
  const decision = v.oneOf(req.body.decision, 'decision', ['approve', 'reject'], { required: true });
  const m = await applyAction(v.id(req.params.id), decision, req.body.review_note);
  res.json({ success: true, message: decision === 'approve' ? 'Materi disetujui' : 'Materi dikembalikan ke mentor', data: m });
});

const publishMaterial = handler(async (req, res) => {
  const m = await applyAction(v.id(req.params.id), 'publish');
  res.json({ success: true, message: 'Materi diterbitkan', data: m });
});

const unpublishMaterial = handler(async (req, res) => {
  const m = await applyAction(v.id(req.params.id), 'unpublish');
  res.json({ success: true, message: 'Materi ditarik dari siswa (kembali ke draft)', data: m });
});

/* ---------- VIDEO ---------- */

const listVideos = handler(async (req, res) => {
  const f = parseListQuery(req.query, model.VIDEO_SORT, { urut: 'urutan', arah: 'asc' });
  const filter = {
    subject: v.str(req.query.subject, 'subject', { max: 100 }) || undefined,
    published: req.query.terbit === undefined ? undefined : v.bool(req.query.terbit, 'terbit'),
  };
  const { rows, total } = await model.listVideos(f, filter);
  res.json({ success: true, message: 'Daftar video', data: rows, meta: buildMeta(f, total) });
});

const createVideo = handler(async (req, res) => {
  const id = await model.createVideo(parseVideoBody(req.body));
  res.status(201).json({ success: true, message: 'Video ditambahkan', data: { id } });
});

const updateVideo = handler(async (req, res) => {
  const id = v.id(req.params.id);
  if (!(await model.updateVideo(id, parseVideoBody(req.body)))) throw notFound('Video');
  res.json({ success: true, message: 'Video diperbarui', data: { id } });
});

const deleteVideo = handler(async (req, res) => {
  const id = v.id(req.params.id);
  if (!(await model.deleteVideo(id))) throw notFound('Video');
  res.json({ success: true, message: 'Video dihapus', data: { id } });
});

module.exports = {
  applyAction,
  listMaterials, listContentReview, getMaterial, createMaterial, updateMaterial, deleteMaterial,
  reviewMaterial, publishMaterial, unpublishMaterial,
  listVideos, createVideo, updateVideo, deleteVideo,
};
