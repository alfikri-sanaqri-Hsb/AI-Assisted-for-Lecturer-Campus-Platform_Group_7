import 'package:flutter/widgets.dart';

enum LearningType {
  video,
  modul,
  latihan;

  String get label => switch (this) {
    LearningType.video => 'Video',
    LearningType.modul => 'Modul',
    LearningType.latihan => 'Latihan',
  };
}

enum LearningLevel {
  semua,
  dasar,
  menengah,
  lanjutan;

  String get label => switch (this) {
    LearningLevel.semua => 'Semua Level',
    LearningLevel.dasar => 'Dasar',
    LearningLevel.menengah => 'Menengah',
    LearningLevel.lanjutan => 'Lanjutan',
  };
}

/// Satu materi pada hasil Cari Materi (video, modul, atau paket latihan).
class LearningItem {
  const LearningItem({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.level,
    required this.isPremium,
    required this.durationMinutes,
    this.subject = 'Matematika',
    this.chapters,
    this.questions,
    this.views,
    this.recommended = false,
    this.backendId,
    this.contentUrl,
  });

  final String id;
  final LearningType type;
  final String title;
  final String description;
  final LearningLevel level;
  final bool isPremium;
  final int durationMinutes;
  final String subject;
  final int? chapters; // modul
  final int? questions; // paket latihan
  final String? views; // video, mis. "12.4K tonton"
  final bool recommended;
  final int? backendId;
  final String? contentUrl;
}

/// Kartu "Materi Hari Ini".
class TodayLesson {
  const TodayLesson({
    required this.subject,
    required this.title,
    required this.progress,
    required this.lessons,
  });

  final String subject;
  final String title;
  final double progress; // 0.0 - 1.0
  final List<String> lessons;
}

/// Satu bab pada "Bab Selanjutnya".
class Chapter {
  const Chapter({
    required this.number,
    required this.title,
    required this.progress,
    required this.minutes,
    required this.icon,
  });

  final int number;
  final String title;
  final double progress;
  final int minutes;
  final IconData icon;
}
