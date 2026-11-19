import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_icon_tile.dart';
import '../models/membership_models.dart';

/// "Manfaat premium": kisi 2 kolom kartu manfaat.
class MembershipBenefitsSection extends StatelessWidget {
  const MembershipBenefitsSection({super.key, required this.benefits});

  final List<MembershipBenefit> benefits;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 12,
      children: [
        const _SectionTitle(
          title: 'Manfaat premium',
          subtitle: 'Akses lengkap untuk belajar lebih terarah dan terukur.',
        ),
        for (var i = 0; i < benefits.length; i += 2)
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: 12,
              children: [
                Expanded(child: _BenefitCard(benefit: benefits[i])),
                Expanded(
                  child: i + 1 < benefits.length
                      ? _BenefitCard(benefit: benefits[i + 1])
                      : const SizedBox.shrink(),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _BenefitCard extends StatelessWidget {
  const _BenefitCard({required this.benefit});

  final MembershipBenefit benefit;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: DS.surface,
        borderRadius: BorderRadius.circular(DS.cardRadius),
        boxShadow: DS.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 8,
        children: [
          AppIconTile(icon: benefit.icon, size: 32, iconSize: 18),
          Text(benefit.title, style: DS.itemTitle.copyWith(fontSize: 14)),
          Text(benefit.description, style: DS.caption),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 4,
      children: [
        Text(title, style: DS.sectionTitle),
        Text(subtitle, style: DS.body.copyWith(fontSize: 13)),
      ],
    );
  }
}
