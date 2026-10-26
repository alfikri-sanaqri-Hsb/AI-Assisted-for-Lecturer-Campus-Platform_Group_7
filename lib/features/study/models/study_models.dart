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
  });

  final IconData icon;
  final String title;
  final String description;
  final String actionLabel;
}

class TopicRecommendation {
  const TopicRecommendation({
    required this.icon,
    required this.title,
    required this.description,
    required this.badgeLabel,
    this.badgeTone = AppPillTone.info,
  });

  final IconData icon;
  final String title;
  final String description;
  final String badgeLabel;
  final AppPillTone badgeTone;
}

class ScheduleItem {
  const ScheduleItem({
    required this.icon,
    required this.title,
    required this.description,
    this.actionLabel = 'Lihat',
  });

  final IconData icon;
  final String title;
  final String description;
  final String actionLabel;
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
  const QuickAccessItem({required this.icon, required this.label});

  final IconData icon;
  final String label;
}