import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../tryout/screens/tryout_screen.dart';
import 'ptn_prediction_screen.dart';

class PredictionHistoryScreen extends StatefulWidget {
  const PredictionHistoryScreen({super.key});

  @override
  State<PredictionHistoryScreen> createState() =>
      _PredictionHistoryScreenState();
}

class _PredictionHistoryScreenState extends State<PredictionHistoryScreen> {
  List<Map<String, dynamic>> _attempts = [];
  bool _loading = true;
  String? _error;

  Map<String, dynamic> _map(dynamic value) => value is Map
      ? value.map((key, value) => MapEntry('$key', value))
      : <String, dynamic>{};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final response = _map(await ApiClient.getData('/progress/overview'));
      final rows = response['tryouts'] is List
          ? (response['tryouts'] as List)
                .map(_map)
                .where((x) => x.isNotEmpty)
                .toList()
          : <Map<String, dynamic>>[];
      if (mounted) {
        setState(() {
          _attempts = rows;
          _loading = false;
        });
      }
    } catch (error) {
      if (mounted) {
        setState(() {
          _error = error.toString();
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) => AppHeaderScaffold(
    title: 'Prediksi PTN',
    subtitle:
        'Pilih hasil tryout untuk melihat estimasi peluang ke program impian.',
    children: [
      if (_loading)
        const Padding(
          padding: EdgeInsets.all(36),
          child: Center(child: CircularProgressIndicator()),
        ),
      if (_error != null)
        _stateCard(
          Icons.cloud_off_outlined,
          'Riwayat belum dapat dimuat',
          _error!,
        ),
      if (!_loading && _error == null && _attempts.isEmpty)
        _emptyState(context),
      for (final attempt in _attempts) _attemptCard(context, attempt),
      const Text(
        'Estimasi AI bersifat informatif dan bukan jaminan kelulusan. Tambahkan target PTN dan jurusan di halaman detail prediksi.',
        style: DS.caption,
      ),
    ],
  );

  Widget _attemptCard(BuildContext context, Map<String, dynamic> row) {
    final score = (row['score'] as num?)?.round() ?? 0;
    final title = row['title']?.toString() ?? 'Tryout';
    final date = row['submitted_at']?.toString();
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: DS.borderSoft),
        boxShadow: DS.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 12,
        children: [
          Row(
            children: [
              Container(
                width: 56,
                height: 56,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: DS.primarySoft,
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Text(
                  '$score',
                  style: DS.sectionTitle.copyWith(color: DS.primary),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: DS.cardTitle),
                    if (date != null) Text(date, style: DS.caption),
                  ],
                ),
              ),
              const Icon(Icons.assessment_outlined, color: DS.primary),
            ],
          ),
          Text(
            '${row['correct_count'] ?? 0} benar dari ${row['total_questions'] ?? 0} soal',
            style: DS.body,
          ),
          AppActionButton(
            label: 'Lihat detail tryout',
            onPressed: () => _openDetail(context, score, title),
            leading: const Icon(Icons.arrow_forward, size: 18),
          ),
        ],
      ),
    );
  }

  void _openDetail(BuildContext context, int score, String title) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) =>
            PredictionDetailScreen(tryoutScore: score, tryoutTitle: title),
      ),
    );
  }

  Widget _emptyState(BuildContext context) => _stateCard(
    Icons.auto_graph_outlined,
    'Belum ada riwayat tryout',
    'Selesaikan tryout terlebih dahulu. Setelah itu, hasilnya bisa dipakai untuk memperkirakan peluang pada PTN dan jurusan pilihanmu.',
    action: AppActionButton(
      label: 'Lihat daftar tryout',
      onPressed: () => Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(builder: (_) => const TryoutScreen()),
      ),
      leading: const Icon(Icons.edit_note, size: 18),
    ),
  );

  Widget _stateCard(
    IconData icon,
    String title,
    String message, {
    Widget? action,
  }) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(22),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: DS.borderSoft),
      boxShadow: DS.cardShadow,
    ),
    child: Column(
      children: [
        Icon(icon, size: 42, color: DS.primary),
        const SizedBox(height: 12),
        Text(title, style: DS.sectionTitle, textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text(message, style: DS.body, textAlign: TextAlign.center),
        if (action != null) ...[const SizedBox(height: 16), action],
      ],
    ),
  );
}

class PredictionDetailScreen extends StatelessWidget {
  const PredictionDetailScreen({
    super.key,
    required this.tryoutScore,
    required this.tryoutTitle,
  });

  final int tryoutScore;
  final String tryoutTitle;

  @override
  Widget build(BuildContext context) => AppHeaderScaffold(
    title: 'Detail prediksi',
    subtitle: 'Estimasi peluang berdasarkan hasil $tryoutTitle.',
    children: [
      PtnPredictionScreen(tryoutScore: tryoutScore, tryoutTitle: tryoutTitle),
    ],
  );
}
