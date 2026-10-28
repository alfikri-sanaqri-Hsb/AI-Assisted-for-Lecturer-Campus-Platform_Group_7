import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_list_item.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/study_models.dart';

class StudyTipsSection extends StatelessWidget {
  const StudyTipsSection({super.key, required this.tip});

  final StudyTip tip;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Tips Belajar Hari Ini',
      badge: const AppPill(label: 'Bermanfaat', tone: AppPillTone.success),
      children: [
        AppListItem(
          icon: tip.icon,
          title: tip.title,
          subtitle: tip.description,
          tileRadius: 12,
        ),
        Text(tip.footnote, style: DS.caption),
      ],
    );
  }
}