# Backend Sahabat AlFaRy

API untuk aplikasi mobile (Flutter) dan web (Next.js). Express 5 + JavaScript + MySQL + Gemini.

## Yang dibutuhkan

- Node.js 20 atau lebih baru (cek: `node -v`)
- MySQL 8 (XAMPP boleh; nyalakan **MySQL** di XAMPP Control Panel)
- Postman (untuk mencoba endpoint)

## Menjalankan backend (dari nol)

Semua perintah di PowerShell, di folder `backend-ai`.

1. Pasang paket:
   ```
   npm install
   ```
2. Siapkan pengaturan:
   ```
   copy .env.example .env
   ```
   Buka `.env`, lalu isi `DB_PASSWORD` (XAMPP biasanya kosong) dan `JWT_SECRET` dengan teks acak buatanmu sendiri.
   Biarkan `AI_PROVIDER=mock` kalau tidak punya kunci Gemini. **File `.env` tidak boleh di-commit.**
3. Buat database: buka phpMyAdmin → tab **SQL** (jangan pilih database dulu) → tempel seluruh isi `database.sql` → **Go**.
   Hasilnya database `sahabat_alfary` dengan 24 tabel dan data contoh.
   > `database.sql` **menghapus** database lama lalu membuat ulang. Pakai hanya di database baru/development.
   > Kalau databasemu sudah berisi data dan dibuat dari versi lama, pakai `database/migrations/` (lihat di bawah).
4. Buat akun admin (password pilihanmu sendiri, tidak disimpan di file):
   ```
   $env:ADMIN_EMAIL="admin@lokal.test"; $env:ADMIN_PASSWORD="isi-password-sendiri"; node scripts/create-admin.js
   ```
5. Jalankan server:
   ```
   npm run dev
   ```
6. Cek: buka `http://localhost:5000/api/health` → harus muncul `success: true`.

Akun siswa dibuat lewat `POST /api/auth/register`. Menjadikan siswa premium atau mentor (di phpMyAdmin → SQL):
```sql
UPDATE users SET is_premium = 1 WHERE email = 'siswa@contoh.com';
UPDATE users SET role = 'mentor' WHERE email = 'mentor@contoh.com';
```
Agar mentor terhubung ke profilnya: isi kolom `mentors.user_id` dengan `users.id` akun tersebut.

## Perintah lain

| Perintah | Fungsi |
|---|---|
| `npm run dev` | server + restart otomatis saat file berubah |
| `npm start` | server biasa |
| `node --test test/` | jalankan semua tes (tidak menyentuh database) |
| `node scripts/import-ptn.js data/ptn_programs.csv` | isi data program studi PTN dari CSV |
| `node scripts/create-admin.js` | buat/pulihkan akun admin (butuh `ADMIN_EMAIL`, `ADMIN_PASSWORD`) |

## Pengaturan `.env`

| Nama | Arti |
|---|---|
| `PORT` | port server (bawaan 5000) |
| `DB_HOST` `DB_PORT` `DB_USER` `DB_PASSWORD` `DB_NAME` | koneksi MySQL |
| `JWT_SECRET` | kunci penandatangan token (wajib, rahasia) |
| `JWT_EXPIRE` | masa berlaku token (bawaan 7d) |
| `FRONTEND_URL` | satu alamat web yang diizinkan CORS (bawaan `http://localhost:3000`) |
| `AI_PROVIDER` | `mock` (jawaban contoh) atau `gemini` |
| `GEMINI_API_KEY` | kunci Gemini, hanya di `.env` lokal |
| `GEMINI_MODEL` | model Gemini |
| `AI_DAILY_LIMIT_FREE` / `AI_DAILY_LIMIT_PREMIUM` | jatah AI per hari (3 / 10) |

## Struktur folder

```
server.js            pintu masuk, daftar route
src/routes/          alamat endpoint
src/middleware/      cek token dan role
src/controllers/     baca request, kirim respons
src/services/        logika (AI, estimasi PTN)
src/models/          satu-satunya tempat query SQL
src/utils/           pembantu (validasi, status materi, dll)
database.sql         database baru (24 tabel + data contoh)
database/migrations/ perubahan bertahap untuk database lama
scripts/             create-admin, import-ptn
docs/                API.md (mobile/umum), PANDUAN_FE_WEB.md (web)
test/                tes otomatis
```

## Mengubah struktur tabel ("migrasi")

Kami **tidak memakai library migrasi** (Knex/Prisma dll) supaya tidak ada dependency baru dan tetap mudah dipahami. Aturannya:

1. Database baru → jalankan `database.sql`.
2. Database lama berisi data → jalankan file di `database/migrations/` berurutan (satu kali per file).
3. Setiap ada perubahan tabel: buat file migrasi baru bernomor **dan** perbarui `database.sql`.

## Dokumentasi untuk tim lain

- Mobile dan umum: `docs/API.md`
- Web admin/mentor: `docs/PANDUAN_FE_WEB.md`
- Menjalankan web dan mobile: lihat `README.md` di root repo
