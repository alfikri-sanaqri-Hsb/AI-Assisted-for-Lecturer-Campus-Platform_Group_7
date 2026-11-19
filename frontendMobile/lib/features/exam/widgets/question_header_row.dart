import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';

/// Baris "Soal N dari M" + tombol "Daftar soal".
class QuestionHeaderRow extends StatelessWidget {
  const QuestionHeaderRow({
    super.key,
    required this.current,
    required this.total,
    required this.onOpenPalette,
  });

  final int current; // 1-based
  final int total;
  final VoidCallback onOpenPalette;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Soal $current dari $total',
          style: DS.sectionTitle,
        ),
        Material(
          color: Colors.white,
          clipBehavior: Clip.antiAlias,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: DS.borderSoft),
          ),
          child: InkWell(
            onTap: onOpenPalette,
            child: SizedBox(
              height: 40,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: 6,
                  children: [
                    const Icon(LucideIcons.layoutGrid,
                        size: 16, color: DS.primary),
                    Text(
                      'Daftar soal',
                      style: DS.label.copyWith(fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
