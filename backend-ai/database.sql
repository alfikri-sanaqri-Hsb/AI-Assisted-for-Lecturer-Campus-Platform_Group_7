-- =====================================================
-- DATABASE: sahabat_alfary
-- Deskripsi: Platform bimbingan belajar persiapan PTN
-- =====================================================

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
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_subject    (subject),
  INDEX idx_sort_order (sort_order)
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
CREATE TABLE IF NOT EXISTS ai_insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  output_json JSON NOT NULL,
  provider VARCHAR(30) NOT NULL,
  model VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_insight_user (user_id, id)
);

-- Catatan setiap pemanggilan AI (berhasil atau gagal). Isi prompt TIDAK disimpan.
CREATE TABLE IF NOT EXISTS ai_audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  feature VARCHAR(40) NOT NULL,
  status ENUM('success','invalid_output','provider_error') NOT NULL,
  detail VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_usage (user_id, feature, created_at)
);



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
  ('Literasi Bahasa Indonesia','Membaca Teks Saintifik',         'https://www.youtube.com/watch?v=example3', 10, 1, 1);

-- ============================================================
-- PTN: data passing grade + target pilihan siswa
-- Tempel di bagian bawah database.sql, lalu jalankan di MySQL
-- ============================================================

-- Data passing grade per program studi (diisi lewat CSV, lihat scripts/import-ptn.js)
CREATE TABLE IF NOT EXISTS ptn_programs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  university    VARCHAR(150)  NOT NULL,
  program_name  VARCHAR(150)  NOT NULL,
  degree        ENUM('S1','D3','D4') NOT NULL DEFAULT 'S1',
  path          VARCHAR(30)   NOT NULL DEFAULT 'SNBT',      -- SNBT / MANDIRI
  year          SMALLINT      NOT NULL,
  passing_score DECIMAL(6,2)  NOT NULL,                     -- nilai acuan (skala UTBK)
  applicants    INT           NULL,                         -- jumlah peminat
  capacity      INT           NULL,                         -- daya tampung
  source        VARCHAR(255)  NOT NULL,                     -- sumber data (wajib, untuk dipertanggungjawabkan)
  is_dummy      TINYINT(1)    NOT NULL DEFAULT 0,           -- 1 = data contoh, bukan data asli
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_program (university, program_name, degree, path, year),
  INDEX idx_score (passing_score),
  INDEX idx_university (university)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Program yang dipilih siswa sebagai target (maksimal 3 per siswa, dicek di backend)
CREATE TABLE IF NOT EXISTS user_targets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  program_id  INT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_user_program (user_id, program_id),
  CONSTRAINT fk_target_user    FOREIGN KEY (user_id)    REFERENCES users(id)         ON DELETE CASCADE,
  CONSTRAINT fk_target_program FOREIGN KEY (program_id) REFERENCES ptn_programs(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
