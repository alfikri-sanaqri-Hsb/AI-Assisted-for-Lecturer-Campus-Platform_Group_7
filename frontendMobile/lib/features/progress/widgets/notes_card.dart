import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_dashed_box.dart';
import '../../../core/widgets/app_inset_tile.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';

/// Kartu "Catatan". Jika belum ada catatan, tampil kotak putus-putus berisi
/// petunjuk; jika ada, tampil daftar catatan.
class NotesCard extends StatelessWidget {
  const NotesCard({super.key, this.notes = const [], this.onCreate});

  final List<String> notes;
  final VoidCallback? onCreate;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      elevated: true,
      title: 'Catatan',
      badge: AppPill(
        label: 'Buat',
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        onTap: onCreate,
      ),
      children: [
        if (notes.isEmpty)
          AppDashedBox(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 8,
              children: [
                const Text(
                  'Tulis catatan singkat tentang kekuatan, kelemahan, atau langkah belajar berikutnya.',
                  style: DS.body,
                ),
                Text(
                  'Contoh: fokus ulang LBI & PBM sebelum tryout berikutnya.',
                  style: DS.caption.copyWith(color: DS.primary),
                ),
              ],
            ),
          )
        else
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 8,
            children: [
              for (final (i, n) in notes.indexed)
                AppInsetTile(title: 'Catatan ${i + 1}', subtitle: n),
            ],
          ),
      ],
    );
  }
}
