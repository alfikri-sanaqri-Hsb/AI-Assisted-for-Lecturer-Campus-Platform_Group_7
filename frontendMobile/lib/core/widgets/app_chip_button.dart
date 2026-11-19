import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Tombol kapsul kecil (tinggi 32). filled = biru terang, selain itu biru muda.
class AppChipButton extends StatelessWidget {
  const AppChipButton({
    super.key,
    required this.label,
    this.filled = false,
    this.onTap,
  });

  final String label;
  final bool filled;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: filled ? DS.accent : DS.primarySoft,
      clipBehavior: Clip.antiAlias,
      shape: const StadiumBorder(),
      child: InkWell(
        onTap: onTap,
        child: SizedBox(
          height: 32,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Center(
              widthFactor: 1,
              child: Text(
                label,
                style: TextStyle(
                  fontFamily: DS.fontFamily,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: filled ? Colors.white : DS.primary,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
