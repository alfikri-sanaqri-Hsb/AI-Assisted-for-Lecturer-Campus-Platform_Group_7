import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_chip_button.dart';
import '../../../core/widgets/app_inset_tile.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/progress_models.dart';

/// Kartu "Riwayat Tryout": hasil terbaru + daftar tryout sebelumnya.
class TryoutHistoryCard extends StatelessWidget {
  const TryoutHistoryCard({
    super.key,
    required this.latest,
    required this.history,
    this.onOpen,
  });

  final TryoutResult latest;
  final List<TryoutResult> history;
  final ValueChanged<TryoutResult>? onOpen;

  static const _pillPadding = EdgeInsets.symmetric(horizontal: 10, vertical: 5);

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      elevated: true,
      title: 'Riwayat Tryout',
      badge: AppPill(
        label: '${1 + history.length} tryout',
        padding: _pillPadding,
      ),
      children: [
        _LatestRow(result: latest, onOpen: () => onOpen?.call(latest)),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 8,
          children: [
            for (final h in history)
              InkWell(
                borderRadius: BorderRadius.circular(10),
                onTap: onOpen == null ? null : () => onOpen!(h),
                child: AppInsetTile(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  title: h.label,
                  subtitle: '${h.score} • ${h.status}',
                  trailing: AppPill(label: h.status, padding: _pillPadding),
                ),
              ),
          ],
        ),
      ],
    );
  }
}

class _LatestRow extends StatelessWidget {
  const _LatestRow({required this.result, this.onOpen});

  final TryoutResult result;
  final VoidCallback? onOpen;

  @override
  Widget build(BuildContext context) {
    final meta = DS.caption.copyWith(fontSize: 13);

    return Row(
      spacing: 12,
      children: [
        Container(
          width: 64,
          height: 64,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: DS.primarySoft,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            '${result.score}',
            style: const TextStyle(
              fontFamily: DS.fontFamily,
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: DS.primary,
            ),
          ),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 4,
            children: [
              Text(
                result.label,
                style: DS.cardTitle.copyWith(fontWeight: FontWeight.w700),
              ),
              if (result.dateLabel != null)
                Text(result.dateLabel!, style: meta),
              if (result.summary != null) Text(result.summary!, style: meta),
            ],
          ),
        ),
        AppChipButton(label: 'Lihat', filled: true, onTap: onOpen),
      ],
    );
  }
}
