import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../models/learning_models.dart';

/// Sumber data Materi dan Cari Materi (data tiruan sesuai Figma).
/// Ganti dengan API materi nanti.
abstract final class LearningContentService {
  static const today = TodayLesson(
    subject: 'Penalaran Umum',
    title: 'Materi Penalaran Umum',
    progress: 0.7,
    lessons: [
      'Materi Penalaran Umum',
      'Materi Penalaran Matematika',
      'Materi Pengetahuan Kuantitatif',
    ],
  );

  static const chapters = <Chapter>[
    Chapter(number: 1, title: 'Operasi Bilangan', progress: 0.7, minutes: 15, icon: LucideIcons.hash),
    Chapter(number: 2, title: 'KPK dan FPB', progress: 0.5, minutes: 12, icon: LucideIcons.layers),
    Chapter(number: 3, title: 'SPLSV', progress: 0.88, minutes: 20, icon: LucideIcons.equal),
    Chapter(number: 4, title: 'SPLDV', progress: 0.28, minutes: 25, icon: LucideIcons.rectangleHorizontal),
    Chapter(number: 5, title: 'Bangun Datar', progress: 0.7, minutes: 25, icon: LucideIcons.shapes),
  ];

  static const items = <LearningItem>[
    LearningItem(
      id: 'v1',
      type: LearningType.video,
      title: 'Penalaran Matematika: Membaca Grafik dan Pola',
      description:
          'Materi ringan untuk memahami pola dan grafik sebelum mengerjakan soal-soal penalaran matematika.',
      level: LearningLevel.dasar,
      isPremium: false,
      durationMinutes: 18,
      views: '12.4K tonton',
    ),
    LearningItem(
      id: 'v2',
      type: LearningType.video,
      title: 'Strategi Penalaran Matematika untuk Soal Campuran',
      description:
          'Tips cepat untuk membedakan soal logika, grafik, dan pola agar lebih fokus saat mengerjakan.',
      level: LearningLevel.menengah,
      isPremium: true,
      durationMinutes: 24,
      views: '8.1K tonton',
    ),
    LearningItem(
      id: 'm1',
      type: LearningType.modul,
      title: 'Modul Dasar Penalaran Matematika',
      description:
          'Ringkasan konsep dasar, contoh soal, dan langkah-langkah pengerjaan untuk pemula.',
      level: LearningLevel.dasar,
      isPremium: false,
      durationMinutes: 45,
      chapters: 6,
    ),
    LearningItem(
      id: 'l1',
      type: LearningType.latihan,
      title: 'Paket Latihan Penalaran Matematika UTBK',
      description:
          '40 soal latihan terstruktur dengan pembahasan singkat untuk meningkatkan kecepatan dan akurasi.',
      level: LearningLevel.menengah,
      isPremium: true,
      durationMinutes: 60,
      questions: 40,
    ),
    LearningItem(
      id: 'r1',
      type: LearningType.video,
      title: 'Tips Membaca Soal Penalaran Matematika',
      description:
          'Materi singkat untuk memperbaiki kecepatan membaca soal dan menghindari kesalahan fatal.',
      level: LearningLevel.dasar,
      isPremium: false,
      durationMinutes: 12,
      views: '5.8K tonton',
      recommended: true,
    ),
  ];
}
