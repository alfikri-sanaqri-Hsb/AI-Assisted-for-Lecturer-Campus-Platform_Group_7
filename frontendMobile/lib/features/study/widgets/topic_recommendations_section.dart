import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_icon_tile.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/study_models.dart';

class TopicRecommendationsSection extends StatelessWidget {
  const TopicRecommendationsSection({
    super.key,
    required this.topics,
    this.onTopicTap,
  });

  final List<TopicRecommendation> topics;
  final ValueChanged<TopicRecommendation>? onTopicTap;

  @override
  Widget build(BuildContext context) {
    // Susun 2 kartu per baris; kartu ganjil terakhir melebar penuh.
    final rows = <List<TopicRecommendation>>[
      for (var i = 0; i < topics.length; i += 2)
        topics.sublist(i, i + 2 > topics.length ? topics.length : i + 2),
    ];

    return AppSectionCard(
      title: 'Rekomendasi Topik',
      badge: AppPill(label: '${topics.length} Prioritas'),
      children: [
        for (final pair in rows)
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: 12,
              children: [
                for (final t in pair)
                  Expanded(
                    child: _TopicCard(
                      topic: t,
                      onTap: onTopicTap == null ? null : () => onTopicTap!(t),
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}

class _TopicCard extends StatelessWidget {
  const _TopicCard({required this.topic, this.onTap});

  final TopicRecommendation topic;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: DS.background,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DS.cardRadius),
        side: const BorderSide(color: DS.border),
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 8,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                spacing: 4,
                children: [
                  AppIconTile(icon: topic.icon, size: 32, iconSize: 18),
                  Flexible(
                    child: AppPill(
                      label: topic.badgeLabel,
                      tone: topic.badgeTone,
                    ),
                  ),
                ],
              ),
              Text(topic.title, style: DS.cardTitle),
              Text(topic.description, style: DS.caption),
            ],
          ),
        ),
      ),
    );
  }
}