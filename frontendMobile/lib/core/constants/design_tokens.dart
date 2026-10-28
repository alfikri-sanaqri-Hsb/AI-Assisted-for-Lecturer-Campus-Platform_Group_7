import 'package:flutter/material.dart';

/// Design tokens (diambil dari Figma "Project Rapor BIAS").
/// Dipakai bersama oleh semua fitur supaya tampilan konsisten.
abstract final class DS {
  // Warna
  static const Color background = Color(0xFFF8F9FA);
  static const Color surface = Colors.white;
  static const Color border = Color(0xFFE0E0E0);
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF5F6368);
  static const Color primary = Color(0xFF0A6FAF);
  static const Color accent = Color(0xFF48B5FF);
  static const Color primarySoft = Color(0xFFE8F5FF);
  static const Color warningSoft = Color(0xFFFFF4E5);
  static const Color success = Color(0xFF34A853);
  static const Color successSoft = Color(0xFFEAF7EF);

  // Warna tambahan (halaman Tryout)
  static const Color pageBackground = Color(0xFFF8F9FD);
  static const Color borderSoft = Color(0xFFE0E6ED);
  static const Color successDark = Color(0xFF258342);
  static const Color premiumSoft = Color(0xFFFFF5DA);
  static const Color premiumText = Color(0xFF9A6600);

  // Bayangan kartu tanpa border
  static const List<BoxShadow> cardShadow = [
    BoxShadow(
      color: Color(0x121D527B),
      blurRadius: 12,
      offset: Offset(0, 3),
    ),
  ];

  // Ukuran
  static const double screenPadding = 16;
  static const double cardPadding = 16;
  static const double cardRadius = 12;

  // Tipografi (pastikan font Poppins sudah terdaftar di pubspec.yaml)
  static const String fontFamily = 'Poppins';

  static const TextStyle pageTitle = TextStyle(
    fontFamily: fontFamily, fontSize: 28, fontWeight: FontWeight.w600,
    height: 1.45, color: Colors.white,
  );
  static const TextStyle sectionTitle = TextStyle(
    fontFamily: fontFamily, fontSize: 18, fontWeight: FontWeight.w600,
    color: textPrimary,
  );
  static const TextStyle heading = TextStyle(
    fontFamily: fontFamily, fontSize: 20, fontWeight: FontWeight.w700,
    height: 1.2, color: textPrimary,
  );
  static const TextStyle itemTitle = TextStyle(
    fontFamily: fontFamily, fontSize: 16, fontWeight: FontWeight.w600,
    height: 1.2, color: textPrimary,
  );
  static const TextStyle cardTitle = TextStyle(
    fontFamily: fontFamily, fontSize: 15, fontWeight: FontWeight.w600,
    height: 1.2, color: textPrimary,
  );
  static const TextStyle body = TextStyle(
    fontFamily: fontFamily, fontSize: 14, fontWeight: FontWeight.w400,
    height: 1.45, color: textSecondary,
  );
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily, fontSize: 12, fontWeight: FontWeight.w400,
    height: 1.45, color: textSecondary,
  );
  static const TextStyle label = TextStyle(
    fontFamily: fontFamily, fontSize: 12, fontWeight: FontWeight.w600,
    color: primary,
  );
  static const TextStyle button = TextStyle(
    fontFamily: fontFamily, fontSize: 14, fontWeight: FontWeight.w600,
  );
}
