import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/database/app_database.dart';
import '../../../core/widgets/app_pill.dart';
import '../models/study_models.dart';

/// Sumber konten halaman Study.
/// Sekarang masih data statis. Nanti ganti isi class ini dengan
/// pemanggilan API / repository tanpa mengubah UI.
abstract final class StudyContentService {
  static const continueLearning = ContinueLearning(
    title: 'Materi Eksponen: Sifat Dasar',
    description:
        'Lanjutkan dari materi yang terakhir kamu buka agar progres belajarmu tetap konsisten.',
    progress: 0.6,
  );

  static const missions = <DailyMission>[
    DailyMission(
      icon: LucideIcons.bookOpen,
      title: 'Selesaikan 10 Soal Pengetahuan Kuantitatif',
      description:
          'Misi ini membantu kamu memperkuat logika matematika dan kecepatan menjawab.',
    ),
    DailyMission(
      icon: LucideIcons.circleX,
      title: 'Selesaikan 5 Flashcard',
      description:
          'Pahami konsep penting dengan cepat agar lebih mudah diingat saat tryout.',
    ),
  ];

  static const missionsFootnote =
      'Selesaikan misi harian untuk meningkatkan penguasaan materi dan memperpanjang streak belajarmu.';

  /// Data cadangan jika database lokal masih kosong.
  static const topics = <TopicRecommendation>[
    TopicRecommendation(
      icon: LucideIcons.calculator,
      title: 'Perkuat kelemahan: Penalaran Matematika',
      description: 'Fokus pada pola, logika, dan kecepatan menyelesaikan soal.',
      badgeLabel: 'Perlu dikuatkan',
      badgeTone: AppPillTone.warning,
    ),
    TopicRecommendation(
      icon: LucideIcons.refreshCw,
      title: 'Target Ulang: Penalaran Umum',
      description: 'Ulangi materi yang belum kuat agar penguasaannya lebih stabil.',
      badgeLabel: 'Target ulang',
    ),
    TopicRecommendation(
      icon: LucideIcons.fileText,
      title: 'Tinjau Soal: Logika',
      description: 'Cek soal yang sering salah agar kamu lebih siap saat tryout.',
      badgeLabel: 'Tinjau soal',
    ),
  ];

  /// Mengubah data Drift (StudyItems) menjadi kartu rekomendasi topik.
  static List<TopicRecommendation> topicsFromDb(List<StudyItem> items) {
    return items.take(3).map((item) {
      final done = item.isCompleted;
      return TopicRecommendation(
        icon: done ? LucideIcons.fileText : LucideIcons.calculator,
        title: item.title,
        description: item.category,
        badgeLabel: done ? 'Tinjau soal' : 'Perlu dikuatkan',
        badgeTone: done ? AppPillTone.info : AppPillTone.warning,
      );
    }).toList();
  }

  static const schedule = <ScheduleItem>[
    ScheduleItem(
      icon: LucideIcons.calendar,
      title: '24 Jan: TryOut Akbar UTBK',
      description:
          'Persiapan simulasi tryout untuk mengukur penguasaan materi dan kecepatan menjawab.',
    ),
    ScheduleItem(
      icon: LucideIcons.video,
      title: '26 Jan: Join Live Class (PM)',
      description:
          'Ikuti sesi live untuk memperjelas konsep sulit dan mendapatkan penjelasan langsung dari mentor.',
    ),
  ];

  static const tip = StudyTip(
    icon: LucideIcons.clock,
    title: 'Gunakan Teknik Pomodoro',
    description:
        'Belajar 25 menit, istirahat 5 menit. Metode ini membantu kamu fokus tanpa kelelahan.',
    footnote:
        'Tetapkan jadwal belajar singkat, kerjakan misi, dan ulangi materi yang belum kuat. Dengan rutinitas yang konsisten, progres belajarmu akan lebih stabil.',
  );

  static const quickAccess = <QuickAccessItem>[
    QuickAccessItem(icon: LucideIcons.book, label: 'Materi'),
    QuickAccessItem(icon: LucideIcons.circlePlay, label: 'TryOut Online'),
    QuickAccessItem(icon: LucideIcons.circleX, label: 'Flashcard'),
    QuickAccessItem(icon: LucideIcons.folder, label: 'Bank Soal'),
  ];
}