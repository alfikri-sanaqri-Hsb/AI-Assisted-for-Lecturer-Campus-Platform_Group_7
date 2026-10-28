import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_clock_badge.dart';
import '../../../core/widgets/app_info_row.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/tryout_models.dart';

/// Kartu "Tryout saya" di bagian atas halaman.
class MyTryoutCard extends StatelessWidget {
  const MyTryoutCard({super.key, required this.data, this.onStart});

  final MyTryout data;
  final VoidCallback? onStart;

  @override
  Widget build(BuildContext context) {
    return AppSurfaceCard(
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Text(
                'Tryout saya',
                style: DS.itemTitle.copyWith(fontSize: 14, height: 1.45),
              ),
            ),
            AppPill(
              label: '${data.registeredCount} terdaftar',
              tone: AppPillTone.successDark,
              fontWeight: FontWeight.w500,
            ),
          ],
        ),
        Text(data.title, style: DS.itemTitle.copyWith(height: 1.45)),
        AppInfoRow(leading: const AppClockBadge(), text: data.subtitle),
        AppActionButton(
          label: 'Mulai Tryout',
          variant: AppActionVariant.soft,
          height: 48,
          onPressed: onStart,
        ),
      ],
    );
  }
}
