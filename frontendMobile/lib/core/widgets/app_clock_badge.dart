import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../constants/design_tokens.dart';

/// Lingkaran biru 16px berisi ikon jam putih (penanda durasi).
class AppClockBadge extends StatelessWidget {
  const AppClockBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 16,
      height: 16,
      alignment: Alignment.center,
      decoration: const BoxDecoration(
        color: DS.primary,
        shape: BoxShape.circle,
      ),
      child: const Icon(LucideIcons.clock, size: 11, color: Colors.white),
    );
  }
}
