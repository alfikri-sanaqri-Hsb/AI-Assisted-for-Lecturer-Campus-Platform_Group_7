import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_bottom_action_bar.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../models/tryout_models.dart';
import '../services/tryout_content_service.dart';
import '../widgets/tryout_detail_summary_card.dart';
import '../widgets/tryout_guidelines_section.dart';
import '../widgets/tryout_subtests_section.dart';

/// Halaman "Detail Tryout_v1".
class TryoutDetailScreen extends StatelessWidget {
  const TryoutDetailScreen({super.key, required this.item});

  final TryoutItem item;

  @override
  Widget build(BuildContext context) {
    final detail = TryoutContentService.detailFor(item);

    return AppHeaderScaffold(
      title: 'Detail Tryout',
      subtitle: 'Kenali ujiannya, siapkan strategi terbaikmu.',
      children: [
        TryoutDetailSummaryCard(detail: detail),
        TryoutSubtestsSection(subtests: detail.subtests),
        TryoutGuidelinesSection(steps: detail.guidelines),
      ],
      bottomBar: AppBottomActionBar(
        children: [
          Row(
            spacing: 8,
            children: [
              Expanded(
                child: Text(
                  'Biaya pendaftaran',
                  style: DS.itemTitle.copyWith(height: 1.45),
                ),
              ),
              Text(
                detail.priceLabel,
                style: const TextStyle(
                  fontFamily: DS.fontFamily,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: DS.primary,
                ),
              ),
            ],
          ),
          AppActionButton(
            label: detail.ctaLabel,
            height: 48,
            // TODO: daftar tryout ke server / buka halaman membership
          ),
          Text(
            detail.ctaNote,
            textAlign: TextAlign.center,
            style: DS.caption,
          ),
        ],
      ),
    );
  }
}
