import 'package:flutter/widgets.dart';

/// Contoh: 175000 -> "Rp175.000"
String formatRupiah(int value) {
  final s = value.toString();
  final out = StringBuffer('Rp');
  for (var i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 == 0) out.write('.');
    out.write(s[i]);
  }
  return out.toString();
}

class MembershipPlan {
  const MembershipPlan({
    required this.months,
    required this.price,
    required this.description,
  });

  final int months;
  final int price; // rupiah
  final String description;

  String get durationLabel => '$months bulan';
  String get priceLabel => formatRupiah(price);
}

class MembershipBenefit {
  const MembershipBenefit({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;
}

class MembershipChip {
  const MembershipChip({required this.icon, required this.label});

  final IconData icon;
  final String label;
}
