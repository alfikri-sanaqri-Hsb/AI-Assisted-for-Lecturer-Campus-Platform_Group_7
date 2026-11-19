import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_progress_bar.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/progress_models.dart';

/// Kartu "Statistik TryOut": kekuatan dan kelemahan per subtes (2 kolom).
class TryoutStatsCard extends StatelessWidget {
  const TryoutStatsCard({
    super.key,
    required this.tryoutLabel,
    required this.stats,
  });

  final String tryoutLabel;
  final List<SubjectStat> stats;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      elevated: true,
      title: 'Statistik TryOut',
      badge: AppPill(
        label: tryoutLabel,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      ),
      children: [
        for (var i = 0; i < stats.length; i += 2)
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: 12,
              children: [
                Expanded(child: _StatTile(stat: stats[i])),
                Expanded(
                  child: i + 1 < stats.length
                      ? _StatTile(stat: stats[i + 1])
                      : const SizedBox.shrink(),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.stat});

  final SubjectStat stat;

  @override
  Widget build(BuildContext context) {
    final strong = stat.isStrong;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: DS.background,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 6,
        children: [
          Text(
            stat.code,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            softWrap: true,
            style: DS.caption.copyWith(
              fontWeight: FontWeight.w700,
              height: 1.25,
              color: DS.textPrimary,
            ),
          ),
          Text(
            stat.topic,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            softWrap: true,
            style: DS.caption.copyWith(
              fontWeight: FontWeight.w600,
              height: 1.25,
              color: strong ? DS.primary : DS.textSecondary,
            ),
          ),
          AppProgressBar(
            value: stat.value,
            showLabel: false,
            color: strong ? DS.accent : DS.amber,
          ),
          Text(
            strong ? 'Kekuatan belajar' : 'Perlu ditingkatkan',
            style: DS.caption.copyWith(height: 1.2),
          ),
        ],
      ),
    );
  }
}
