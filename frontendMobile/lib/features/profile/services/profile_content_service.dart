import '../models/profile_models.dart';

/// Sumber data halaman Profil & Pengaturan (data tiruan).
/// Pengguna disamakan dengan Home dan Progress. Ganti dengan API/Drift nanti.
abstract final class ProfileContentService {
  static const user = ProfileUser(
    name: 'Fauzan',
    university: 'Universitas Gadjah Mada',
    points: '9.230',
    streak: 12,
    level: 1,
    xp: 0,
    xpTarget: 1000,
    avatarAsset: 'assets/images/foto_ojan.jpeg',
    isPremium: false,
  );

  static const week = <StreakDay>[
    StreakDay(label: 'Sen', status: StreakDayStatus.done),
    StreakDay(label: 'Sel', status: StreakDayStatus.done),
    StreakDay(label: 'Rab', status: StreakDayStatus.done),
    StreakDay(label: 'Kam', status: StreakDayStatus.missed),
    StreakDay(label: 'Jum', status: StreakDayStatus.upcoming),
    StreakDay(label: 'Sab', status: StreakDayStatus.upcoming),
    StreakDay(label: 'Min', status: StreakDayStatus.upcoming),
  ];

  // --- Tentang Kami ---
  static const aboutQuote =
      'Sahabat Alfary membantu calon mahasiswa mempersiapkan diri masuk perguruan tinggi negeri melalui materi terstruktur, latihan, tryout, dan evaluasi belajar yang mudah dipahami.';

  // --- Notifikasi ---
  static const notificationPrefs = <NotificationPref>[
    NotificationPref(
      title: 'Info',
      description: 'Info fitur aplikasi, pembaruan, dan tips belajar',
      enabled: true,
    ),
    NotificationPref(
      title: 'Reminder',
      description: 'Pengingat Try Out, Konseling, transaksi pembelian dan lainnya',
      enabled: false,
    ),
    NotificationPref(
      title: 'Promo',
      description: 'Info paket berlangganan, promo, kode diskon dan lainnya',
      enabled: true,
    ),
    NotificationPref(
      title: 'Kelas Online',
      description: 'Kamu akan diberi notifikasi sebelum Kelas Online dimulai',
      enabled: true,
    ),
  ];

  /// Kartu "Aktivitas Saya" masih kosong di Figma.
  static const activities = <String>[];

  // --- Program Belajar ---
  static const subtestProgress = <SubtestProgress>[
    SubtestProgress(name: 'Penalaran Umum', percent: 60),
    SubtestProgress(name: 'Pengetahuan Kuantitatif', percent: 50),
    SubtestProgress(name: 'Penalaran Matematika', percent: 35),
    SubtestProgress(name: 'Literasi Bahasa Inggris', percent: 20),
  ];

  static const modules = <StudyModule>[
    StudyModule(
      title: 'Penalaran Deduktif',
      episode: 'Eps 1',
      imageAsset: 'assets/images/modul_penalaran.png',
    ),
    StudyModule(
      title: 'Aljabar',
      episode: 'Eps 2',
      imageAsset: 'assets/images/modul_aljabar.png',
    ),
    StudyModule(
      title: 'Penalaran Deduktif',
      episode: 'Eps 1',
      imageAsset: 'assets/images/modul_penalaran.png',
    ),
    StudyModule(
      title: 'Aljabar',
      episode: 'Eps 2',
      imageAsset: 'assets/images/modul_aljabar.png',
    ),
  ];

  // --- Bantuan & Saran ---
  static const faqs = <FaqItem>[
    FaqItem(
      question: 'Bagaimana cara mengakses tryout yang sudah dibuka?',
      answer:
          'Buka menu Tryout Saya, pilih tryout yang ingin dikerjakan, lalu tekan Mulai Ujian.',
    ),
    FaqItem(
      question: 'Bagaimana cara melihat hasil dan pembahasan tryout?',
      answer: 'Hasil dan pembahasan tersedia di halaman Progress setelah tryout selesai.',
    ),
    FaqItem(
      question: 'Apakah saya bisa mengerjakan tryout lebih dari satu kali?',
      answer: 'Tryout dikerjakan satu kali; timer tetap berjalan saat keluar.',
    ),
    FaqItem(
      question: 'Bagaimana cara mengubah profil dan program belajar?',
      answer: 'Buka Profil, lalu pilih Edit Profile Lengkap atau Program Belajar.',
    ),
  ];

  static const feedbackTopics = <String>['Materi', 'Tryout', 'Progress', 'Kesulitan'];
}
