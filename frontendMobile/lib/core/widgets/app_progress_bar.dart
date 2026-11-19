import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Progress bar tipis. value: 0.0 - 1.0.
/// [showLabel] menampilkan persen di kanan; [color] mengubah warna isi.
class AppProgressBar extends StatelessWidget {
  const AppProgressBar({
    super.key,
    required this.value,
    this.showLabel = true,
    this.color = DS.accent,
    this.height = 8,
  });

  final double value;
  final bool showLabel;
  final Color color;
  final double height;

  @override
  Widget build(BuildContext context) {
    final v = value.clamp(0.0, 1.0).toDouble();

    final bar = Container(
      height: height,
      decoration: BoxDecoration(
        color: DS.border,
        borderRadius: BorderRadius.circular(100),
      ),
      child: FractionallySizedBox(
        alignment: Alignment.centerLeft,
        widthFactor: v,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(100),
          ),
        ),
      ),
    );

    if (!showLabel) return bar;

    return Row(
      spacing: 8,
      children: [
        Expanded(child: bar),
        Text('${(v * 100).round()}%', style: DS.label),
      ],
    );
  }
}
