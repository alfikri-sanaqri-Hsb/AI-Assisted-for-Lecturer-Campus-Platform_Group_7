import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Kotak ikon dengan latar biru lembut.
class AppIconTile extends StatelessWidget {
  const AppIconTile({
    super.key,
    required this.icon,
    this.size = 40,
    this.iconSize = 20,
    this.radius = 10,
  });

  final IconData icon;
  final double size;
  final double iconSize;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: DS.primarySoft,
        borderRadius: BorderRadius.circular(radius),
      ),
      child: Icon(icon, size: iconSize, color: DS.primary),
    );
  }
}