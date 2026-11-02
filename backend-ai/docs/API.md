# Panduan Integrasi API — Sahabat AlFaRy

Panduan ini untuk tim mobile (Flutter) dan web agar bisa terhubung ke backend.

## 1. Base URL

| Platform | Base URL |
|---|---|
| Flutter di Android emulator | `http://10.0.2.2:5000/api` |
| Flutter di HP fisik / iOS / desktop | `http://<IP-laptop-backend>:5000/api` |
| Web (browser di laptop backend) | `http://localhost:5000/api` |

Catatan: `10.0.2.2` adalah alamat khusus emulator Android yang menunjuk ke `localhost` di laptop. Di HP fisik, laptop dan HP harus di Wi-Fi yang sama, dan IP laptop bisa dicek dengan `ipconfig`.

## 2. Format umum

- Semua data dikirim dan diterima dalam format **JSON**.
- Request yang punya body wajib memakai header `Content-Type: application/json`.
- Endpoint yang bertanda 🔒 wajib memakai header `Authorization: Bearer <token>`.

Respons sukses:
```json
{ "success": true, "message": "Pesan singkat", "data": { } }
```

Respons gagal:
```json
{ "success": false, "message": "Penjelasan error" }
```

### Status code

| Code | Arti | Yang dilakukan frontend |
|---|---|---|
| 200 | Berhasil | Pakai `data` |
| 201 | Berhasil membuat data | Pakai `data` |
| 400 | Input salah | Tampilkan `message` ke user |
| 401 | Belum login / token salah / kedaluwarsa | Arahkan ke halaman login |
| 403 | Akun tidak aktif | Tampilkan `message` |
| 404 | Data tidak ditemukan | Tampilkan pesan kosong |
| 500 | Error di server | Tampilkan pesan umum |

## 3. Alur login dan token

1. User login lewat `POST /auth/login`.
2. Simpan `data.token` dengan aman (Flutter: `shared_preferences`; web: `localStorage`).
3. Setiap request ke endpoint 🔒, kirim header:
   `Authorization: Bearer <token>`
4. Kalau server membalas `401`, hapus token lalu arahkan user ke login.

Token berlaku sesuai `JWT_EXPIRE` di backend (saat ini 7 hari).

## 4. Contoh pemakaian

### Flutter (package `http`)

```dart
final res = await http.get(
  Uri.parse('${ApiConfig.baseUrl}/progress/summary'),
  headers: {'Authorization': 'Bearer $token'},
);
final body = jsonDecode(res.body);
if (res.statusCode == 200) {
  final points = body['data']['total_points'];
}
```

### Web (fetch)

```js
const res = await fetch('http://localhost:5000/api/progress/summary', {
  headers: { Authorization: `Bearer ${token}` },
});
const body = await res.json();
if (res.ok) console.log(body.data.total_points);
```

### CORS untuk web

Backend hanya mengizinkan origin dari `FRONTEND_URL` di `.env`, default `http://localhost:3000`. Jadi web harus dijalankan di port 3000, atau `FRONTEND_URL` diubah sesuai alamat web.

---

## 4. Daftar endpoint

### Auth

#### POST /auth/register
Daftar akun baru. Tidak perlu token.

Body:
```json
{ "email": "fauzan@contoh.com", "password": "123456", "full_name": "Fauzan" }
```

Respons `201`: `data` berisi `id`, `email`, `fullName`.

| Status | Arti |
|---|---|
| 400 | Field kosong, email tidak valid, password kurang dari 6 karakter, atau email sudah terdaftar |

#### POST /auth/login
Login. Tidak perlu token.

Body:
```json
{ "email": "fauzan@contoh.com", "password": "123456" }
```

Respons `200`:
```json
{ "success": true, "message": "Login berhasil", "data": { "token": "eyJ..." } }
```

| Status | Arti |
|---|---|
| 400 | Email atau password kosong |
| 401 | Email atau password salah |
| 403 | Akun tidak aktif |

---

### User

#### GET /users/dashboard 🔒
Data profil user untuk halaman Home.

Respons `200` (contoh):
```json
{
  "success": true,
  "message": "Dashboard",
  "data": {
    "full_name": "Fauzan",
    "email": "fauzan@contoh.com",
    "phone_number": "08123456789",
    "profile_picture": null,
    "date_of_birth": "2004-05-17",
    "major": "Ilmu Komputer"
  }
}
```

#### PUT /users/profile 🔒
Ubah profil. Kirim hanya field yang ingin diubah.

Body:
```json
{ "full_name": "Fauzan A.", "phone_number": "08123456789", "date_of_birth": "2004-05-17", "major": "Ilmu Komputer" }
```

Respons `200`: data profil terbaru (sama dengan dashboard).

| Status | Arti |
|---|---|
| 400 | Nama kosong atau format tanggal bukan `YYYY-MM-DD` |
| 404 | Profil belum ada |

#### PUT /users/password 🔒
Ganti password.

Body:
```json
{ "current_password": "123456", "new_password": "abcdef" }
```

| Status | Arti |
|---|---|
| 200 | Berhasil |
| 400 | Field kosong, password baru kurang dari 6 karakter, sama dengan yang lama, atau password lama salah |

Catatan: password lama salah memakai `400`, bukan `401`, supaya aplikasi tidak otomatis logout.

---

### Materi

#### GET /materials 🔒
Daftar materi. Bisa difilter dengan `?subject=`.

Contoh: `GET /materials?subject=Penalaran Umum`

Respons `200`:
```json
{
  "success": true,
  "message": "Daftar materi",
  "data": [
    {
      "id": 1,
      "subject": "Penalaran Umum",
      "title": "Kemampuan Penalaran Umum",
      "description": "...",
      "image_url": null,
      "estimated_minutes": 30,
      "sort_order": 1,
      "is_completed": false
    }
  ]
}
```

#### GET /materials/:id 🔒
Detail satu materi. Bentuk datanya sama dengan satu item di daftar materi.

| Status | Arti |
|---|---|
| 400 | ID tidak valid |
| 404 | Materi tidak ditemukan |

#### POST /materials/:id/complete 🔒
Tandai materi selesai. Memanggil ini dua kali tidak masalah (idempotent). Selesai materi juga dihitung sebagai aktivitas belajar untuk streak.

Tidak perlu body.

Respons `200`:
```json
{ "success": true, "message": "Materi ditandai selesai", "data": { "id": 1, "is_completed": true } }
```

**Penting:** ini `POST`, bukan `GET`.

---

### Tryout

#### GET /tryouts 🔒
Daftar tryout yang sudah dipublikasikan.

Respons `200` (item di `data`):
```json
{ "id": 1, "title": "TryOut 1 - Simulasi UTBK", "description": "...", "duration_minutes": 90 }
```

#### GET /tryouts/:id/questions 🔒
Soal untuk dikerjakan. **Kunci jawaban tidak dikirim di sini.**

Respons `200` (item di `data`):
```json
{
  "id": 1,
  "subject": "Penalaran Umum",
  "question_text": "Ibukota Indonesia adalah...",
  "option_a": "Bandung",
  "option_b": "Jakarta",
  "option_c": "Surabaya",
  "option_d": "Medan",
  "sort_order": 1
}
```

| Status | Arti |
|---|---|
| 400 | ID tidak valid |
| 404 | Tryout tidak ditemukan |

#### POST /tryouts/:id/submit 🔒
Kirim jawaban dan dapatkan skor. Soal yang tidak dijawab bisa dikirim dengan dilewati.

Body:
```json
{
  "answers": [
    { "question_id": 1, "selected_option": "B" },
    { "question_id": 2, "selected_option": "A" }
  ]
}
```

Respons `201`:
```json
{
  "success": true,
  "message": "Tryout selesai",
  "data": {
    "attempt_id": 2,
    "tryout_id": 1,
    "score": 60,
    "correct_count": 3,
    "total_questions": 5,
    "submitted_at": "2026-10-18T17:12:19.000Z",
    "free_answer_key_limit": 3,
    "is_premium": false,
    "review": [
      {
        "question_id": 1,
        "question_text": "Ibukota Indonesia adalah...",
        "options": { "A": "Bandung", "B": "Jakarta", "C": "Surabaya", "D": "Medan" },
        "selected_option": "B",
        "is_correct": true,
        "answer_key_locked": false,
        "correct_option": "B"
      }
    ]
  }
}
```

Aturan kunci jawaban:
- `answer_key_locked: false` berarti `correct_option` boleh ditampilkan.
- `answer_key_locked: true` berarti `correct_option` bernilai `null`. Tampilkan tombol berlangganan.
- User premium melihat semua kunci.

| Status | Arti |
|---|---|
| 400 | ID tidak valid atau `answers` kosong |
| 404 | Tryout tidak ditemukan |

#### GET /tryouts/attempts/:attemptId 🔒
Lihat lagi hasil tryout yang pernah dikerjakan. Bentuk `data`-nya sama dengan respons submit.

| Status | Arti |
|---|---|
| 404 | Hasil tidak ditemukan, atau bukan milik user ini |

---

### Progres

#### GET /progress/summary 🔒
Ringkasan untuk halaman Home dan Progress.

Respons `200`:
```json
{
  "success": true,
  "message": "Ringkasan progres",
  "data": {
    "total_points": 3,
    "streak_days": 4,
    "last_activity_date": "2026-10-19"
  }
}
```

Aturan:
- `total_points`: jumlah soal berbeda yang pernah dijawab benar. Mengulang tryout tidak menambah poin.
- `streak_days`: jumlah hari berturut-turut belajar. Boleh bolong maksimal 2 hari sebelum streak kembali ke 1.

---

## 5. Cara menguji

1. Jalankan backend (`npm run dev`) dan pastikan muncul pesan koneksi database berhasil.
2. Test di Postman: `POST /auth/login`, lalu salin token.
3. Test endpoint 🔒 dengan header `Authorization: Bearer <token>`.
4. Kalau dapat `401` padahal sudah login, cek apakah header-nya tertulis `Bearer ` (dengan spasi) dan token tidak terpotong.