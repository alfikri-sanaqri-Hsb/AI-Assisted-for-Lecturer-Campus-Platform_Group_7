import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_icon_tile.dart';
import '../../../core/widgets/app_progress_bar.dart';
import '../models/learning_models.dart';

/// Satu baris bab: ikon, judul, progres, dan estimasi menit.
class ChapterTile extends StatelessWidget {
  const ChapterTile({super.key, required this.chapter, this.onTap});

  final Chapter chapter;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(DS.cardRadius);

    return Container(
      decoration: BoxDecoration(borderRadius: radius, boxShadow: DS.cardShadow),
      child: Material(
        color: Colors.white,
        clipBehavior: Clip.antiAlias,
        borderRadius: radius,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              spacing: 12,
              children: [
                AppIconTile(icon: chapter.icon, size: 52, iconSize: 24, radius: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: 8,
                    children: [
                      Text(
                        'Bab ${chapter.number}: ${chapter.title}',
                        style: DS.itemTitle.copyWith(fontSize: 14),
                      ),
                      AppProgressBar(
                        value: chapter.progress,
                        showLabel: false,
                        height: 6,
                      ),
                      Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          '${chapter.minutes} min',
                          style: DS.caption.copyWith(fontSize: 11, height: 1.2),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
