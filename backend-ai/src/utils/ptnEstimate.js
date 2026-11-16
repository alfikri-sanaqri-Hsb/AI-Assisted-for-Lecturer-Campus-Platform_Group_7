/**
 * HITUNGAN ESTIMASI PTN (tanpa AI, murni rumus)
 * Kategori ditentukan di sini oleh KODE, bukan oleh AI. AI hanya menulis penjelasan.
 * Dengan begitu angka dan kategori tidak bisa "dikarang" oleh AI.
 *
 * Skala: skor tryout di aplikasi 0-100 (persen benar) diubah ke skala UTBK dengan
 * rumus linear: 0% -> 400, 100% -> 800. Ini ESTIMASI konversi (bukan rumus resmi IRT UTBK).
 * Ubah konstanta di bawah kalau mau menyesuaikan.
 */

const SCALE_MIN = 400;
const SCALE_MAX = 800;
const MARGIN = 30; // selisih poin di bawah skor terendah yang masih dianggap "menantang"

const CATEGORIES = ['aman', 'peluang', 'menantang', 'jauh'];

const round2 = (n) => Math.round(n * 100) / 100;

/** 0-100 persen -> skala UTBK (400-800) */
function toUtbkScale(percent) {
  const p = Math.min(100, Math.max(0, Number(percent)));
  return round2(SCALE_MIN + (p / 100) * (SCALE_MAX - SCALE_MIN));
}

/**
 * aman      : skor kamu >= rata-rata skor yang diterima
 * peluang   : di antara skor terendah dan rata-rata yang tercatat
 * menantang : di bawah skor terendah, tapi selisihnya <= MARGIN
 * jauh      : di bawah skor terendah lebih dari MARGIN
 */
function classify(userScore, scoreMin, scoreAvg) {
  if (userScore >= scoreAvg) return 'aman';
  if (userScore >= scoreMin) return 'peluang';
  if (userScore >= scoreMin - MARGIN) return 'menantang';
  return 'jauh';
}

/** Jumlah laporan dibaca dari teks source, contoh "...3 laporan..." */
function parseReportCount(source) {
  const m = /(\d+)\s*laporan/i.exec(String(source || ''));
  return m ? Number(m[1]) : null;
}

/** Seberapa bisa dipercaya data prodi ini (makin banyak laporan makin baik) */
function dataConfidence(reportCount) {
  if (reportCount === null) return 'rendah';
  if (reportCount >= 5) return 'tinggi';
  if (reportCount >= 3) return 'sedang';
  return 'rendah';
}

/** Rata-rata maksimal 3 tryout terbaru (persen) */
function averageRecentPercent(attempts, take = 3) {
  const scores = attempts.slice(0, take).map((a) => Number(a.score)).filter((n) => Number.isFinite(n));
  if (scores.length === 0) return null;
  return { average: round2(scores.reduce((a, b) => a + b, 0) / scores.length), used: scores.length };
}

/** Satu target -> hasil hitungan lengkap */
function evaluateTarget(userScore, target) {
  const min = Number(target.score_min);
  const avg = Number(target.score_avg);
  const reports = parseReportCount(target.source);
  return {
    program_id: target.program_id,
    university: target.university,
    program_name: target.program_name,
    year: target.year,
    score_min: min,
    score_avg: avg,
    your_score: userScore,
    gap_to_min: round2(userScore - min),
    gap_to_avg: round2(userScore - avg),
    category: classify(userScore, min, avg),
    data_confidence: dataConfidence(reports),
    report_count: reports,
  };
}

module.exports = {
  SCALE_MIN, SCALE_MAX, MARGIN, CATEGORIES,
  toUtbkScale, classify, parseReportCount, dataConfidence, averageRecentPercent, evaluateTarget,
};
