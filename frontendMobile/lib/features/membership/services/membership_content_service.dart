import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../models/membership_models.dart';

/// Sumber data halaman Langganan Membership (data tiruan sesuai Figma).
/// Ganti dengan API paket dan harga nanti.
abstract final class MembershipContentService {
  static const productName = 'Sahabat Premium';
  static const productDescription =
      'Akses materi premium, tryout premium, dan analisis progres untuk persiapan UTBK/SNBT, Mandiri PTN, dan Kedinasan.';

  static const defaultPlanIndex = 1; // paket 3 bulan

  static const chips = <MembershipChip>[
    MembershipChip(icon: LucideIcons.bookOpen, label: 'Materi premium'),
    MembershipChip(icon: LucideIcons.clipboardList, label: 'Tryout premium'),
    MembershipChip(icon: LucideIcons.chartPie, label: 'Analisis progres'),
  ];

  static const benefits = <MembershipBenefit>[
    MembershipBenefit(
      icon: LucideIcons.bookOpen,
      title: 'Materi/video premium',
      description:
          'Akses materi premium dan video pembelajaran untuk topik yang lebih mendalam.',
    ),
    MembershipBenefit(
      icon: LucideIcons.clipboardList,
      title: 'Tryout premium',
      description:
          'Tryout premium dengan pembahasan lengkap untuk simulasi yang lebih nyata.',
    ),
    MembershipBenefit(
      icon: LucideIcons.chartPie,
      title: 'Analisis progres',
      description:
          'Lihat kemajuan belajarmu secara lebih rinci untuk fokus pada topik yang perlu ditingkatkan.',
    ),
    MembershipBenefit(
      icon: LucideIcons.clock,
      title: 'Aktivasi instan',
      description:
          'Akses premium aktif setelah pembayaran berhasil dan tidak ada biaya admin tambahan.',
    ),
  ];

  static const plans = <MembershipPlan>[
    MembershipPlan(
      months: 1,
      price: 65000,
      description:
          'Cocok untuk mencoba fitur premium sebelum memulai persiapan intensif.',
    ),
    MembershipPlan(
      months: 3,
      price: 175000,
      description: 'Pilihan terbaik untuk persiapan UTBK/SNBT dan Mandiri PTN.',
    ),
    MembershipPlan(
      months: 6,
      price: 325000,
      description:
          'Ideal untuk persiapan jangka panjang dan review materi secara lebih menyeluruh.',
    ),
  ];

  static const adminFee = 0;
}
