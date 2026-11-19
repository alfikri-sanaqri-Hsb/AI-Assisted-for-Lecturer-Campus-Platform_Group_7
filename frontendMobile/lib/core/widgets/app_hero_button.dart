import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Tombol di dalam hero (tinggi 40): kaca transparan atau putih penuh.
class AppHeroButton extends StatelessWidget {
  const AppHeroButton({
    super.key,
    required this.label,
    required this.icon,
    this.filled = false,
    this.onTap,
  });

  final String label;
  final IconData icon;
  final bool filled;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final fg = filled ? DS.primary : Colors.white;

    return Material(
      color: filled ? Colors.white : DS.glass,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: filled ? BorderSide.none : const BorderSide(color: DS.glassBorder),
      ),
      child: InkWell(
        onTap: onTap,
        child: SizedBox(
          height: 40,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: 8,
            children: [
              Icon(icon, size: 16, color: fg),
              Text(
                label,
                style: TextStyle(
                  fontFamily: DS.fontFamily,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: fg,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
