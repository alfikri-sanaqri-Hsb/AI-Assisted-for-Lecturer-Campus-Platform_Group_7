import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_list_item.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/study_models.dart';

class DailyMissionsSection extends StatelessWidget {
  const DailyMissionsSection({
    super.key,
    required this.missions,
    required this.footnote,
    this.onMissionTap,
  });

  final List<DailyMission> missions;
  final String footnote;
  final ValueChanged<DailyMission>? onMissionTap;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Misi Harian',
      badge: AppPill(label: '${missions.length} Misi'),
      children: [
        for (final (i, m) in missions.indexed) ...[
          if (i > 0) const Divider(height: 1, thickness: 1, color: DS.border),
          AppListItem(
            icon: m.icon,
            title: m.title,
            subtitle: m.description,
            trailing: AppPill(
              label: m.actionLabel,
              tone: AppPillTone.outline,
              onTap: onMissionTap == null ? null : () => onMissionTap!(m),
            ),
          ),
        ],
        Text(footnote, style: DS.caption),
      ],
    );
  }
}