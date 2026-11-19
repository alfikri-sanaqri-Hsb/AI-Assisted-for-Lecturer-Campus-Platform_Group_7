/**
 * Pemeriksaan pengaturan saat server mulai.
 * JWT_SECRET lemah = siapa pun bisa memalsukan token admin, jadi dicek dulu.
 */
const KNOWN_SAMPLE = 'sahabat_alfary_jwt_secret_key'; // contoh lama di .env.example (sudah publik di GitHub)

function checkEnv() {
  const secret = process.env.JWT_SECRET || '';
  const isProd = process.env.NODE_ENV === 'production';

  if (secret.length < 16) {
    console.error('❌ JWT_SECRET belum diisi atau terlalu pendek (minimal 16 karakter). Isi di file .env.');
    process.exit(1);
  }
  if (secret.includes(KNOWN_SAMPLE)) {
    if (isProd) {
      console.error('❌ JWT_SECRET masih memakai contoh publik dari repository. Ganti dengan teks acak buatanmu.');
      process.exit(1);
    }
    console.warn('⚠️  JWT_SECRET masih contoh publik dari repository. Ganti dengan teks acak sebelum deploy.');
  }
  if (isProd && (process.env.PAYMENT_MODE || 'simulation') === 'simulation') {
    console.warn('⚠️  PAYMENT_MODE=simulation di production: siapa pun bisa menandai pesanannya lunas.');
  }
}

module.exports = checkEnv;
