import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';

/// Kolom pencarian putih dengan ikon cari dan tombol hapus.
class LearningSearchField extends StatelessWidget {
  const LearningSearchField({
    super.key,
    required this.controller,
    required this.onChanged,
    required this.onClear,
  });

  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(DS.cardRadius),
        boxShadow: DS.cardShadow,
      ),
      child: Row(
        spacing: 10,
        children: [
          const Icon(LucideIcons.search, size: 20, color: DS.primary),
          Expanded(
            child: TextField(
              controller: controller,
              onChanged: onChanged,
              textInputAction: TextInputAction.search,
              style: DS.body.copyWith(color: DS.primary, fontWeight: FontWeight.w500),
              decoration: InputDecoration(
                hintText: 'Cari video, modul, atau latihan',
                hintStyle: DS.body,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
          if (controller.text.isNotEmpty)
            InkWell(
              onTap: onClear,
              customBorder: const CircleBorder(),
              child: Container(
                width: 28,
                height: 28,
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                  color: DS.background,
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.x, size: 14, color: DS.textSecondary),
              ),
            ),
        ],
      ),
    );
  }
}
