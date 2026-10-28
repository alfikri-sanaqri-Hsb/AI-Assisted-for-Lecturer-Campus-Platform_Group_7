import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_clock_badge.dart';
import '../../../core/widgets/app_info_row.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/tryout_detail.dart';

/// Kartu ringkasan di bagian atas halaman Detail Tryout.
class TryoutDetailSummaryCard extends StatelessWidget {
  const TryoutDetailSummaryCard({super.key, required this.detail});

  final TryoutDetail detail;

  @override
  Widget build(BuildContext context) {
    return AppSurfaceCard(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            AppPill(label: detail.trackLabel, fontWeight: FontWeight.w500),
            AppPill(
              label: detail.statusLabel,
              tone: detail.isPremium
                  ? AppPillTone.premium
                  : AppPillTone.successDark,
              fontWeight: FontWeight.w500,
            ),
          ],
        ),
        Text(
          detail.title,
          style: DS.itemTitle.copyWith(fontSize: 22, height: 1.45),
        ),
        AppInfoRow.icon(
          icon: LucideIcons.calendarDays,
          text: detail.scheduleLabel,
        ),
        AppInfoRow(leading: const AppClockBadge(), text: detail.summary),
        Text(detail.description, style: DS.body),
      ],
    );
  }
}
