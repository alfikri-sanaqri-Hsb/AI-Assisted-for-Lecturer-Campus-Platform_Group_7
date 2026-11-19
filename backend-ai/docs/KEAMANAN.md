# Keamanan Backend Sahabat AlFaRy

Ringkasan untuk presentasi dan tim. Semua dibuat tanpa library tambahan.

| Aspek | Yang dilakukan | Lokasi |
|---|---|---|
| Password | Di-hash bcrypt, tidak pernah disimpan atau dikirim balik. Minimal 8 karakter saat daftar | `utils/password.js`, `auth.controller.js` |
| Token | JWT HS256, berlaku 7 hari, berisi id, email, role | `utils/jwt.js` |
| Kunci rahasia | `JWT_SECRET` wajib, minimal 16 karakter; server menolak jalan kalau kosong. Menolak contoh publik di production | `config/env.check.js` |
| Hak akses | Token + pengecekan role di server (`/api/admin` hanya admin, `/api/panel/mentor` hanya mentor, `/api/subscriptions` hanya siswa) | `middleware/auth`, `role` |
| Brute force | Login maksimal 10 percobaan per 15 menit per IP+email (429); daftar maksimal 10 per jam per IP | `middleware/rateLimit.middleware.js` |
| SQL injection | Semua query memakai parameter `?`; kolom urut memakai daftar putih | folder `models/` |
| XSS dan clickjacking | Header nosniff, X-Frame-Options, Referrer-Policy, no-store | `middleware/security.middleware.js` |
| Bocor info error | Di production error server disamarkan; header `X-Powered-By` dimatikan | `error.middleware.js`, `server.js` |
| Ukuran request | Body JSON dibatasi 100 KB | `server.js` |
| CORS | Hanya satu alamat web (`FRONTEND_URL`) | `server.js` |
| Rahasia | `.env` tidak masuk Git; kunci Gemini hanya di `.env` | `.gitignore` |
| AI | Filter prompt injection, data siswa dianonimkan, kuota harian, log audit tanpa isi prompt | `src/ai/safety.js`, `insight.service.js` |
| Pembayaran | Masih simulasi (`PAYMENT_MODE=simulation`). Di production set `off` atau ganti dengan penyedia pembayaran | `subscription.controller.js` |

## Keterbatasan (jujur)
- Rate limit disimpan di memori: hilang saat server restart, tidak dibagi antar server.
- Belum ada refresh token dan logout sisi server (token berlaku sampai kedaluwarsa).
- Pembayaran belum memakai gateway asli.
- Belum ada HTTPS di laptop; saat deploy gunakan HTTPS dari hosting.
