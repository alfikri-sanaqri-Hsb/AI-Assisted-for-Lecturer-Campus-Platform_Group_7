import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../constants/design_tokens.dart';

/// Header "hero" berlatar header_bg.jpeg. Menjorok ke bawah status bar
/// secara otomatis. [overlayColor] opsional untuk menggelapkan latar.
class AppHeroHeader extends StatelessWidget {
  const AppHeroHeader({
    super.key,
    required this.children,
    this.overlayColor,
    this.backgroundColor = DS.accent,
    this.contentSpacing = 12,
    this.includeStatusBarPadding = true,
  });

  final List<Widget> children;
  final Color? overlayColor;
  final Color? backgroundColor;
  final double contentSpacing;
  final bool includeStatusBarPadding;

  @override
  Widget build(BuildContext context) {
    final top = includeStatusBarPadding
        ? MediaQuery.paddingOf(context).top
        : 0.0;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light, // ikon status bar putih
      child: Container(
        width: double.infinity,
        padding: EdgeInsets.fromLTRB(
          DS.screenPadding,
          20 + top,
          DS.screenPadding,
          20,
        ),
        decoration: BoxDecoration(
          color: backgroundColor,
          image: const DecorationImage(
            image: AssetImage('assets/images/header_bg.jpeg'),
            fit: BoxFit.cover,
            alignment: Alignment.topCenter,
          ),
        ),
        foregroundDecoration: overlayColor == null
            ? null
            : BoxDecoration(color: overlayColor),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: contentSpacing,
          children: children,
        ),
      ),
    );
  }
}
