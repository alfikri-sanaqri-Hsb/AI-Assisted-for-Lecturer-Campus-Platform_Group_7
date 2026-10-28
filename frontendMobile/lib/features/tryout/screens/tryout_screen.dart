import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/tryout_models.dart';
import '../providers/tryout_provider.dart';
import '../widgets/my_tryout_card.dart';
import '../widgets/tryout_card.dart';
import '../widgets/tryout_filter_section.dart';
import 'tryout_detail_screen.dart';

/// Halaman "Daftar Tryout_v1".
/// Provider dibuat di sini, jadi tidak perlu mengubah main.dart.
class TryoutScreen extends StatelessWidget {
  const TryoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TryoutProvider(),
      child: const _TryoutView(),
    );
  }
}

class _TryoutView extends StatelessWidget {
  const _TryoutView();

  void _openDetail(BuildContext context, TryoutItem item) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => TryoutDetailScreen(item: item)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final p = context.watch<TryoutProvider>();
    final items = p.filtered;

    return AppHeaderScaffold(
      title: 'Daftar Tryout',
      subtitle: 'Ukur kemampuanmu, selangkah lebih dekat ke PTN impian.',
      children: [
        MyTryoutCard(
          data: p.myTryout,
          // TODO: buka halaman Kerjakan Tryout
        ),
        TryoutFilterSection(
          selectedTrack: p.track,
          selectedAccess: p.access,
          onTrackChanged: p.selectTrack,
          onAccessChanged: p.selectAccess,
        ),
        Row(
          spacing: 8,
          children: [
            Expanded(
              child: Text(
                'Tryout tersedia',
                style: DS.sectionTitle.copyWith(height: 1.45),
              ),
            ),
            Text(
              '${items.length} tryout',
              style: DS.label.copyWith(fontWeight: FontWeight.w500),
            ),
          ],
        ),
        if (items.isEmpty)
          const AppSurfaceCard(
            children: [
              Text(
                'Belum ada tryout untuk pilihan ini.',
                textAlign: TextAlign.center,
                style: DS.caption,
              ),
            ],
          )
        else
          for (final item in items)
            TryoutCard(
              item: item,
              onAction: () => _openDetail(context, item),
            ),
        const Text(
          'Jalur lain, mimpi yang sama. Pilih jalur untuk melihat tryout Mandiri PTN atau Kedinasan.',
          textAlign: TextAlign.center,
          style: DS.caption,
        ),
      ],
    );
  }
}
