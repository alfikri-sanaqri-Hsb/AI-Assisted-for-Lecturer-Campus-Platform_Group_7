/**
 * PTN CONTROLLER
 * Urusan HTTP saja: baca request, panggil model, bentuk response.
 */

const ptnModel = require('../models/ptn.model');
const { parseProgramQuery } = require('../utils/ptnQuery');

const MAX_TARGETS = 3;

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// GET /api/ptn/programs?halaman=1&per_halaman=10&cari=informatika&urut=skor&arah=desc
async function listPrograms(req, res, next) {
  try {
    const filter = parseProgramQuery(req.query); // 400 kalau query salah
    const { rows, total } = await ptnModel.listPrograms(filter);
    return res.json({
      success: true,
      message: 'Daftar program studi',
      data: rows,
      meta: {
        halaman: filter.halaman,
        per_halaman: filter.perHalaman,
        total,
        total_halaman: Math.ceil(total / filter.perHalaman),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/ptn/programs/:id
async function getProgram(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) throw httpError(400, 'id tidak valid');
    const program = await ptnModel.getProgramById(id);
    if (!program) throw httpError(404, 'Program studi tidak ditemukan');
    return res.json({ success: true, message: 'Detail program studi', data: program });
  } catch (err) {
    next(err);
  }
}

// GET /api/ptn/targets
async function listTargets(req, res, next) {
  try {
    const data = await ptnModel.listTargets(req.user.id);
    return res.json({ success: true, message: 'Target program studi', data, meta: { max_targets: MAX_TARGETS } });
  } catch (err) {
    next(err);
  }
}

// POST /api/ptn/targets   body: { "program_id": 3 }
async function addTarget(req, res, next) {
  try {
    const programId = Number(req.body && req.body.program_id);
    if (!Number.isInteger(programId) || programId < 1) throw httpError(400, 'program_id wajib berupa angka');

    const program = await ptnModel.getProgramById(programId);
    if (!program) throw httpError(404, 'Program studi tidak ditemukan');

    if ((await ptnModel.countTargets(req.user.id)) >= MAX_TARGETS) {
      throw httpError(422, `Maksimal ${MAX_TARGETS} target program studi`);
    }

    try {
      await ptnModel.addTarget(req.user.id, programId);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') throw httpError(409, 'Program studi ini sudah ada di targetmu');
      throw e;
    }
    const data = await ptnModel.listTargets(req.user.id);
    return res.status(201).json({ success: true, message: 'Target ditambahkan', data });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/ptn/targets/:programId
async function removeTarget(req, res, next) {
  try {
    const programId = Number(req.params.programId);
    if (!Number.isInteger(programId) || programId < 1) throw httpError(400, 'programId tidak valid');
    const removed = await ptnModel.removeTarget(req.user.id, programId);
    if (!removed) throw httpError(404, 'Target tidak ditemukan');
    return res.json({ success: true, message: 'Target dihapus' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPrograms, getProgram, listTargets, addTarget, removeTarget };
