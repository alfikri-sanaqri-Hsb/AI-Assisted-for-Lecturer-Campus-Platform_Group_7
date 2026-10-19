# API Sahabat AlFaRy

Base URL: `http://localhost:5000/api`
Format data: JSON. Setiap request dengan body wajib memakai header `Content-Type: application/json`.
Endpoint yang bertanda 🔒 membutuhkan header `Authorization: Bearer <token>`.

## Format respons

Sukses:
```json
{ "success": true, "message": "Pesan", "data": {} }
```

Gagal:
```json
{ "success": false, "message": "Penjelasan error" }
```

---

## POST /auth/login

Login dan mendapatkan token. 🔒 Tidak perlu token.

Body:
```json
{ "email": "fauzan@contoh.com", "password": "123456" }
```

Respons `200`:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": { "token": "eyJhbGciOi..." }
}
```

| Status | Arti |
|---|---|
| 400 | Email atau password kosong |
| 401 | Email atau password salah |
| 403 | Akun tidak aktif |

---

## POST /tryouts/:id/submit

Mengirim jawaban tryout dan mendapatkan skor. 🔒 Perlu token.

Body:
```json
{
  "answers": [
    { "question_id": 1, "selected_option": "B" },
    { "question_id": 2, "selected_option": "A" }
  ]
}
```

Respons `201`: skor, jumlah benar, dan `review` berisi tiap soal. Kunci jawaban hanya terbuka untuk 3 soal pertama kalau user belum premium.

| Status | Arti |
|---|---|
| 400 | ID tidak valid atau `answers` kosong |
| 404 | Tryout tidak ditemukan |
| 401 | Token tidak ada atau salah |