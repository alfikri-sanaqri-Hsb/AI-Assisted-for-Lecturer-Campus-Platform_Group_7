/**
 * PANEL MENTOR (role mentor): kelola materi MILIK SENDIRI.
 * Mentor hanya bisa membuat draft, mengubah draft, dan mengajukan (submit). Admin yang menyetujui/menerbitkan.
 */
const model = require('../models/admin.content.model');
const handler = require('../utils/handler');
const v = require('../utils/validators');
const { parseListQuery, buildMeta } = require('../utils/listQuery');
const { parseMaterialBody } = require('../utils/contentInput');
const { STATUSES } = require('../utils/contentStatus');
const { applyAction } = require('./admin.content.controller');

const notFound = () => v.bad('Materi tidak ditemukan', 404);

async function ownDraft(id, userId) {
  const m = await model.getMaterial(id);
  if (!m || m.author_id !== userId) throw notFound();
  if (m.status !== 'draft') throw v.bad('Hanya materi berstatus draft yang bisa diubah atau dihapus', 409);
  return m;
}

const summary = handler(async (req, res) => {
  const data = await model.ownSummary(req.user.id);
  res.json({ success: true, message: 'Ringkasan materi saya', data });
});

const listOwn = handler(async (req, res) => {
  const f = parseListQuery(req.query, model.MATERIAL_SORT, { urut: 'diperbarui', arah: 'desc' });
  const status = v.oneOf(req.query.status, 'status', STATUSES);
  const { rows, total } = await model.listMaterials(f, { status, authorId: req.user.id });
  res.json({ success: true, message: 'Materi saya', data: rows, meta: buildMeta(f, total) });
});

const create = handler(async (req, res) => {
  const id = await model.createMaterial(parseMaterialBody(req.body), { status: 'draft', isPublished: 0, authorId: req.user.id });
  res.status(201).json({ success: true, message: 'Draft materi dibuat', data: { id, status: 'draft' } });
});

const update = handler(async (req, res) => {
  const id = v.id(req.params.id);
  await ownDraft(id, req.user.id);
  await model.updateMaterial(id, parseMaterialBody(req.body), req.user.id);
  res.json({ success: true, message: 'Draft materi diperbarui', data: { id } });
});

const submit = handler(async (req, res) => {
  const m = await applyAction(v.id(req.params.id), 'submit', undefined, req.user.id);
  res.json({ success: true, message: 'Materi diajukan untuk ditinjau admin', data: m });
});

const remove = handler(async (req, res) => {
  const id = v.id(req.params.id);
  await ownDraft(id, req.user.id);
  await model.deleteMaterial(id, req.user.id);
  res.json({ success: true, message: 'Draft materi dihapus', data: { id } });
});

module.exports = { summary, listOwn, create, update, submit, remove };
