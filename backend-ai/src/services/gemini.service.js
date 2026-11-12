/**
 * GEMINI SERVICE
 * Satu fungsi: kirim prompt ke Google Gemini, terima teks jawabannya.
 * Dipanggil lewat REST (fetch bawaan Node 18+), jadi tidak perlu library tambahan.
 *
 * Keamanan: API key hanya dibaca dari .env dan dikirim lewat header (bukan di URL).
 */

const TIMEOUT_MS = 30000;

async function callGemini({ systemInstruction, userPrompt, responseSchema, temperature = 0.4 }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const body = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: 'application/json', // minta jawaban berupa JSON
      responseSchema,                       // bentuk JSON yang diwajibkan
      temperature,
      maxOutputTokens: 8192,
    },
  };

  // Batalkan kalau Gemini tidak menjawab dalam 30 detik
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    throw new Error(err.name === 'AbortError' ? 'Gemini tidak merespons tepat waktu' : 'Tidak bisa menghubungi Gemini');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    // Pesan error tidak memuat API key maupun isi prompt
    throw new Error(`Gemini membalas HTTP ${response.status}`);
  }

  const data = await response.json();
  const candidate = data.candidates && data.candidates[0];
  if (!candidate) throw new Error('Gemini tidak mengembalikan jawaban');
  if (candidate.finishReason === 'MAX_TOKENS') throw new Error('Jawaban Gemini terpotong');

  // Gabungkan potongan teks (abaikan bagian "thought" = proses berpikir model)
  const parts = (candidate.content && candidate.content.parts) || [];
  const text = parts.filter((p) => typeof p.text === 'string' && !p.thought).map((p) => p.text).join('');
  if (text.trim() === '') throw new Error('Gemini mengembalikan jawaban kosong');

  return { text, provider: 'gemini', model };
}

module.exports = { callGemini };
