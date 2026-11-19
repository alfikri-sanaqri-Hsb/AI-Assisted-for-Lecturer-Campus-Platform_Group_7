import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_chip_button.dart';
import '../../../core/widgets/app_inset_tile.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/progress_models.dart';

/// Kartu "Akses Subtes": daftar subtes dengan tombol "Check".
class SubtestAccessCard extends StatelessWidget {
  const SubtestAccessCard({super.key, required this.subtests, this.onCheck});

  final List<SubtestAccess> subtests;
  final ValueChanged<SubtestAccess>? onCheck;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      elevated: true,
      title: 'Akses Subtes',
      badge: Text('${subtests.length} tersedia', style: DS.label),
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 8,
          children: [
            for (final s in subtests)
              AppInsetTile(
                title: s.name,
                subtitle: s.summary,
                trailing: AppChipButton(
                  label: 'Check',
                  onTap: onCheck == null ? null : () => onCheck!(s),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
