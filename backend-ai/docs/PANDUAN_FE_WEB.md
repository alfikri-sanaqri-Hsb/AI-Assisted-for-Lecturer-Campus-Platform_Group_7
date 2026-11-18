# Panduan Backend untuk Web Admin dan Mentor (Frontend)

Dokumen ini untuk tim web. **Tidak berisi password atau kunci apa pun.**
Semua angka dan nama di contoh hanyalah contoh data.

## 1. Menjalankan backend di komputer sendiri

Database yang dipakai backend adalah **MySQL lokal milik masing-masing developer** (XAMPP/phpMyAdmin), bukan database bersama.
Jadi aman diisi atau di-reset di komputer kamu sendiri. Jangan jalankan `database.sql` ke database mana pun yang dipakai orang lain.

Ringkas: lihat `README.md` di folder `backend-ai` (langkah lengkap). Berikut intinya untuk tim web:

1. `git pull`, lalu `cd backend-ai`
2. `npm install`
3. Salin `.env.example` menjadi `.env`, lalu isi:
   - `DB_USER`, `DB_PASSWORD` sesuai MySQL lokalmu (XAMPP biasanya `root` dan kosong)
   - `JWT_SECRET` isi dengan teks acak buatanmu sendiri (jangan pakai contoh di `.env.example`)
   - `FRONTEND_URL=http://localhost:3000` (alamat web-mu; lihat bagian 6)
   - `AI_PROVIDER=mock` kalau tidak punya kunci Gemini (fitur AI tetap jalan dengan data contoh)
4. Buat database: buka phpMyAdmin, tab **SQL** (tanpa memilih database), tempel seluruh isi `database.sql` (24 tabel + data contoh), lalu **Go**.
   Skrip ini menghapus lalu membuat ulang database `sahabat_alfary` **di MySQL lokalmu**; itu normal di komputer sendiri.
5. Buat akun admin demo **dengan password pilihanmu sendiri** (PowerShell, dari folder `backend-ai`):
   ```
   $env:ADMIN_EMAIL="admin@lokal.test"; $env:ADMIN_PASSWORD="isi-password-sendiri"; node scripts/create-admin.js
   ```
   Email dan password hanya ada di terminalmu, tidak masuk kode atau repo. Dengan cara ini tidak ada password yang perlu dikirim lewat chat.
6. `npm run dev`, lalu cek `GET http://localhost:5000/api/health`

## 2. Aturan umum API

- Base URL: `http://localhost:5000/api`
- Body dan respons JSON dengan nama **snake_case**.
- Sukses: `{ "success": true, "message": "...", "data": ... }`. Daftar punya tambahan `meta`.
- Gagal: `{ "success": false, "message": "..." }` (kadang ada `error.statusCode`).
- Header untuk semua endpoint admin: `Authorization: Bearer <token>`
- Kode status: 400 input salah, 401 token tidak ada/tidak valid/kedaluwarsa, 403 bukan role yang berhak, 404 tidak ditemukan, 409 konflik (mis. loncat status).
- Daftar mendukung: `?cari=&urut=&arah=asc|desc&halaman=1&per_halaman=10` (per_halaman 1 sampai 100).

## 3. Contoh data kirim dan terima

### Login
`POST /api/auth/login`
```json
{ "email": "admin@lokal.test", "password": "isi-password-sendiri" }
```
Respons 200:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": { "id": 3, "email": "admin@lokal.test", "token": "<JWT>", "role": "admin" }
}
```
Salah password: 401 `{ "success": false, "message": "Email atau password salah" }`. Akun nonaktif: 403 `Akun tidak aktif`.
Cek `data.role` setelah login: `admin` ke halaman admin, `mentor` ke halaman mentor.

### Ringkasan dashboard
`GET /api/admin/dashboard`
```json
{
  "success": true,
  "message": "Ringkasan dashboard admin",
  "data": {
    "total_students": 2, "total_mentors": 2, "total_tryouts": 1, "total_materials": 4,
    "pending_review": 0, "paid_orders": 0, "total_ai_insights": 2
  }
}
```


### Tryout
`GET /api/admin/tryouts`
```json
{
  "success": true, "message": "Daftar tryout",
  "data": [
    { "id": 1, "title": "TryOut 1 - Simulasi UTBK", "description": "Tryout contoh untuk pengujian",
      "duration_minutes": 90, "is_published": 1, "question_count": 5 }
  ]
}
```
`POST /api/admin/tryouts`
```json
{ "title": "Tryout 2", "description": "opsional", "duration_minutes": 60, "is_published": 0 }
```
Respons 201: `{ "success": true, "message": "Tryout dibuat", "data": { "id": 2 } }`
`PUT /api/admin/tryouts/:id` memakai body yang sama (**ganti semua kolom**, jadi kirim semua field). `DELETE /api/admin/tryouts/:id`.
Catatan: menghapus tryout ikut menghapus riwayat pengerjaan siswa. Untuk menyembunyikan, pakai `is_published: 0`.

### Soal
`GET /api/admin/tryouts/:id/questions`
```json
{
  "success": true, "message": "Soal tryout",
  "data": [
    { "id": 1, "subject": "Penalaran Umum", "question_text": "...",
      "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...",
      "correct_option": "B", "sort_order": 1 }
  ]
}
```
`POST /api/admin/tryouts/:id/questions` (dan `PUT /api/admin/questions/:id`)
```json
{ "subject": "Penalaran Umum", "question_text": "...", "option_a": "...", "option_b": "...",
  "option_c": "...", "option_d": "...", "correct_option": "B", "sort_order": 1 }
```
`correct_option` harus `A`, `B`, `C`, atau `D`. Endpoint admin menampilkan kunci jawaban; endpoint siswa tidak.

## 4. Fitur mana yang sudah ada

Status "Siap" = sudah dibuat dan diuji di Postman oleh backend (termasuk pengecekan role: token siswa/mentor ke endpoint admin = 403).

| Halaman web | Endpoint | Status |
|---|---|---|
| Login | `POST /api/auth/login` | Siap |
| Dashboard admin | `GET /api/admin/dashboard` | Siap |
| Tryout dan soal | `/api/admin/tryouts...`, `/api/admin/questions/:id` | Siap |
| Siswa (daftar, cari, urut) | `GET /api/admin/students` | Siap |
| Siswa (aktif/nonaktif) | `PUT /api/admin/students/:id/status` | Siap |
| Mentor (daftar) | `GET /api/admin/mentors` | Siap |
| Mentor (tambah/ubah/nonaktif) | `POST/PUT /api/admin/mentors...` | Siap |
| Materi (berbasis link) | `/api/admin/materials...` | Siap |
| Review konten (setujui/tolak) | `/api/admin/content-review`, `.../materials/:id/review` | Siap |
| Video (berbasis link) | `/api/admin/videos...` | Siap |
| Sesi live mentor (Zoom/Meet) | `/api/admin/mentor-sessions...` | Siap |
| Pesanan langganan | `GET /api/admin/orders` (hanya baca) | Siap |
| Panel mentor (materi sendiri) | `/api/panel/mentor/...` | Siap |

**Belum ada, jangan disambungkan dulu:**
- **"Jadwal" umum** (tabel `schedules`: tryout dan live mentoring) belum punya endpoint admin. Yang tersedia hanya **sesi live per mentor** (`mentor-sessions`). Pastikan halaman jadwal memang dimaksudkan untuk sesi mentor sebelum disambungkan.
- Siswa binaan mentor (penugasan mentor ke siswa), rating mentor, status konsultasi, jumlah tayang per materi: tidak ada datanya. Tampilkan "-" atau sembunyikan.
- Testimoni dan promo: belum ada CRUD.

## 5. Menyambungkan web (Next.js) ke backend

1. Di folder `frontendweb`, buat file `.env.local` (jangan di-commit): `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
2. Semua panggilan memakai `process.env.NEXT_PUBLIC_API_URL`, jangan menulis alamat langsung di kode.
3. Alur: halaman login memanggil `POST /auth/login` → simpan `data.token` → kirim `Authorization: Bearer <token>` di setiap request → cek `data.role` (admin/mentor) untuk menentukan halaman.
4. Data web yang masih mock diganti bertahap per halaman mengikuti tabel bagian 4. Halaman AI tidak wajib di web (mobile sudah cukup).

## 6. CORS dan keamanan login

- **CORS:** backend hanya mengizinkan satu origin, yaitu nilai `FRONTEND_URL` di `.env` (bawaan `http://localhost:3000`). Kalau web jalan di port lain, ubah `FRONTEND_URL` lalu restart backend.
- **Password:** disimpan sebagai hash bcrypt, tidak pernah plain text.
- **Token:** JWT (HS256), berlaku 7 hari, berisi `id`, `email`, `role`, ditandatangani dengan `JWT_SECRET` milik server. Role tidak bisa diubah dari sisi klien karena token akan tidak valid.
- **Akses admin:** semua route `/api/admin` memakai pengecekan token **dan** role admin di server. Token siswa menghasilkan **403**. Menyembunyikan menu di web hanya untuk tampilan; yang menjaga keamanan adalah backend.
- **Akun nonaktif** ditolak saat login.
- **Saran untuk frontend:** simpan token di memori atau `sessionStorage`, jangan di kode atau repository, dan jangan menaruh password atau `.env` di git. Saat menerima 401, arahkan kembali ke halaman login.
- **Batasan saat ini (jujur):** belum ada refresh token dan belum ada pembatasan percobaan login (rate limit).
