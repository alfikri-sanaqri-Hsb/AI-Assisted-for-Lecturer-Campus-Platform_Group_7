import 'dart:typed_data';

class ProfileUser {
  const ProfileUser({
    required this.name,
    required this.university,
    required this.points,
    required this.streak,
    required this.level,
    required this.xp,
    required this.xpTarget,
    this.avatarAsset,
    this.avatarBytes,
    this.isPremium = false,
  });

  final String name;
  final String university;
  final String points;
  final int streak;
  final int level;
  final int xp;
  final int xpTarget;
  final String? avatarAsset;
  final Uint8List? avatarBytes;
  final bool isPremium; // sudah berlangganan?
}

enum StreakDayStatus { done, missed, upcoming }

class StreakDay {
  const StreakDay({required this.label, required this.status});

  final String label; // "Sen"
  final StreakDayStatus status;
}

class NotificationPref {
  const NotificationPref({
    required this.title,
    required this.description,
    required this.enabled,
  });

  final String title;
  final String description;
  final bool enabled;

  NotificationPref copyWith({bool? enabled}) => NotificationPref(
    title: title,
    description: description,
    enabled: enabled ?? this.enabled,
  );
}

class SubtestProgress {
  const SubtestProgress({required this.name, required this.percent});

  final String name;
  final int percent; // 0 - 100
}

class StudyModule {
  const StudyModule({
    required this.title,
    required this.episode,
    required this.imageAsset,
  });

  final String title;
  final String episode;
  final String imageAsset;
}

class FaqItem {
  const FaqItem({required this.question, required this.answer});

  final String question;
  final String answer;
}
