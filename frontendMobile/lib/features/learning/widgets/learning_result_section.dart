import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/learning_models.dart';
import 'learning_item_card.dart';

/// Kartu hasil pencarian per kelompok (Video, Modul & Latihan, Rekomendasi).
class LearningResultSection extends StatelessWidget {
  const LearningResultSection({
    super.key,
    required this.title,
    required this.items,
    required this.onItemTap,
    this.onSeeAll,
  });

  final String title;
  final List<LearningItem> items;
  final ValueChanged<LearningItem> onItemTap;
  final VoidCallback? onSeeAll;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: title,
      badge: onSeeAll == null
          ? null
          : InkWell(
              onTap: onSeeAll,
              child: Text('Lihat semua',
                  style: DS.label.copyWith(fontWeight: FontWeight.w500)),
            ),
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 12,
          children: [
            for (final i in items)
              LearningItemCard(item: i, onTap: () => onItemTap(i)),
          ],
        ),
      ],
    );
  }
}
