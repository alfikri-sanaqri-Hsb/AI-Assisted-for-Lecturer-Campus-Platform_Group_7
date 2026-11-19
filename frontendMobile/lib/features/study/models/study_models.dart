import 'package:flutter/widgets.dart';
import '../../../core/widgets/app_pill.dart';

class ContinueLearning {
  const ContinueLearning({
    required this.title,
    required this.description,
    required this.progress,
  });

  final String title;
  final String description;
  final double progress; // 0.0 - 1.0
}

class DailyMission {
  const DailyMission({
    required this.icon,
    required this.title,
    required this.description,
    this.actionLabel = 'Mulai',
    this.practiceTopic,
  });

  final IconData icon;
  final String title;
  final String description;
  final String actionLabel;
  final String? practiceTopic; // jika ada, misi membuka latihan topik ini
}

class TopicRecommendation {
  const TopicRecommendation({
    required this.icon,
    required this.title,
    required this.description,
    required this.badgeLabel,
    this.badgeTone = AppPillTone.info,
    this.topic,
  });

  final IconData icon;
  final String title;
  final String description;
  final String badgeLabel;
  final AppPillTone badgeTone;
  final String? topic; // topik untuk latihan (jika kosong, memakai judul)
}

class ScheduleItem {
  const ScheduleItem({
    required this.icon,
    required this.title,
    required this.description,
    this.actionLabel = 'Lihat',
    this.isTryout = false,
  });

  final IconData icon;
  final String title;
  final String description;
  final String actionLabel;
  final bool isTryout; // true = membuka Daftar Tryout
}

class StudyTip {
  const StudyTip({
    required this.icon,
    required this.title,
    required this.description,
    required this.footnote,
  });

  final IconData icon;
  final String title;
  final String description;
  final String footnote;
}

class QuickAccessItem {
  const QuickAccessItem({
    required this.id,
    required this.icon,
    required this.label,
  });

  final String id; // materi | tryout | flashcard | bank-soal
  final IconData icon;
  final String label;
}
