import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_filter_chip.dart';
import '../models/tryout_models.dart';

/// "Pilih Jalur Tryout": filter jalur + filter ketersediaan.
class TryoutFilterSection extends StatelessWidget {
  const TryoutFilterSection({
    super.key,
    required this.selectedTrack,
    required this.selectedAccess,
    required this.onTrackChanged,
    required this.onAccessChanged,
  });

  final TryoutTrack selectedTrack;
  final TryoutAccessFilter selectedAccess;
  final ValueChanged<TryoutTrack> onTrackChanged;
  final ValueChanged<TryoutAccessFilter> onAccessChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 12,
      children: [
        Text(
          'Pilih Jalur Tryout',
          style: DS.sectionTitle.copyWith(height: 1.45),
        ),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final t in TryoutTrack.values)
              AppFilterChip(
                label: t.label,
                selected: t == selectedTrack,
                onTap: () => onTrackChanged(t),
              ),
          ],
        ),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final a in TryoutAccessFilter.values)
              AppFilterChip(
                label: a.label,
                selected: a == selectedAccess,
                onTap: () => onAccessChanged(a),
              ),
          ],
        ),
      ],
    );
  }
}
