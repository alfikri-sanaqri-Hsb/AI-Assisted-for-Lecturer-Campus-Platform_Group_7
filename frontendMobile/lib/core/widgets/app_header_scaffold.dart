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
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light, // ikon status bar putih
      child: Scaffold(
        backgroundColor: DS.pageBackground,
        bottomNavigationBar: bottomBar,
        appBar: AppBar(
          toolbarHeight: 132,
          titleSpacing: 0,
          automaticallyImplyLeading: false,
          elevation: 0,
          scrolledUnderElevation: 0,
          backgroundColor: DS.accent,
          surfaceTintColor: Colors.transparent,
          flexibleSpace: const DecoratedBox(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/header_bg.jpeg'),
                fit: BoxFit.cover,
                alignment: Alignment.topCenter,
              ),
            ),
          ),
          title: _Header(
            title: title,
            subtitle: subtitle,
            onBack: onBack ?? () => Navigator.of(context).maybePop(),
          ),
        ),
        body: ListView(
          physics: const BouncingScrollPhysics(),
          padding: EdgeInsets.fromLTRB(
            16,
            16,
            16,
            24 + (bottomBar == null ? MediaQuery.paddingOf(context).bottom : 0),
          ),
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: 20,
              children: children,
            ),
          ],
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
      padding: const EdgeInsets.fromLTRB(8, 8, 16, 8),
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
                  icon: const Icon(
                    LucideIcons.arrowLeft,
                    size: 26,
                    color: Colors.white,
                  ),
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
