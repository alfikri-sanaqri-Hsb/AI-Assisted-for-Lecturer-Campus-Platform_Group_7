export type StudentItem = {
  id: string;
  name: string;
  email: string;
  school: string;
  targetMajor: string;
  tryoutCount: number;
  avgScore: number;
  status: "Aktif" | "Nonaktif" | "Menunggu Aktivasi";
  joinedAt: string;
};

export type MentorItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  assignedStudentsCount: number;
  materialsCount: number;
  status: "Aktif" | "Menunggu Verifikasi" | "Cuti";
  rating: number;
  joinedAt: string;
};

export type ContentReviewItem = {
  id: string;
  title: string;
  contentType: "Materi Pembelajaran" | "Bank Soal" | "Paket Tryout";
  subject: string;
  author: string;
  submissionDate: string;
  status: "Menunggu Peninjauan" | "Disetujui" | "Perlu Revisi";
  questionCount: number;
  notes: string;
};

export type MentorStudentItem = {
  id: string;
  name: string;
  targetMajor: string;
  targetCampus: string;
  progressPercent: number;
  lastTryoutScore: number;
  consultationStatus: "Terjadwal" | "Selesai" | "Perlu Feedback";
  lastActive: string;
};

export type MentorMaterialItem = {
  id: string;
  title: string;
  category: "Penalaran Umum" | "Pengetahuan Kuantitatif" | "Literasi Bahasa" | "Penalaran Matematika";
  type: "Modul Ringkasan" | "Paket Latihan Soal" | "Pembahasan Video";
  status: "Diterbitkan" | "Draft" | "Diajukan" | "Perlu Revisi";
  updatedAt: string;
  totalViews: number;
};

export type AdminMaterialItem = {
  id: string;
  title: string;
  subtest: string;
  type: "Modul Ringkasan" | "Paket Latihan Soal" | "Pembahasan Video" | "Bank Soal";
  author: string;
  status: "Diterbitkan" | "Draft" | "Dalam Peninjauan" | "Perlu Revisi";
  totalAccess: number;
  updatedAt: string;
};

export const MOCK_STUDENTS: StudentItem[] = [
  {
    id: "std-01",
    name: "Ahmad Fauzan Pratama",
    email: "ahmad.fauzan@student.sch.id",
    school: "SMAN 8 Jakarta",
    targetMajor: "Kedokteran (UI)",
    tryoutCount: 6,
    avgScore: 718,
    status: "Aktif",
    joinedAt: "12 Okt 2026",
  },
  {
    id: "std-02",
    name: "Nabila Aurelia Zahra",
    email: "nabila.aurelia@student.sch.id",
    school: "SMAN 3 Bandung",
    targetMajor: "Teknik Informatika (ITB)",
    tryoutCount: 5,
    avgScore: 735,
    status: "Aktif",
    joinedAt: "15 Okt 2026",
  },
  {
    id: "std-03",
    name: "Rizky Ramadhan",
    email: "rizky.ramadhan@student.sch.id",
    school: "SMA Taruna Nusantara",
    targetMajor: "Manajemen Bisnis (UGM)",
    tryoutCount: 4,
    avgScore: 662,
    status: "Aktif",
    joinedAt: "18 Okt 2026",
  },
  {
    id: "std-04",
    name: "Safira Putri Kusuma",
    email: "safira.kusuma@student.sch.id",
    school: "SMAN 1 Yogyakarta",
    targetMajor: "Psikologi (UI)",
    tryoutCount: 3,
    avgScore: 645,
    status: "Menunggu Aktivasi",
    joinedAt: "24 Okt 2026",
  },
  {
    id: "std-05",
    name: "Dimas Aditya Wicaksana",
    email: "dimas.aditya@student.sch.id",
    school: "SMAN 5 Surabaya",
    targetMajor: "Teknik Elektro (ITS)",
    tryoutCount: 7,
    avgScore: 742,
    status: "Aktif",
    joinedAt: "08 Okt 2026",
  },
  {
    id: "std-06",
    name: "Clara Salsabila",
    email: "clara.salsa@student.sch.id",
    school: "SMAN 2 Semarang",
    targetMajor: "Ilmu Komunikasi (UNPAD)",
    tryoutCount: 2,
    avgScore: 590,
    status: "Nonaktif",
    joinedAt: "01 Nov 2026",
  },
  {
    id: "std-07",
    name: "Farhan Maulana",
    email: "farhan.m@student.sch.id",
    school: "SMAN 1 Medan",
    targetMajor: "Hukum (UGM)",
    tryoutCount: 5,
    avgScore: 680,
    status: "Aktif",
    joinedAt: "14 Okt 2026",
  },
];

export const MOCK_MENTORS: MentorItem[] = [
  {
    id: "mnt-01",
    name: "Dr. Hendra Gunawan, M.Si.",
    email: "hendra.gunawan@alfary.id",
    subject: "Pengetahuan Kuantitatif (PK)",
    assignedStudentsCount: 24,
    materialsCount: 18,
    status: "Aktif",
    rating: 4.9,
    joinedAt: "12 Jan 2026",
  },
  {
    id: "mnt-02",
    name: "Siti Rahmawati, S.Pd., M.Hum.",
    email: "siti.rahma@alfary.id",
    subject: "Literasi Bahasa Indonesia & Inggris",
    assignedStudentsCount: 31,
    materialsCount: 22,
    status: "Aktif",
    rating: 4.8,
    joinedAt: "20 Feb 2026",
  },
  {
    id: "mnt-03",
    name: "Budi Santoso, S.Si.",
    email: "budi.santoso@alfary.id",
    subject: "Penalaran Matematika & TPS",
    assignedStudentsCount: 19,
    materialsCount: 14,
    status: "Aktif",
    rating: 4.7,
    joinedAt: "05 Mar 2026",
  },
  {
    id: "mnt-04",
    name: "Anisa Wardhani, M.Ed.",
    email: "anisa.wardhani@alfary.id",
    subject: "Penalaran Umum (PU)",
    assignedStudentsCount: 8,
    materialsCount: 6,
    status: "Menunggu Verifikasi",
    rating: 4.6,
    joinedAt: "28 Okt 2026",
  },
  {
    id: "mnt-05",
    name: "Ilham Setiawan, S.T.",
    email: "ilham.setiawan@alfary.id",
    subject: "Pemahaman Bacaan & Menulis (PBM)",
    assignedStudentsCount: 12,
    materialsCount: 9,
    status: "Cuti",
    rating: 4.5,
    joinedAt: "15 Apr 2026",
  },
];

export const MOCK_CONTENT_REVIEWS: ContentReviewItem[] = [
  {
    id: "rev-01",
    title: "Masteri Pola Silogisme & Logika Proposisi SNBT 2026",
    contentType: "Materi Pembelajaran",
    subject: "Penalaran Umum (PU)",
    author: "Anisa Wardhani, M.Ed.",
    submissionDate: "02 Nov 2026",
    status: "Menunggu Peninjauan",
    questionCount: 35,
    notes: "Menunggu verifikasi admin untuk standar kunci jawaban silogisme bertingkat.",
  },
  {
    id: "rev-02",
    title: "Paket Tryout Simulasi UTBK-SNBT Intensif Gelombang 1",
    contentType: "Paket Tryout",
    subject: "Seluruh Subtes TPS",
    author: "Dr. Hendra Gunawan, M.Si.",
    submissionDate: "30 Okt 2026",
    status: "Disetujui",
    questionCount: 160,
    notes: "Telah divalidasi dengan bobot IRT terkalibrasi.",
  },
  {
    id: "rev-03",
    title: "Bedah Kritis Teks Argumentatif Bahasa Inggris",
    contentType: "Bank Soal",
    subject: "Literasi Bahasa Inggris",
    author: "Siti Rahmawati, S.Pd., M.Hum.",
    submissionDate: "28 Okt 2026",
    status: "Perlu Revisi",
    questionCount: 20,
    notes: "Perlu menambahkan referensi sumber artikel jurnal dan penjelas pengecoh opsi C.",
  },
  {
    id: "rev-04",
    title: "Trik Cepat Aljabar Linear & Fungsi Kuadrat UTBK",
    contentType: "Materi Pembelajaran",
    subject: "Pengetahuan Kuantitatif",
    author: "Budi Santoso, S.Si.",
    submissionDate: "03 Nov 2026",
    status: "Menunggu Peninjauan",
    questionCount: 40,
    notes: "Membutuhkan cek format gambar grafik fungsi pada halaman 12.",
  },
];

export const MOCK_ASSIGNED_STUDENTS: MentorStudentItem[] = [
  {
    id: "ms-01",
    name: "Ahmad Fauzan Pratama",
    targetMajor: "Kedokteran",
    targetCampus: "Universitas Indonesia",
    progressPercent: 88,
    lastTryoutScore: 718,
    consultationStatus: "Terjadwal",
    lastActive: "Hari ini, 10:15 WIB",
  },
  {
    id: "ms-02",
    name: "Nabila Aurelia Zahra",
    targetMajor: "Teknik Informatika",
    targetCampus: "Institut Teknologi Bandung",
    progressPercent: 94,
    lastTryoutScore: 735,
    consultationStatus: "Selesai",
    lastActive: "Kemarin, 19:40 WIB",
  },
  {
    id: "ms-03",
    name: "Rizky Ramadhan",
    targetMajor: "Manajemen Bisnis",
    targetCampus: "Universitas Gadjah Mada",
    progressPercent: 62,
    lastTryoutScore: 662,
    consultationStatus: "Perlu Feedback",
    lastActive: "2 hari lalu",
  },
  {
    id: "ms-04",
    name: "Dimas Aditya Wicaksana",
    targetMajor: "Teknik Elektro",
    targetCampus: "Institut Teknologi Sepuluh Nopember",
    progressPercent: 79,
    lastTryoutScore: 742,
    consultationStatus: "Terjadwal",
    lastActive: "Hari ini, 08:30 WIB",
  },
  {
    id: "ms-05",
    name: "Safira Putri Kusuma",
    targetMajor: "Psikologi",
    targetCampus: "Universitas Indonesia",
    progressPercent: 45,
    lastTryoutScore: 645,
    consultationStatus: "Perlu Feedback",
    lastActive: "4 hari lalu",
  },
];

export const MOCK_MENTOR_MATERIALS: MentorMaterialItem[] = [
  {
    id: "mat-01",
    title: "Strategi Penalaran Deduktif & Diagram Venn UTBK 2026",
    category: "Penalaran Umum",
    type: "Modul Ringkasan",
    status: "Diterbitkan",
    updatedAt: "01 Nov 2026",
    totalViews: 412,
  },
  {
    id: "mat-02",
    title: "Kumpulan Latihan Soal Deret Angka & Pola Bilangan",
    category: "Pengetahuan Kuantitatif",
    type: "Paket Latihan Soal",
    status: "Diterbitkan",
    updatedAt: "27 Okt 2026",
    totalViews: 680,
  },
  {
    id: "mat-03",
    title: "Video Pembahasan Soal Literasi Bahasa Indonesia Terkini",
    category: "Literasi Bahasa",
    type: "Pembahasan Video",
    status: "Diajukan",
    updatedAt: "03 Nov 2026",
    totalViews: 95,
  },
  {
    id: "mat-04",
    title: "Ringkasan Rumus Statistika & Teori Peluang Praktis",
    category: "Penalaran Matematika",
    type: "Modul Ringkasan",
    status: "Perlu Revisi",
    updatedAt: "29 Okt 2026",
    totalViews: 140,
  },
  {
    id: "mat-05",
    title: "Draft Soal Tryout Mandiri: Analisis Gagasan Utama Teks",
    category: "Literasi Bahasa",
    type: "Paket Latihan Soal",
    status: "Draft",
    updatedAt: "04 Nov 2026",
    totalViews: 12,
  },
];

export const MOCK_ADMIN_MATERIALS: AdminMaterialItem[] = [
  {
    id: "adm-mat-01",
    title: "Masteri Pola Silogisme & Logika Proposisi SNBT 2026",
    subtest: "Penalaran Umum (PU)",
    type: "Modul Ringkasan",
    author: "Anisa Wardhani, M.Ed.",
    status: "Diterbitkan",
    totalAccess: 1240,
    updatedAt: "02 Nov 2026",
  },
  {
    id: "adm-mat-02",
    title: "Bedah Tuntas Persamaan Kuadrat & Fungsi Polinomial",
    subtest: "Pengetahuan Kuantitatif (PK)",
    type: "Paket Latihan Soal",
    author: "Dr. Hendra Gunawan, M.Si.",
    status: "Diterbitkan",
    totalAccess: 980,
    updatedAt: "31 Okt 2026",
  },
  {
    id: "adm-mat-03",
    title: "Strategi Membaca Cepat & Analisis Ide Pokok Teks",
    subtest: "Pemahaman Bacaan & Menulis (PBM)",
    type: "Modul Ringkasan",
    author: "Siti Rahmawati, S.Pd., M.Hum.",
    status: "Diterbitkan",
    totalAccess: 1150,
    updatedAt: "28 Okt 2026",
  },
  {
    id: "adm-mat-04",
    title: "Kaidah EYD V & Ketepatan Pilihan Kata UTBK",
    subtest: "Pengetahuan & Pemahaman Umum (PPU)",
    type: "Modul Ringkasan",
    author: "Ilham Setiawan, S.T.",
    status: "Dalam Peninjauan",
    totalAccess: 310,
    updatedAt: "03 Nov 2026",
  },
  {
    id: "adm-mat-05",
    title: "Reading Comprehension & Critical Inferences in English",
    subtest: "Literasi Bahasa Inggris",
    type: "Paket Latihan Soal",
    author: "Siti Rahmawati, S.Pd., M.Hum.",
    status: "Diterbitkan",
    totalAccess: 860,
    updatedAt: "25 Okt 2026",
  },
  {
    id: "adm-mat-06",
    title: "Penerapan Teori Peluang & Analisis Kombinatorika",
    subtest: "Penalaran Matematika (PM)",
    type: "Pembahasan Video",
    author: "Budi Santoso, S.Si.",
    status: "Diterbitkan",
    totalAccess: 740,
    updatedAt: "29 Okt 2026",
  },
  {
    id: "adm-mat-07",
    title: "Paket Latihan Intensif Logika Analitis & Diagram Hubungan",
    subtest: "Penalaran Umum (PU)",
    type: "Bank Soal",
    author: "Anisa Wardhani, M.Ed.",
    status: "Draft",
    totalAccess: 45,
    updatedAt: "04 Nov 2026",
  },
];
