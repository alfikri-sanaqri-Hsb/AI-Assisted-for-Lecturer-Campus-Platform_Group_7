Ringkasan backend untuk FE mobile dan web

Base URL: http://localhost:5000/api (Android emulator: http://10.0.2.2:5000/api)

Format umum

Request dan response JSON memakai snake_case (full_name, phone_number, current_password).
Sukses: { "success": true, "message": "...", "data": ... }
Gagal: { "success": false, "message": "..." }
Kode status: 200 (ambil/ubah), 201 (buat), 400 (input salah), 401 (token tidak valid atau tidak ada), 403 (role tidak sesuai), 404 (tidak ditemukan).
Endpoint yang butuh login memakai header Authorization: Bearer <token>.
Token didapat dari login. Berlaku 7 hari. Simpan di penyimpanan lokal (SharedPreferences di Flutter, localStorage di web).

Role

student: semua endpoint siswa di bawah.
admin: akses ke endpoint siswa mengembalikan 403. Endpoint admin akan dibuat terpisah.
Autentikasi
Method	Endpoint	Body	Catatan
POST	/auth/register	email, password, full_name	Mengembalikan 201. Role otomatis student.
POST	/auth/login	email, password	Mengembalikan token, role, id, email.
Akun dan profil (login)
Method	Endpoint	Body	Catatan
GET	/users/dashboard	-	Data profil dasar.
PUT	/users/profile	full_name, nickname, phone_number, date_of_birth, major, university, profile_picture	Field yang tidak dikirim tidak berubah. Nickname maks. 50 karakter.
PUT	/users/password	current_password, new_password	Password lama salah mengembalikan 400.
Home
Method	Endpoint	Catatan
GET	/home	Hanya siswa. Berisi: user, total_points, streak_days, continue_learning, daily_missions (latihan soal dan tonton video, masing-masing dengan current dan target), promo, schedules, testimonials.
Materi
Method	Endpoint	Catatan
GET	/materials?subject=	Daftar materi, completed per user.
GET	/materials/:id	Detail materi.
POST	/materials/:id/complete	Tandai selesai. Menambah streak.
Tryout
Method	Endpoint	Catatan
GET	/tryouts	Daftar tryout yang dipublikasikan.
GET	/tryouts/:id/questions	Soal tanpa kunci jawaban.
POST	/tryouts/:id/submit	Body berisi jawaban per soal. Mengembalikan 201 dan attempt_id. Menambah streak.
GET	/tryouts/attempts/:attemptId	Hasil. Kunci jawaban hanya untuk 3 soal pertama di akun gratis, semua untuk premium (answer_key_locked).
Latihan soal
Method	Endpoint	Catatan
GET	/practice/questions?subject=&limit=	Soal acak tanpa kunci. Limit 1–50, default 10.
POST	/practice/submit	Mengembalikan total, correct, wrong. Menambah streak dan poin.
Video
Method	Endpoint	Catatan
GET	/videos?subject=	Daftar video, dengan watched_today.
POST	/videos/:id/watch	Tandai ditonton hari ini. Menambah streak.
Progres dan ranking
Method	Endpoint	Catatan
GET	/progress/summary	total_points, streak_days, last_activity_date.
GET	/progress/overview	Ringkasan, riwayat tryout, progres per mata pelajaran, kekuatan (2 tertinggi), dan perlu ditingkatkan (2 terendah).
GET	/ranking?limit=	total_users, my_rank, my_points, dan top (dengan is_me).

Aturan poin dan streak

Poin = jumlah soal berbeda yang pernah dijawab benar, dari tryout dan latihan. Mengulang tryout tidak menambah poin.
Streak dihitung dari aktivitas harian (materi, tryout, latihan, video), dengan toleransi 2 hari bolong. Tanggal memakai WIB.
Pengaturan
Method	Endpoint	Catatan
GET	/settings	Profil, is_premium, dan pengaturan notifikasi.
PUT	/settings/notifications	Body: info, reminder, promo, online_class (boolean).
GET	/settings/about	Teks Tentang Kami dan Bantuan.
Langganan (simulasi)
Method	Endpoint	Body	Catatan
GET	/subscriptions/plans	-	Daftar paket dan harga.
POST	/subscriptions/checkout	duration_months (1/3/6), payment_method (qris / kartu_debit_kredit)	Mengembalikan 201 dan order_id.
POST	/subscriptions/:id/pay	-	Simulasi bayar. Mengaktifkan premium dan mengisi premium_until.
GET	/subscriptions/status	-	is_premium, premium_until, pesanan terakhir.

Alur FE: tampilkan paket → checkout → tombol “Bayar” memanggil /pay → refresh status.

Status
Sudah diuji di Postman: register, login, home, dashboard, progres, ranking, latihan, video, pengaturan, ubah password, role siswa vs admin.
Perlu tes ulang: materi dan tryout.
Baru ditulis, perlu diuji: nickname, langganan.