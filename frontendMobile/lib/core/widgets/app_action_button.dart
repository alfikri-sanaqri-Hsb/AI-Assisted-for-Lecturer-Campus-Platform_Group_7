import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

enum AppActionVariant { filled, outlined, soft }

void _noop() {}

/// Tombol aksi: filled (biru), soft (biru muda), outlined (putih + border).
class AppActionButton extends StatelessWidget {
  const AppActionButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = AppActionVariant.filled,
    this.height = 40,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppActionVariant variant;
  final double height;

  @override
  Widget build(BuildContext context) {
    final shape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(8));
    final callback = onPressed ?? _noop;

    final Widget button = switch (variant) {
      AppActionVariant.filled => ElevatedButton(
          onPressed: callback,
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: DS.primary,
            foregroundColor: Colors.white,
            padding: EdgeInsets.zero,
            shape: shape,
            textStyle: DS.button,
          ),
          child: Text(label),
        ),
      AppActionVariant.soft => ElevatedButton(
          onPressed: callback,
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: DS.primarySoft,
            foregroundColor: DS.primary,
            padding: EdgeInsets.zero,
            shape: shape,
            textStyle: DS.button,
          ),
          child: Text(label),
        ),
      AppActionVariant.outlined => OutlinedButton(
          onPressed: callback,
          style: OutlinedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: DS.primary,
            side: const BorderSide(color: DS.border),
            padding: EdgeInsets.zero,
            shape: shape,
            textStyle: DS.button,
          ),
          child: Text(label),
        ),
    };

    return SizedBox(height: height, child: button);
  }
}
