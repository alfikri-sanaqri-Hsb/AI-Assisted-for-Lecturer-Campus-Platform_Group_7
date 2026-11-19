import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/membership_models.dart';

/// Kartu "Ringkasan pembayaran" yang mengikuti paket terpilih.
class PaymentSummaryCard extends StatelessWidget {
  const PaymentSummaryCard({
    super.key,
    required this.productName,
    required this.plan,
    required this.adminFee,
  });

  final String productName;
  final MembershipPlan plan;
  final int adminFee;

  @override
  Widget build(BuildContext context) {
    final total = plan.price + adminFee;

    return AppSurfaceCard(
      children: [
        const Text('Ringkasan pembayaran', style: DS.sectionTitle),
        _Row(
          label: 'Paket $productName',
          value: plan.durationLabel,
          valueWeight: FontWeight.w500,
        ),
        _Row(label: 'Harga total', value: plan.priceLabel),
        _Row(
          label: 'Biaya admin',
          value: formatRupiah(adminFee),
          valueColor: DS.successDark,
        ),
        const Divider(height: 1, thickness: 1, color: DS.borderSoft),
        Row(
          children: [
            Expanded(
              child: Text('Total tagihan',
                  style: DS.itemTitle.copyWith(height: 1.2)),
            ),
            Text(
              formatRupiah(total),
              style: const TextStyle(
                fontFamily: DS.fontFamily,
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: DS.primary,
              ),
            ),
          ],
        ),
        const Text(
          'Setelah pembayaran berhasil, akses premium akan aktif dan tidak ada biaya tambahan.',
          style: DS.caption,
        ),
      ],
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({
    required this.label,
    required this.value,
    this.valueWeight = FontWeight.w600,
    this.valueColor = DS.textPrimary,
  });

  final String label;
  final String value;
  final FontWeight valueWeight;
  final Color valueColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Text(label, style: DS.body.copyWith(fontSize: 13))),
        Text(
          value,
          style: DS.body.copyWith(
            fontSize: 13,
            fontWeight: valueWeight,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}
