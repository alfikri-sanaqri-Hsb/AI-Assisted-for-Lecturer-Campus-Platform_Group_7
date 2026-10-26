import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/tryout_detail.dart';

class TryoutSubtestsSection extends StatelessWidget {
  const TryoutSubtestsSection({super.key, required this.subtests});

  final List<TryoutSubtest> subtests;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 12,
      children: [
        Text('Apa yang diujikan?', style: DS.sectionTitle.copyWith(height: 1.45)),
        AppSurfaceCard(
          spacing: 0,
          children: [
            for (final (i, s) in subtests.indexed)
              _SubtestTile(
                subtest: s,
                showDivider: i < subtests.length - 1,
              ),
          ],
        ),
      ],
    );
  }
}

class _SubtestTile extends StatelessWidget {
  const _SubtestTile({required this.subtest, required this.showDivider});

  final TryoutSubtest subtest;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 8,
        children: [
          Text(
            subtest.name,
            style: DS.body.copyWith(
              fontWeight: FontWeight.w500,
              color: DS.textPrimary,
            ),
          ),
          Text(subtest.summary, style: DS.caption),
          if (showDivider)
            const Divider(height: 1, thickness: 1, color: DS.borderSoft),
        ],
      ),
    );
  }
}
