import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Progress bar tipis dengan label persen di kanan. value: 0.0 - 1.0
class AppProgressBar extends StatelessWidget {
  const AppProgressBar({super.key, required this.value});

  final double value;

  @override
  Widget build(BuildContext context) {
    final v = value.clamp(0.0, 1.0).toDouble();
    return Row(
      spacing: 8,
      children: [
        Expanded(
          child: Container(
            height: 8,
            decoration: BoxDecoration(
              color: DS.border,
              borderRadius: BorderRadius.circular(100),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: v,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: DS.accent,
                  borderRadius: BorderRadius.circular(100),
                ),
              ),
            ),
          ),
        ),
        Text('${(v * 100).round()}%', style: DS.label),
      ],
    );
  }
}