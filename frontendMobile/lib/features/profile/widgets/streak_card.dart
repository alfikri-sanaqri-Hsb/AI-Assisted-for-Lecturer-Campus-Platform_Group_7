import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/profile_models.dart';

/// Kartu "Streak Belajar": jumlah hari beruntun + status tujuh hari.
class StreakCard extends StatelessWidget {
  const StreakCard({super.key, required this.streak, required this.week});

  final int streak;
  final List<StreakDay> week;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Streak Belajar',
      badge: AppPill(label: '$streak hari', tone: AppPillTone.warning),
      children: [
        Row(
          spacing: 6,
          children: [
            for (final d in week) Expanded(child: _DayTile(day: d)),
          ],
        ),
        Text(
          'Pertahankan streak-mu dengan menyelesaikan misi harian.',
          style: DS.caption,
        ),
      ],
    );
  }
}

class _DayTile extends StatelessWidget {
  const _DayTile({required this.day});

  final StreakDay day;

  @override
  Widget build(BuildContext context) {
    final (Color bg, Widget icon) = switch (day.status) {
      StreakDayStatus.done => (
          DS.primarySoft,
          const Icon(Icons.check_circle_rounded, size: 20, color: DS.primary),
        ),
      StreakDayStatus.missed => (
          DS.dangerSoft,
          const Icon(Icons.error_rounded, size: 20, color: DS.danger),
        ),
      StreakDayStatus.upcoming => (
          DS.background,
          const Icon(Icons.circle_outlined, size: 20, color: DS.border),
        ),
    };

    return Container(
      height: 60,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        spacing: 4,
        children: [
          icon,
          Text(day.label, style: DS.caption.copyWith(fontSize: 11, height: 1.2)),
        ],
      ),
    );
  }
}
