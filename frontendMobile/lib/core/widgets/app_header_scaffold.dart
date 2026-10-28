import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../constants/design_tokens.dart';

/// Kerangka halaman dengan latar pola biru, tombol kembali, judul, dan
/// subjudul. Isi halaman dikirim lewat [children]; [bottomBar] opsional
/// untuk bilah aksi yang menempel di bawah.
class AppHeaderScaffold extends StatelessWidget {
  const AppHeaderScaffold({
    super.key,
    required this.title,
    required this.subtitle,
    required this.children,
    this.bottomBar,
    this.onBack,
  });

  final String title;
  final String subtitle;
  final List<Widget> children;
  final Widget? bottomBar;
  final VoidCallback? onBack;

  @override
  Widget build(BuildContext context) {
    final safe = MediaQuery.paddingOf(context);

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light, // ikon status bar putih
      child: Scaffold(
        backgroundColor: DS.pageBackground,
        bottomNavigationBar: bottomBar,
        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Stack(
            children: [
              // Latar pola edukasi (ikut ter-scroll seperti di Figma).
              const Positioned(
                top: -19,
                left: -20,
                right: -20,
                height: 793,
                child: Image(
                  image: AssetImage('assets/images/header_bg.jpeg'),
                  fit: BoxFit.cover,
                ),
              ),
              Column(
                children: [
                  SizedBox(height: safe.top),
                  _Header(
                    title: title,
                    subtitle: subtitle,
                    onBack: onBack ?? () => Navigator.of(context).maybePop(),
                  ),
                  Padding(
                    padding: EdgeInsets.fromLTRB(
                      16,
                      0,
                      16,
                      24 + (bottomBar == null ? safe.bottom : 0),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      spacing: 20,
                      children: children,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({
    required this.title,
    required this.subtitle,
    required this.onBack,
  });

  final String title;
  final String subtitle;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 8,
        children: [
          Row(
            spacing: 8,
            children: [
              SizedBox(
                width: 44,
                height: 44,
                child: IconButton(
                  padding: EdgeInsets.zero,
                  onPressed: onBack,
                  icon: const Icon(LucideIcons.arrowLeft,
                      size: 26, color: Colors.white),
                ),
              ),
              Expanded(child: Text(title, style: DS.pageTitle)),
            ],
          ),
          Text(subtitle, style: DS.body.copyWith(color: Colors.white)),
        ],
      ),
    );
  }
}
