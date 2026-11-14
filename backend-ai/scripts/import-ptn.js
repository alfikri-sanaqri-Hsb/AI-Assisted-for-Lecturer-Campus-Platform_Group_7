/**
 * IMPOR DATA PASSING GRADE DARI CSV
 *
 * Cara pakai (dari folder backend-ai):
 *   node scripts/import-ptn.js data/ptn_programs.csv
 *
 * Kolom CSV (baris pertama = header):
 *   university,program_name,degree,path,year,score_min,score_avg,score_max,
 *   pct_choice1,pct_choice2,pct_choice3,pct_choice4,applicants,capacity,source,source_type
 * source_type: resmi | komunitas | dummy   (kolom pct_*, applicants, capacity boleh kosong)
 * Baris yang sudah ada (universitas+prodi+jenjang+jalur+tahun sama) diperbarui, bukan digandakan.
 */

require('dotenv').config();
const fs = require('fs');
const pool = require('../src/config/database');

// Pembaca CSV sederhana: mendukung tanda kutip dan koma di dalam kutip
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((v) => v.trim() !== '')) rows.push(row);
  return rows;
}

const intOrNull = (v) => (v === undefined || v.trim() === '' ? null : parseInt(v, 10));
const numOrNull = (v) => (v === undefined || v.trim() === '' ? null : Number(v));
const SOURCE_TYPES = ['resmi', 'komunitas', 'dummy'];

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('Pakai: node scripts/import-ptn.js data/ptn_programs.csv');

  const [header, ...lines] = parseCsv(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  for (const need of ['university', 'program_name', 'year', 'score_min', 'score_avg', 'score_max', 'source']) {
    if (!(need in col)) throw new Error(`Kolom "${need}" tidak ada di header CSV`);
  }

  let ok = 0;
  const problems = [];
  for (const [i, r] of lines.entries()) {
    const get = (name) => (r[col[name]] ?? '').trim();
    const degree = (get('degree') || 'S1').toUpperCase();
    const sMin = Number(get('score_min')), sAvg = Number(get('score_avg')), sMax = Number(get('score_max'));
    const sourceType = (get('source_type') || 'resmi').toLowerCase();
    const year = parseInt(get('year'), 10);

    if (!get('university') || !get('program_name')) { problems.push(`baris ${i + 2}: universitas/prodi kosong`); continue; }
    if (!['S1', 'D3', 'D4'].includes(degree)) { problems.push(`baris ${i + 2}: degree harus S1/D3/D4`); continue; }
    if (![sMin, sAvg, sMax].every((n) => Number.isFinite(n) && n > 0)) { problems.push(`baris ${i + 2}: score_min/avg/max harus angka > 0`); continue; }
    if (!(sMin <= sAvg && sAvg <= sMax)) { problems.push(`baris ${i + 2}: harus score_min <= score_avg <= score_max`); continue; }
    if (!SOURCE_TYPES.includes(sourceType)) { problems.push(`baris ${i + 2}: source_type harus resmi/komunitas/dummy`); continue; }
    const pcts = ['pct_choice1', 'pct_choice2', 'pct_choice3', 'pct_choice4'].map((c) => numOrNull(get(c)));
    if (pcts.some((p) => p !== null && (!Number.isFinite(p) || p < 0 || p > 100))) { problems.push(`baris ${i + 2}: pct_choice harus 0-100`); continue; }
    if (!Number.isInteger(year) || year < 2015 || year > 2100) { problems.push(`baris ${i + 2}: year tidak valid`); continue; }
    if (!get('source')) { problems.push(`baris ${i + 2}: source (sumber data) wajib diisi`); continue; }

    await pool.query(
      `INSERT INTO ptn_programs
         (university, program_name, degree, path, year, score_min, score_avg, score_max,
          pct_choice1, pct_choice2, pct_choice3, pct_choice4, applicants, capacity, source, source_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score_min = VALUES(score_min), score_avg = VALUES(score_avg), score_max = VALUES(score_max),
         pct_choice1 = VALUES(pct_choice1), pct_choice2 = VALUES(pct_choice2), pct_choice3 = VALUES(pct_choice3),
         pct_choice4 = VALUES(pct_choice4), applicants = VALUES(applicants), capacity = VALUES(capacity),
         source = VALUES(source), source_type = VALUES(source_type)`,
      [get('university'), get('program_name'), degree, (get('path') || 'SNBT').toUpperCase(), year, sMin, sAvg, sMax,
       ...pcts, intOrNull(get('applicants')), intOrNull(get('capacity')), get('source'), sourceType]
    );
    ok++;
  }

  console.log(`✅ ${ok} baris masuk`);
  if (problems.length) console.log(`⚠️  ${problems.length} baris dilewati:\n  - ${problems.join('\n  - ')}`);
}

main()
  .catch((e) => { console.error('❌', e.message); process.exitCode = 1; })
  .finally(() => pool.end());
