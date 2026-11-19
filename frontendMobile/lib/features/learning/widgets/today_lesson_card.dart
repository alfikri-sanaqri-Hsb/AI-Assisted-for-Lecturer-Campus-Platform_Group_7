import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_icon_tile.dart';
import '../../../core/widgets/app_progress_bar.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/learning_models.dart';

/// "Materi Hari Ini": ringkasan kurikulum + daftar materi yang bisa dibuka.
class TodayLessonCard extends StatelessWidget {
  const TodayLessonCard({super.key, required this.lesson, this.onLessonTap});

  final TodayLesson lesson;
  final ValueChanged<String>? onLessonTap;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Materi Hari Ini: ${lesson.subject}',
      children: [
        Row(
          spacing: 12,
          children: [
            const AppIconTile(icon: LucideIcons.folder, size: 48, iconSize: 24, radius: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: 8,
                children: [
                  Text(lesson.title, style: DS.itemTitle.copyWith(fontSize: 15)),
                  AppProgressBar(value: lesson.progress),
                ],
              ),
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (final (i, l) in lesson.lessons.indexed) ...[
              if (i > 0) const Divider(height: 1, thickness: 1, color: DS.border),
              InkWell(
                onTap: onLessonTap == null ? null : () => onLessonTap!(l),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                  decoration: i == 0
                      ? BoxDecoration(
                          color: DS.primarySoft,
                          borderRadius: BorderRadius.circular(8),
                        )
                      : null,
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          l,
                          style: DS.body.copyWith(
                            fontWeight: i == 0 ? FontWeight.w600 : FontWeight.w500,
                            color: i == 0 ? DS.primary : DS.textPrimary,
                          ),
                        ),
                      ),
                      Icon(
                        LucideIcons.chevronRight,
                        size: 18,
                        color: i == 0 ? DS.primary : DS.textSecondary,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
