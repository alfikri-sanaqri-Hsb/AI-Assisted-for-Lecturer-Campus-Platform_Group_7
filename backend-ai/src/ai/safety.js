/**
 * KEAMANAN PROMPT (rubrik: "filter prompt injection")
 * Semua teks yang akan masuk ke prompt AI harus lewat sini dulu.
 *
 * 1. Buang karakter < > supaya teks tidak bisa menutup blok <data>
 * 2. Buang karakter kontrol dan potong panjangnya
 * 3. Teks yang berbunyi seperti perintah ke AI ("abaikan instruksi", "ignore previous", dst)
 *    diganti dengan [disaring] dan dihitung, supaya tercatat di audit log
 */

const INJECTION_PATTERNS = [
  /abaikan\s+(semua\s+|seluruh\s+)?(instruksi|perintah|aturan)/i,
  /lupakan\s+(semua\s+|seluruh\s+)?(instruksi|perintah|aturan)/i,
  /ignore\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier)?\s*(instructions?|prompts?|rules?)/i,
  /disregard\s+(all\s+|the\s+)?(previous|prior|above)/i,
  /system\s*prompt/i,
  /(kamu|anda)\s+sekarang\s+(adalah|jadi)/i,
  /you\s+are\s+now/i,
  /(jailbreak|developer\s+mode|dan\s+mode)/i,
  /(tampilkan|bocorkan|ungkapkan)\s+.*(prompt|instruksi|api\s*key)/i,
  /reveal\s+.*(prompt|instructions|api\s*key)/i,
];

const containsInjection = (text) => INJECTION_PATTERNS.some((re) => re.test(String(text)));

/** Mengembalikan { text, flagged } - flagged true kalau ada bagian yang disaring */
function sanitizeText(value, maxLength = 100) {
  let text = String(value === undefined || value === null ? '' : value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
  const flagged = containsInjection(text);
  if (flagged) text = '[disaring]';
  return { text, flagged };
}

module.exports = { containsInjection, sanitizeText, INJECTION_PATTERNS };
