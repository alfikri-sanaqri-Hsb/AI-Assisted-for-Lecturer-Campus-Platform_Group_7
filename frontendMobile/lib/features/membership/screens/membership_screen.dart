import 'dart:math';

import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../models/membership_models.dart';
import '../services/membership_content_service.dart';
import '../widgets/membership_benefits_section.dart';
import '../widgets/membership_plans_section.dart';
import '../widgets/membership_summary_card.dart';
import '../widgets/payment_summary_card.dart';

class MembershipScreen extends StatefulWidget {
  const MembershipScreen({super.key});

  @override
  State<MembershipScreen> createState() => _MembershipScreenState();
}

class _MembershipScreenState extends State<MembershipScreen> {
  List<MembershipPlan> _plans = MembershipContentService.plans;
  int _selected = MembershipContentService.defaultPlanIndex;
  String _paymentMethod = 'qris';
  bool _loading = true;
  bool _submitting = false;
  Map<String, dynamic>? _status;

  Map<String, dynamic> _map(dynamic value) => value is Map
      ? value.map((key, value) => MapEntry(key.toString(), value))
      : <String, dynamic>{};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final values = await Future.wait([
        ApiClient.getData('/subscriptions/plans'),
        ApiClient.getData('/subscriptions/status'),
      ]);
      final rows = values.first is List ? values.first as List : const [];
      final plans = rows.whereType<Map>().map((row) {
        final map = _map(row);
        final months = (map['duration_months'] as num?)?.toInt() ?? 1;
        return MembershipPlan(
          months: months,
          price: (map['amount'] as num?)?.toInt() ?? 0,
          description: months == 1
              ? 'Paket fleksibel untuk mencoba fitur premium.'
              : months == 3
              ? 'Pilihan untuk persiapan UTBK/SNBT dan Mandiri PTN.'
              : 'Akses premium untuk persiapan jangka panjang.',
        );
      }).toList();
      if (!mounted) return;
      setState(() {
        if (plans.isNotEmpty) {
          _plans = plans;
          _selected = plans
              .indexWhere((p) => p.months == 3)
              .clamp(0, plans.length - 1);
        }
        _status = _map(values.last);
      });
    } catch (_) {
      // Keep the design plans visible when the API is offline.
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _subscribe() async {
    if (_submitting) return;
    final plan = _plans[_selected];
    if (plan.price <= 0) {
      _message(
        'Harga paket ${plan.durationLabel} belum dikonfigurasi di backend. Pilih paket dengan harga yang sudah tersedia.',
      );
      return;
    }
    setState(() => _submitting = true);
    try {
      final suffix = Random.secure().nextInt(1 << 32).toRadixString(16);
      final order = _map(
        await ApiClient.postData(
          '/subscriptions/checkout',
          body: {
            'duration_months': plan.months,
            'payment_method': _paymentMethod,
          },
          headers: {
            'Idempotency-Key':
                'mobile-${DateTime.now().microsecondsSinceEpoch}-$suffix',
          },
        ),
      );
      if (!mounted) return;
      final orderId = (order['order_id'] as num?)?.toInt();
      final amount = (order['amount'] as num?)?.toInt() ?? plan.price;
      if (orderId == null)
        throw const ApiException('Nomor pesanan tidak diterima.');

      final confirm = await showDialog<bool>(
        context: context,
        builder: (dialogContext) => AlertDialog(
          title: const Text('Pesanan dibuat'),
          content: Text(
            'Tagihan ${formatRupiah(amount)} dibuat melalui ${_paymentMethod == 'qris' ? 'QRIS' : 'kartu debit/kredit'}. Backend saat ini hanya menyediakan simulasi status pembayaran; tidak ada dana yang diproses.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Nanti'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Simulasikan berhasil'),
            ),
          ],
        ),
      );
      if (confirm == true && mounted) {
        final result = _map(
          await ApiClient.postData(
            '/subscriptions/$orderId/pay',
            body: {'outcome': 'success'},
          ),
        );
        setState(() => _status = {...?_status, ...result});
        _message(
          'Simulasi pembayaran selesai. Status premium diperbarui oleh backend.',
        );
      } else if (mounted) {
        _message('Pesanan tersimpan dengan status menunggu pembayaran.');
      }
    } catch (error) {
      if (mounted) _message('Pembuatan pesanan gagal: $error');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _message(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));

  @override
  Widget build(BuildContext context) {
    final plan = _plans[_selected];
    final isPremium = _status?['is_premium'] == true;
    return AppHeaderScaffold(
      title: 'Langganan Membership',
      subtitle: 'Buka akses premium untuk materi, tryout, dan analisis progres yang lebih lengkap.',
      children: [
        if (_loading) const LinearProgressIndicator(),
        if (isPremium)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: DS.primarySoft,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Text(
              'Premium aktif${_status?['premium_until'] == null ? '' : ' sampai ${_status!['premium_until']}'}',
              style: DS.cardTitle.copyWith(color: DS.primary),
            ),
          ),
        MembershipSummaryCard(
          name: MembershipContentService.productName,
          description: MembershipContentService.productDescription,
          plan: plan,
          chips: MembershipContentService.chips,
        ),
        const MembershipBenefitsSection(
          benefits: MembershipContentService.benefits,
        ),
        MembershipPlansSection(
          plans: _plans,
          selectedIndex: _selected,
          onSelected: (i) => setState(() => _selected = i),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 8,
          children: [
            Text('Metode pembayaran', style: DS.sectionTitle),
            DropdownButtonFormField<String>(
              initialValue: _paymentMethod,
              items: const [
                DropdownMenuItem(value: 'qris', child: Text('QRIS')),
                DropdownMenuItem(
                  value: 'kartu_debit_kredit',
                  child: Text('Kartu debit/kredit'),
                ),
              ],
              onChanged: (value) =>
                  setState(() => _paymentMethod = value ?? 'qris'),
              decoration: const InputDecoration(border: OutlineInputBorder()),
            ),
          ],
        ),
        PaymentSummaryCard(
          productName: MembershipContentService.productName,
          plan: plan,
          adminFee: 0,
        ),
        AppActionButton(
          label: _submitting ? 'Memproses...' : 'Buat Pesanan',
          height: 48,
          onPressed: _submitting ? null : _subscribe,
        ),
        const Text(
          'Pembayaran pada backend saat ini masih berupa simulasi. Integrasi gateway QRIS/kartu belum tersedia.',
          textAlign: TextAlign.center,
          style: DS.caption,
        ),
      ],
    );
  }
}
