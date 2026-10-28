import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_list_item.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/study_models.dart';

class UpcomingScheduleSection extends StatelessWidget {
  const UpcomingScheduleSection({
    super.key,
    required this.items,
    this.onItemTap,
  });

  final List<ScheduleItem> items;
  final ValueChanged<ScheduleItem>? onItemTap;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Jadwal Terdekat',
      badge: AppPill(label: '${items.length} Agenda', tone: AppPillTone.warning),
      children: [
        for (final (i, item) in items.indexed) ...[
          if (i > 0) const Divider(height: 1, thickness: 1, color: DS.border),
          AppListItem(
            icon: item.icon,
            title: item.title,
            subtitle: item.description,
            tileSize: 44,
            tileRadius: 12,
            trailing: AppPill(
              label: item.actionLabel,
              tone: AppPillTone.outline,
              onTap: onItemTap == null ? null : () => onItemTap!(item),
            ),
          ),
        ],
      ],
    );
  }
}
