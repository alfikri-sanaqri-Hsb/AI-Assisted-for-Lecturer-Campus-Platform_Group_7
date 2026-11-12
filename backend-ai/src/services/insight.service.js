/**
 * INSIGHT SERVICE
 * Alur "Buat Insight Belajar":
 *   1. ambil data progres siswa -> jadikan ringkasan ANGKA saja (anonim)
 *   2. cek batas pemakaian harian
 *   3. panggil Gemini (atau mock kalau belum ada API key)
 *   4. validasi JSON jawabannya (salah bentuk = ditolak, tidak disimpan)
 *   5. simpan hasil + catat audit
 */

const progressModel = require('../models/progress.model');
const userModel = require('../models/user.model');
const aiModel = require('../models/ai.model');
const { buildSubjects } = require('../controllers/progress.controller');
const { toWibDate, calculateStreak } = require('../utils/streak');
const { callGemini } = require('./gemini.service');
const prompt = require('../ai/insight.prompt');

const LIMIT_FREE = Number(process.env.AI_DAILY_LIMIT_FREE) || 3;
const LIMIT_PREMIUM = Number(process.env.AI_DAILY_LIMIT_PREMIUM) || 10;
const MAX_ATTEMPTS = 2; // percobaan pertama + 1 ulangan

const DISCLAIMER = 'Saran ini dibuat oleh AI dari data belajarmu dan bersifat panduan, bukan prediksi kelulusan.';

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode; // dibaca oleh error.middleware.js
  return err;
}

// Membersihkan teks sebelum masuk prompt: buang < > (supaya tidak bisa menutup <data>), potong panjang
const clean = (text) => String(text).replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);

/**
 * ANONIMISASI: hanya angka dan nama subtes/tryout.
 * Nama, email, universitas, dan id siswa TIDAK ikut dikirim ke AI.
 */
async function buildSnapshot(userId) {
  const [totalPoints, activityDates, subjectProgress, subjectAccuracy, tryouts] = await Promise.all([
    progressModel.getTotalPoints(userId),
    progressModel.getActivityDates(userId),
    progressModel.getSubjectProgress(userId),
    progressModel.getSubjectAccuracy(userId),
    progressModel.getTryoutHistory(userId),
  ]);

  const subjects = buildSubjects(subjectProgress, subjectAccuracy);
  const ranked = subjects.filter((s) => s.accuracy_percent !== null).sort((a, b) => b.accuracy_percent - a.accuracy_percent);
  const strengths = ranked.slice(0, 2).map((s) => s.subject);
  const improvements = ranked.slice().reverse().filter((s) => !strengths.includes(s.subject)).slice(0, 2).map((s) => s.subject);

  return {
    total_points: totalPoints,
    streak_days: calculateStreak(activityDates, toWibDate()),
    tryouts: tryouts.slice(0, 5).map((t) => ({
      title: clean(t.title), score: Number(t.score), correct_count: t.correct_count, total_questions: t.total_questions,
    })),
    subjects: subjects.map((s) => ({
      subject: clean(s.subject), progress_percent: s.progress_percent,
      questions_answered: s.questions_answered, accuracy_percent: s.accuracy_percent,
    })),
    strengths: strengths.map(clean),
    improvements: improvements.map(clean),
  };
}

const hasNoActivity = (s) =>
  s.total_points === 0 && s.streak_days === 0 && s.tryouts.length === 0 &&
  s.subjects.every((x) => x.questions_answered === 0 && x.progress_percent === 0);

// Mengambil objek JSON dari teks (kadang Gemini membungkusnya dengan ```json)
function extractJson(text) {
  let t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start !== -1 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

// Tanpa API key (atau AI_PROVIDER=mock) pakai jawaban palsu, gratis dan cukup untuk develop mobile
const useMock = () => process.env.AI_PROVIDER === 'mock' || !process.env.GEMINI_API_KEY;

async function askAi(snapshot) {
  if (useMock()) return { text: JSON.stringify(prompt.mockInsight(snapshot)), provider: 'mock', model: 'mock-1' };
  return callGemini({
    systemInstruction: prompt.SYSTEM_INSTRUCTION,
    userPrompt: prompt.buildUserPrompt(snapshot),
    responseSchema: prompt.RESPONSE_SCHEMA,
  });
}

async function generate(userId, deps = {}) {
  const ai = deps.ai || askAi;
  const progress = deps.buildSnapshot || buildSnapshot;
  const db = deps.aiModel || aiModel;
  const getUser = deps.findUserById || userModel.findUserById;

  const snapshot = await progress(userId);
  if (hasNoActivity(snapshot)) {
    throw httpError(422, 'Belum ada aktivitas belajar. Kerjakan latihan soal atau tryout dulu.');
  }

  // Batas harian: gratis 3x, premium 10x
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
      continue; // coba lagi sekali
    }

    let output;
    try {
      output = extractJson(raw.text);
    } catch {
      kind = 'invalid_output';
      problem = 'Jawaban AI bukan JSON yang valid';
      continue;
    }

    const issue = prompt.validateInsight(output, snapshot);
    if (issue) {
      kind = 'invalid_output';
      problem = issue;
      continue;
    }

    // Lolos validasi: simpan dan catat audit
    const id = await db.saveInsight({ userId, output, provider: raw.provider, model: raw.model });
    await db.addAuditLog({ userId, feature: prompt.FEATURE, status: 'success', detail: `attempt ${attempt}` });
    return {
      id, insight: output, provider: raw.provider, model: raw.model, disclaimer: DISCLAIMER,
      quota: { used_today: used + 1, daily_limit: limit },
    };
  }

  await db.addAuditLog({ userId, feature: prompt.FEATURE, status: kind, detail: problem });
  throw httpError(502, 'Layanan AI sedang bermasalah atau jawabannya tidak valid. Coba lagi sebentar lagi.');
}

async function latest(userId, deps = {}) {
  const db = deps.aiModel || aiModel;
  const row = await db.getLatestInsight(userId);
  if (!row) return null;
  // MariaDB mengembalikan kolom JSON sebagai teks, MySQL sebagai objek
  const insight = typeof row.output_json === 'string' ? JSON.parse(row.output_json) : row.output_json;
  return { id: row.id, insight, provider: row.provider, model: row.model, created_at: row.created_at, disclaimer: DISCLAIMER };
}

module.exports = { generate, latest, hasNoActivity, extractJson };
