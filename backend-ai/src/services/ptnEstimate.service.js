/**
 * PTN ESTIMATE SERVICE
 * Alur "Estimasi Peluang PTN":
 *   1. ambil prodi target siswa + skor tryout terakhir
 *   2. HITUNG kategori dengan rumus (utils/ptnEstimate.js), bukan oleh AI
 *   3. saring teks (filter prompt injection) dan anonimkan: tanpa nama/email/id siswa
 *   4. cek batas harian, lalu minta AI menulis penjelasan (Gemini atau mock)
 *   5. validasi JSON jawaban AI, kategori harus sama dengan hitungan kode
 *   6. simpan hasil + catat audit
 */

const ptnModel = require('../models/ptn.model');
const progressModel = require('../models/progress.model');
const userModel = require('../models/user.model');
const aiModel = require('../models/ai.model');
const estimateModel = require('../models/ptnEstimate.model');
const { callGemini } = require('./gemini.service');
const prompt = require('../ai/ptn.prompt');
const { sanitizeText } = require('../ai/safety');
const calc = require('../utils/ptnEstimate');

const LIMIT_FREE = Number(process.env.AI_DAILY_LIMIT_FREE) || 3;
const LIMIT_PREMIUM = Number(process.env.AI_DAILY_LIMIT_PREMIUM) || 10;
const MAX_ATTEMPTS = 2;

const DISCLAIMER = 'Ini ESTIMASI dari laporan skor komunitas dan konversi skor tryout, bukan prediksi atau data resmi. Hasil seleksi sebenarnya bisa berbeda.';
const SCALE_NOTE = `Skor tryout (0-100) dikonversi linear ke skala ${calc.SCALE_MIN}-${calc.SCALE_MAX} sebagai perkiraan.`;

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function extractJson(text) {
  let t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start !== -1 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

const useMock = () => process.env.AI_PROVIDER === 'mock' || !process.env.GEMINI_API_KEY;

async function askAi(snapshot) {
  if (useMock()) return { text: JSON.stringify(prompt.mock(snapshot)), provider: 'mock', model: 'mock-1' };
  return callGemini({
    systemInstruction: prompt.SYSTEM_INSTRUCTION,
    userPrompt: prompt.buildUserPrompt(snapshot),
    responseSchema: prompt.RESPONSE_SCHEMA,
  });
}

/** Mengubah hasil hitungan jadi data aman untuk prompt. flaggedCount = berapa teks yang disaring. */
function buildSnapshot(yourScore, evaluated) {
  let flaggedCount = 0;
  const programs = evaluated.map((e) => {
    const uni = sanitizeText(e.university, 100);
    const prog = sanitizeText(e.program_name, 100);
    if (uni.flagged) flaggedCount++;
    if (prog.flagged) flaggedCount++;
    return {
      program_id: e.program_id, university: uni.text, program_name: prog.text, year: e.year,
      score_min: e.score_min, score_avg: e.score_avg, your_score: e.your_score,
      gap_to_min: e.gap_to_min, gap_to_avg: e.gap_to_avg, category: e.category, data_confidence: e.data_confidence,
    };
  });
  return { snapshot: { your_score: yourScore, programs }, flaggedCount };
}

async function generate(userId, options = {}, deps = {}) {
  const ptn = deps.ptnModel || ptnModel;
  const progress = deps.progressModel || progressModel;
  const db = deps.aiModel || aiModel;
  const store = deps.estimateModel || estimateModel;
  const getUser = deps.findUserById || userModel.findUserById;
  const ai = deps.ai || askAi;

  // 1. target dan skor
  const targets = await ptn.listTargets(userId);
  if (targets.length === 0) throw httpError(422, 'Pilih dulu minimal 1 program studi target (POST /api/ptn/targets).');

  let basis;
  if (options.utbkScore !== undefined) {
    basis = {
      manual: true, tryouts_used: 0, average_percent: null,
      your_score: Math.round(options.utbkScore * 100) / 100,
      scale_note: 'Skor diisi manual oleh siswa (skala UTBK).',
    };
  } else {
    const attempts = await progress.getTryoutHistory(userId);
    const avg = calc.averageRecentPercent(attempts, 3);
    if (!avg) throw httpError(422, 'Belum ada tryout yang dikerjakan. Kerjakan tryout dulu, atau isi utbk_score manual.');
    basis = {
      manual: false, tryouts_used: avg.used, average_percent: avg.average,
      your_score: calc.toUtbkScale(avg.average), scale_note: SCALE_NOTE,
    };
  }

  // 2. hitungan oleh kode
  const evaluated = targets.map((t) => calc.evaluateTarget(basis.your_score, t));

  // 3. saring + anonimkan
  const { snapshot, flaggedCount } = buildSnapshot(basis.your_score, evaluated);

  // 4. batas harian
  const user = await getUser(userId);
  const limit = user && user.is_premium ? LIMIT_PREMIUM : LIMIT_FREE;
  const used = await db.countUsageToday(userId, prompt.FEATURE);
  if (used >= limit) throw httpError(429, `Batas pemakaian AI hari ini sudah habis (${limit}x per hari). Coba lagi besok.`);

  let problem = '';
  let kind = 'provider_error';
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let raw;
    try {
      raw = await ai(snapshot);
    } catch (err) {
      kind = 'provider_error';
      problem = err.message;
      continue;
    }

    let output;
    try {
      output = extractJson(raw.text);
    } catch {
      kind = 'invalid_output';
      problem = 'Jawaban AI bukan JSON yang valid';
      continue;
    }

    const issue = prompt.validate(output, snapshot);
    if (issue) {
      kind = 'invalid_output';
      problem = issue;
      continue;
    }

    // gabungkan hitungan kode + teks AI
    const byId = new Map(output.programs.map((p) => [p.program_id, p]));
    const result = {
      basis,
      programs: evaluated.map((e) => ({ ...e, explanation: byId.get(e.program_id).explanation, tip: byId.get(e.program_id).tip })),
      overview: output.overview,
      strategy: output.strategy,
      closing: output.closing,
    };

    const id = await store.saveEstimate({ userId, output: result, provider: raw.provider, model: raw.model });
    await db.addAuditLog({
      userId, feature: prompt.FEATURE, status: 'success',
      detail: `attempt ${attempt}${flaggedCount ? `; teks disaring: ${flaggedCount}` : ''}`,
    });
    return {
      id, estimate: result, provider: raw.provider, model: raw.model, disclaimer: DISCLAIMER,
      quota: { used_today: used + 1, daily_limit: limit },
    };
  }

  await db.addAuditLog({ userId, feature: prompt.FEATURE, status: kind, detail: problem });
  throw httpError(502, 'Layanan AI sedang bermasalah atau jawabannya tidak valid. Coba lagi sebentar lagi.');
}

async function latest(userId, deps = {}) {
  const store = deps.estimateModel || estimateModel;
  const row = await store.getLatestEstimate(userId);
  if (!row) return null;
  const estimate = typeof row.output_json === 'string' ? JSON.parse(row.output_json) : row.output_json;
  return { id: row.id, estimate, provider: row.provider, model: row.model, created_at: row.created_at, disclaimer: DISCLAIMER };
}

module.exports = { generate, latest, buildSnapshot, extractJson };
