-- =====================================================
-- DATABASE: sahabat_alfary
-- Deskripsi: Platform bimbingan belajar persiapan PTN
-- =====================================================

-- PERINGATAN: file ini MENGHAPUS database lama lalu membuatnya ulang (semua data hilang).
-- Hanya untuk database baru / development. Untuk database yang sudah berisi data,
-- pakai file di folder database/migrations/ (tidak menghapus apa pun).
DROP DATABASE IF EXISTS sahabat_alfary;

CREATE DATABASE sahabat_alfary
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sahabat_alfary;

-- =====================================================
-- 1. USERS
--    Menyimpan akun: email, password, role, status
-- =====================================================
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('student', 'mentor', 'admin') NOT NULL DEFAULT 'student',
  status        VARCHAR(50)  NOT NULL DEFAULT 'active',
  is_premium    TINYINT(1)   NOT NULL DEFAULT 0,
  premium_until DATETIME     NULL,                -- batas akhir premium (diisi saat pembayaran berhasil)
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. USER_PROFILES
--    Profil pengguna one-to-one dengan users
-- =====================================================
CREATE TABLE user_profiles (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT          NOT NULL UNIQUE,
  full_name       VARCHAR(255) NOT NULL,
  nickname        VARCHAR(50),
  phone_number    VARCHAR(20),
  profile_picture VARCHAR(255),
  date_of_birth   DATE,
  major           VARCHAR(100),
  university      VARCHAR(150),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_major   (major)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. USER_ACTIVITY_DAYS
--    Satu baris per hari aktif user (untuk streak).
--    PRIMARY KEY (user_id, activity_date) mencegah duplikat.
-- =====================================================
CREATE TABLE user_activity_days (
  user_id       INT  NOT NULL,
  activity_date DATE NOT NULL,

  PRIMARY KEY (user_id, activity_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. USER_NOTIFICATION_SETTINGS
--    Preferensi notifikasi per user.
--    ON DUPLICATE KEY UPDATE dipakai di kode untuk upsert.
-- =====================================================
CREATE TABLE user_notification_settings (
  user_id      INT        NOT NULL PRIMARY KEY,
  info         TINYINT(1) NOT NULL DEFAULT 1,
  reminder     TINYINT(1) NOT NULL DEFAULT 0,
  promo        TINYINT(1) NOT NULL DEFAULT 1,
  online_class TINYINT(1) NOT NULL DEFAULT 1,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. MATERIALS
--    Materi pembelajaran per subtes
-- =====================================================
CREATE TABLE materials (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  subject           VARCHAR(100) NOT NULL,
  title             VARCHAR(255) NOT NULL,
  description       TEXT,
  image_url         VARCHAR(255),
  estimated_minutes INT          DEFAULT 0,
  sort_order        INT          NOT NULL DEFAULT 0,
  is_published      TINYINT(1)   NOT NULL DEFAULT 1,
  -- alur review materi (admin/mentor): draft -> pending_review -> approved -> published
  content_url       VARCHAR(500) NULL,                       -- link materi (YouTube/Drive/artikel)
  status            ENUM('draft','pending_review','approved','published') NOT NULL DEFAULT 'published',
  author_id         INT          NULL,                       -- mentor penulis (users.id)
  review_note       TEXT         NULL,                       -- catatan saat ditolak
  reviewed_at       TIMESTAMP    NULL,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_subject    (subject),
  INDEX idx_sort_order (sort_order),
  CONSTRAINT fk_materials_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. USER_MATERIAL_PROGRESS
--    Mencatat materi yang sudah diselesaikan user.
--    UNIQUE (user_id, material_id) mencegah duplikat.
-- =====================================================
CREATE TABLE user_material_progress (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT       NOT NULL,
  material_id  INT       NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_user_material (user_id, material_id),
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  INDEX idx_user_id     (user_id),
  INDEX idx_material_id (material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. VIDEOS
--    Video materi pembelajaran
-- =====================================================
CREATE TABLE videos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  subject          VARCHAR(100) NOT NULL,
  title            VARCHAR(255) NOT NULL,
  url              VARCHAR(255),
  duration_minutes INT         DEFAULT 0,
  sort_order       INT         NOT NULL DEFAULT 0,
  is_published     TINYINT(1)  NOT NULL DEFAULT 0,

  INDEX idx_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. USER_VIDEO_VIEWS
--    Mencatat video yang sudah ditonton user per hari.
--    PRIMARY KEY tiga kolom mencegah hitung dobel.
-- =====================================================
CREATE TABLE user_video_views (
  user_id      INT  NOT NULL,
  video_id     INT  NOT NULL,
  watched_date DATE NOT NULL,

  PRIMARY KEY (user_id, video_id, watched_date),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. TRYOUTS
--    Paket soal tryout yang bisa dikerjakan siswa
-- =====================================================
CREATE TABLE tryouts (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(150) NOT NULL,
  description      TEXT,
  duration_minutes INT          DEFAULT 0,
  is_published     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. QUESTIONS
--     Soal-soal. Bisa milik tryout tertentu (tryout_id)
--     atau soal bebas untuk latihan (tryout_id NULL).
-- =====================================================
CREATE TABLE questions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  tryout_id     INT,
  subject       VARCHAR(100) NOT NULL,
  question_text TEXT         NOT NULL,
  option_a      TEXT         NOT NULL,
  option_b      TEXT         NOT NULL,
  option_c      TEXT         NOT NULL,
  option_d      TEXT         NOT NULL,
  correct_option CHAR(1)     NOT NULL COMMENT 'A, B, C, atau D',
  image_url     VARCHAR(255),
  sort_order    INT          NOT NULL DEFAULT 0,

  FOREIGN KEY (tryout_id) REFERENCES tryouts(id) ON DELETE SET NULL,
  INDEX idx_tryout_id (tryout_id),
  INDEX idx_subject   (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. TRYOUT_ATTEMPTS
--     Setiap kali user mengerjakan satu tryout
-- =====================================================
CREATE TABLE tryout_attempts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT          NOT NULL,
  tryout_id       INT          NOT NULL,
  correct_count   INT          NOT NULL DEFAULT 0,
  total_questions INT          NOT NULL DEFAULT 0,
  score           DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  submitted_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (tryout_id) REFERENCES tryouts(id) ON DELETE CASCADE,
  INDEX idx_user_id    (user_id),
  INDEX idx_tryout_id  (tryout_id),
  INDEX idx_submitted  (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. ATTEMPT_ANSWERS
--     Jawaban user untuk setiap soal dalam satu attempt
-- =====================================================
CREATE TABLE attempt_answers (
  id              INT        AUTO_INCREMENT PRIMARY KEY,
  attempt_id      INT        NOT NULL,
  question_id     INT        NOT NULL,
  selected_option CHAR(1)    COMMENT 'NULL = tidak dijawab',
  is_correct      TINYINT(1) NOT NULL DEFAULT 0,

  FOREIGN KEY (attempt_id)  REFERENCES tryout_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id)       ON DELETE CASCADE,
  INDEX idx_attempt_id  (attempt_id),
  INDEX idx_question_id (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. PRACTICE_ANSWERS
--     Jawaban user dari fitur latihan soal harian.
--     answered_date dipakai untuk hitung soal hari ini.
-- =====================================================
CREATE TABLE practice_answers (
  id              INT        AUTO_INCREMENT PRIMARY KEY,
  user_id         INT        NOT NULL,
  question_id     INT        NOT NULL,
  selected_option CHAR(1)    COMMENT 'NULL = tidak dijawab',
  is_correct      TINYINT(1) NOT NULL DEFAULT 0,
  answered_date   DATE       NOT NULL,

  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, answered_date),
  INDEX idx_user_id   (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. SCHEDULES
--     Jadwal kelas/tryout yang ditampilkan di home
-- =====================================================
CREATE TABLE schedules (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  type       ENUM('tryout', 'live_mentoring') NOT NULL,
  title      VARCHAR(150) NOT NULL,
  starts_at  DATETIME     NOT NULL,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,

  INDEX idx_starts_at (starts_at),
  INDEX idx_active    (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 15. TESTIMONIALS
--     Testimoni alumni yang ditampilkan di home
-- =====================================================
CREATE TABLE testimonials (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  university   VARCHAR(150),
  message      TEXT,
  is_published TINYINT(1)  NOT NULL DEFAULT 0,
  sort_order   INT         NOT NULL DEFAULT 0,

  INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Hasil insight AI per siswa (tampil di layar Progres mobile)
CREATE TABLE ai_insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  output_json JSON NOT NULL,
  provider VARCHAR(30) NOT NULL,
  model VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_insight_user (user_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catatan setiap pemanggilan AI (berhasil atau gagal). Isi prompt TIDAK disimpan.
CREATE TABLE ai_audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  feature VARCHAR(40) NOT NULL,
  status ENUM('success','invalid_output','provider_error') NOT NULL,
  detail VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_usage (user_id, feature, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- PTN: data skor penerimaan
-- =====================================================
-- Data skor penerimaan per program studi (bukan 'passing grade' resmi: SNPMB tidak merilisnya) (diisi lewat CSV, lihat scripts/import-ptn.js)
CREATE TABLE ptn_programs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  university    VARCHAR(150)  NOT NULL,
  program_name  VARCHAR(150)  NOT NULL,
  degree        ENUM('S1','D3','D4') NOT NULL DEFAULT 'S1',
  path          VARCHAR(30)   NOT NULL DEFAULT 'SNBT',      -- SNBT / MANDIRI
  year          SMALLINT      NOT NULL,
  -- Skor peserta yang DITERIMA di prodi itu (data resmi SNPMB: tertinggi, rata-rata, terendah)
  score_min     DECIMAL(6,2)  NOT NULL,                     -- skor terendah yang diterima
  score_avg     DECIMAL(6,2)  NOT NULL,                     -- skor rata-rata yang diterima
  score_max     DECIMAL(6,2)  NOT NULL,                     -- skor tertinggi yang diterima
  -- Persentase peserta diterima menurut urutan pilihan (boleh kosong kalau datanya tidak ada)
  pct_choice1   DECIMAL(5,2)  NULL,
  pct_choice2   DECIMAL(5,2)  NULL,
  pct_choice3   DECIMAL(5,2)  NULL,
  pct_choice4   DECIMAL(5,2)  NULL,
  applicants    INT           NULL,                         -- jumlah peminat (opsional)
  capacity      INT           NULL,                         -- daya tampung (opsional)
  source        VARCHAR(255)  NOT NULL,                     -- sumber data (wajib, untuk dipertanggungjawabkan)
  source_type   ENUM('resmi','komunitas','dummy') NOT NULL DEFAULT 'resmi',  -- seberapa bisa dipercaya
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_program (university, program_name, degree, path, year),
  INDEX idx_score (score_avg),
  INDEX idx_university (university)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Program yang dipilih siswa sebagai target (maksimal 3 per siswa, dicek di backend)
CREATE TABLE user_targets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  program_id  INT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_user_program (user_id, program_id),
  CONSTRAINT fk_target_user    FOREIGN KEY (user_id)    REFERENCES users(id)         ON DELETE CASCADE,
  CONSTRAINT fk_target_program FOREIGN KEY (program_id) REFERENCES ptn_programs(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ptn_estimates (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  output_json JSON NOT NULL,
  provider    VARCHAR(30) NOT NULL,
  model       VARCHAR(80) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_estimate_user (user_id, id),
  CONSTRAINT fk_estimate_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FEEDBACK
--    Masukan siswa dari aplikasi
-- =====================================================
CREATE TABLE feedback (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  topic      ENUM('materi','tryout','progress','kesalahan','lainnya') NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_feedback_user (user_id),
  CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- MENTORS
--    Profil mentor. user_id (boleh kosong) = akun login mentor
-- =====================================================
CREATE TABLE mentors (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NULL,
  name        VARCHAR(100) NOT NULL,
  photo_url   VARCHAR(255) NULL,
  university  VARCHAR(100) NULL,
  major       VARCHAR(100) NULL,
  bio         TEXT,
  subjects    VARCHAR(255) NULL,
  group_url   VARCHAR(255) NULL,                -- link grup (WhatsApp/Telegram)
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_mentors_user (user_id),
  CONSTRAINT fk_mentors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- MENTOR_SESSIONS
--    Jadwal sesi live mentor (link Zoom/Meet)
-- =====================================================
CREATE TABLE mentor_sessions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id        INT NOT NULL,
  title            VARCHAR(150) NOT NULL,
  starts_at        DATETIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  meeting_url      VARCHAR(255) NULL,
  is_active        TINYINT(1) NOT NULL DEFAULT 1,
  created_at       TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_session_mentor (mentor_id),
  CONSTRAINT fk_session_mentor FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SUBSCRIPTION_ORDERS
--    Pesanan langganan premium (simulasi pembayaran).
--    UNIQUE (user_id, idempotency_key) mencegah bayar dobel.
-- =====================================================
CREATE TABLE subscription_orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  idempotency_key VARCHAR(100) NULL,
  request_hash    CHAR(64) NULL,
  plan_name       VARCHAR(100) NOT NULL,
  duration_months INT NOT NULL,
  amount          INT NOT NULL,
  payment_method  VARCHAR(30) NOT NULL,
  status          ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending',
  paid_at         DATETIME NULL,
  created_at      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_order_idem (user_id, idempotency_key),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_resets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL,
  code        VARCHAR(6) NOT NULL,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME NULL,
  attempts    INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Tabel baru: mentor_students ----------
CREATE TABLE mentor_students (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id   INT NOT NULL,
  student_id  INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_mentor_student (mentor_id, student_id),
  INDEX idx_ms_mentor (mentor_id),
  INDEX idx_ms_student (student_id),
  CONSTRAINT fk_ms_mentor  FOREIGN KEY (mentor_id)  REFERENCES mentors(id) ON DELETE CASCADE,
  CONSTRAINT fk_ms_student FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Tabel baru: tryout_subtests ----------
CREATE TABLE tryout_subtests (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  tryout_id        INT NOT NULL,
  name             VARCHAR(100) NOT NULL,
  question_count   INT NOT NULL DEFAULT 0,
  duration_minutes INT NOT NULL DEFAULT 0,
  sort_order       INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sub_tryout (tryout_id),
  CONSTRAINT fk_sub_tryout FOREIGN KEY (tryout_id) REFERENCES tryouts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Tabel baru: admin_settings ----------
CREATE TABLE admin_settings (
  `key`      VARCHAR(100) PRIMARY KEY,
  `value`    TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO admin_settings (`key`, `value`) VALUES
  ('platform_name', 'Sahabat AlFaRy'),
  ('academic_year', '2026/2027'),
  ('support_email', 'admin@sahabat-alfary.id'),
  ('allow_student_registration', '1'),
  ('duplicate_similarity_threshold', '70'),
  ('maintenance_mode', '0'),
  ('notify_on_content_submission', '1'),
  ('notify_on_schedule_conflict', '1');

-- ---------- Tabel baru: audit_logs ----------
CREATE TABLE audit_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  actor_role   ENUM('ADMIN','MENTOR') NOT NULL DEFAULT 'ADMIN',
  actor_name   VARCHAR(255) NOT NULL DEFAULT 'Admin',
  action       VARCHAR(100) NOT NULL,
  target_type  ENUM('STUDENT','MENTOR','MATERIAL','QUESTION','TRYOUT','SCHEDULE','SETTINGS') NOT NULL,
  target_id    VARCHAR(50) NOT NULL,
  target_title VARCHAR(255) NULL,
  details      TEXT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor (actor_role),
  INDEX idx_audit_target (target_type),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- mentors: kolom baru ----------
ALTER TABLE mentors
  ADD COLUMN rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN status ENUM('Aktif','Menunggu Verifikasi','Cuti','Nonaktif') NOT NULL DEFAULT 'Aktif',
  ADD COLUMN permissions JSON NULL,
  ADD COLUMN availability_notes TEXT NULL;

-- ---------- questions: kolom baru ----------
ALTER TABLE questions
  ADD COLUMN option_e TEXT NULL,
  ADD COLUMN difficulty ENUM('mudah','sedang','sulit') NOT NULL DEFAULT 'sedang',
  ADD COLUMN explanation TEXT NULL,
  ADD COLUMN status ENUM('draft','review','approved','published','rejected') NOT NULL DEFAULT 'draft',
  ADD COLUMN review_note TEXT NULL,
  ADD COLUMN author_id INT NULL,
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD CONSTRAINT fk_question_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

-- ---------- tryouts: kolom baru ----------
ALTER TABLE tryouts
  ADD COLUMN status ENUM('draft','review','approved','published','rejected') NOT NULL DEFAULT 'draft',
  ADD COLUMN review_note TEXT NULL,
  ADD COLUMN author_id INT NULL,
  ADD COLUMN withdrawal_requested TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN withdrawal_reason TEXT NULL,
  ADD CONSTRAINT fk_tryout_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

-- ---------- schedules: kolom baru ----------
ALTER TABLE schedules
  MODIFY COLUMN type VARCHAR(50) NOT NULL,
  ADD COLUMN mentor_id INT NULL,
  ADD COLUMN platform VARCHAR(30) NULL,
  ADD COLUMN meet_url VARCHAR(255) NULL,
  ADD COLUMN status ENUM('Terjadwal','Berlangsung','Selesai','Dibatalkan') NOT NULL DEFAULT 'Terjadwal',
  ADD COLUMN student_ids JSON NULL,
  ADD COLUMN notes TEXT NULL,
  ADD COLUMN ends_at DATETIME NULL,
  ADD COLUMN managed_by_admin TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD CONSTRAINT fk_schedule_mentor FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL;

-- Migrasi 006: simpan token & link pembayaran Midtrans di pesanan langganan
-- Jalankan SEKALI di phpMyAdmin. Error #1060 "Duplicate column" = sudah pernah dijalankan, aman diabaikan.
ALTER TABLE subscription_orders
  ADD COLUMN snap_token  VARCHAR(100) NULL,
  ADD COLUMN payment_url VARCHAR(255) NULL;

-- =====================================================
-- DATA AWAL (SEED)
-- Isi minimal untuk bisa langsung test endpoint
-- =====================================================

-- Tryout pertama untuk testing
INSERT INTO tryouts (title, description, duration_minutes, is_published) VALUES
  ('SNBT 2024 - Sesi 1', 'Tryout simulasi SNBT sesi pertama', 90, 1),
  ('SNBT 2024 - Sesi 2', 'Tryout simulasi SNBT sesi kedua',  90, 1);

-- Soal latihan dan tryout
INSERT INTO questions (tryout_id, subject, question_text, option_a, option_b, option_c, option_d, correct_option, sort_order) VALUES
  -- Soal untuk Tryout 1
  (1, 'Penalaran Umum', 'Jika semua A adalah B, dan semua B adalah C, maka...', 'Semua A adalah C', 'Semua C adalah A', 'Semua B adalah A', 'Tidak dapat disimpulkan', 'A', 1),
  (1, 'Penalaran Umum', 'Pola bilangan: 2, 4, 8, 16, ... nilai selanjutnya adalah?', '24', '28', '32', '36', 'C', 2),
  (1, 'Pengetahuan Kuantitatif', 'Jika x + 5 = 12, maka nilai x adalah?', '5', '6', '7', '8', 'C', 3),

  -- Soal bebas untuk latihan (tryout_id NULL)
  (NULL, 'Penalaran Umum', 'Antonim dari kata KONKRET adalah?', 'Nyata', 'Abstrak', 'Jelas', 'Riil', 'B', 1),
  (NULL, 'Penalaran Umum', 'Sinonim dari kata AMBIGU adalah?', 'Jelas', 'Tegas', 'Bermakna ganda', 'Pasti', 'C', 2),
  (NULL, 'Pengetahuan Kuantitatif', 'Nilai dari 3² + 4² adalah?', '25', '49', '7', '14', 'A', 3),
  (NULL, 'Literasi Bahasa Indonesia', 'Kalimat yang menggunakan EYD dengan benar adalah?', 'di rumah', 'Dirumah', 'Di-rumah', 'di Rumah', 'A', 4),
  (NULL, 'Penalaran Matematika', 'Rata-rata dari 10, 20, 30 adalah?', '15', '20', '25', '30', 'B', 5);

-- Materi awal
INSERT INTO materials (subject, title, description, estimated_minutes, sort_order, is_published) VALUES
  ('Penalaran Umum',           'Pengantar Penalaran Umum',       'Dasar-dasar penalaran logis untuk SNBT',    20, 1, 1),
  ('Penalaran Umum',           'Analogi dan Silogisme',          'Teknik menjawab soal analogi dan silogisme', 25, 2, 1),
  ('Pengetahuan Kuantitatif',  'Aljabar Dasar',                  'Persamaan dan pertidaksamaan linear',        30, 1, 1),
  ('Literasi Bahasa Indonesia','Membaca Kritis',                  'Strategi memahami teks bacaan kompleks',     20, 1, 1),
  ('Penalaran Matematika',     'Statistika Dasar',               'Mean, median, modus, dan distribusi data',   25, 1, 1);

-- Jadwal contoh (mulai 3 hari dari sekarang)
INSERT INTO schedules (type, title, starts_at, is_active) VALUES
  ('tryout',        'Tryout SNBT Nasional Sesi 1', DATE_ADD(NOW(), INTERVAL 3 DAY),  1),
  ('live_mentoring','Live Mentoring: Tips SNBT 2024', DATE_ADD(NOW(), INTERVAL 5 DAY), 1);

-- Testimoni
INSERT INTO testimonials (name, university, message, is_published, sort_order) VALUES
  ('Rina Oktavia',  'Universitas Indonesia',      'Berkat Sahabat Alfary, saya bisa tembus UI di percobaan pertama!', 1, 1),
  ('Budi Santoso',  'Institut Teknologi Bandung', 'Tryout-nya mirip banget dengan soal asli SNBT. Sangat membantu!',  1, 2),
  ('Dewi Lestari',  'Universitas Gadjah Mada',   'Mentor di sini sabar dan selalu siap membantu. Recommended!',      1, 3);

-- Video contoh
INSERT INTO videos (subject, title, url, duration_minutes, sort_order, is_published) VALUES
  ('Penalaran Umum',          'Teknik Cepat Analogi Verbal',    'https://www.youtube.com/watch?v=example1', 12, 1, 1),
  ('Pengetahuan Kuantitatif', 'Rumus Aljabar yang Sering Keluar','https://www.youtube.com/watch?v=example2', 15, 1, 1),
