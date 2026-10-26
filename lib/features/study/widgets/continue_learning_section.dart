import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_progress_bar.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/study_models.dart';

class ContinueLearningSection extends StatelessWidget {
  const ContinueLearningSection({
    super.key,
    required this.data,
    this.onContinue,
    this.onDetail,
  });

  final ContinueLearning data;
  final VoidCallback? onContinue;
  final VoidCallback? onDetail;

  @override
  Widget build(BuildContext context) {
    final percent = (data.progress * 100).round();
    return AppSectionCard(
      title: 'Lanjutkan Belajar',
      badge: AppPill(label: '$percent% Selesai'),
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 8,
          children: [
            Text(data.title, style: DS.heading),
            Text(data.description, style: DS.body),
          ],
        ),
        AppProgressBar(value: data.progress),
        Row(
          spacing: 8,
          children: [
            Expanded(
              child: AppActionButton(label: 'Lanjutkan', onPressed: onContinue),
            ),
            Expanded(
              child: AppActionButton(
                label: 'Lihat Detail',
                variant: AppActionVariant.outlined,
                onPressed: onDetail,
              ),
            ),
          ],
        ),
      ],
    );
  }
}