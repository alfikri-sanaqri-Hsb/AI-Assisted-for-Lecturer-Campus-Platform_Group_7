import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';

class PtnPredictionScreen extends StatefulWidget {
  const PtnPredictionScreen({super.key, this.tryoutScore, this.tryoutTitle});

  final int? tryoutScore;
  final String? tryoutTitle;

  @override
  State<PtnPredictionScreen> createState() => _PtnPredictionScreenState();
}

class _PtnPredictionScreenState extends State<PtnPredictionScreen> {
  final _searchController = TextEditingController();
  final _scoreController = TextEditingController();
  List<Map<String, dynamic>> _targets = [];
  List<Map<String, dynamic>> _programs = [];
  Map<String, dynamic>? _estimate;
  bool _loading = true;
  bool _searching = false;
  bool _generating = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadSavedData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scoreController.dispose();
    super.dispose();
  }

  Map<String, dynamic> _map(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) {
      return value.map((key, value) => MapEntry(key.toString(), value));
    }
    return <String, dynamic>{};
  }

  List<Map<String, dynamic>> _mapList(dynamic value) => value is List
      ? value.map(_map).where((item) => item.isNotEmpty).toList()
      : <Map<String, dynamic>>[];

  Future<void> _loadSavedData() async {
    try {
      final targets = await ApiClient.getData('/ptn/targets');
      final latest = widget.tryoutScore == null
          ? _map(await ApiClient.getData('/ai/insights/ptn/latest'))
          : <String, dynamic>{};
      final savedEstimate = _map(latest['estimate']);
      if (!mounted) return;
      setState(() {
        _targets = _mapList(targets);
        _estimate = savedEstimate.isEmpty ? null : savedEstimate;
        _loading = false;
        _error = null;
      });
      if (widget.tryoutScore != null && _targets.isNotEmpty) {
        await _generateEstimate();
      }
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = error.toString();
      });
    }
  }

  Future<void> _searchPrograms(String query) async {
    if (query.trim().isEmpty) {
      setState(() => _programs = []);
      return;
    }
    setState(() {
      _searching = true;
      _error = null;
    });
    try {
      final encoded = Uri.encodeQueryComponent(query.trim());
      final result = await ApiClient.getData(
        '/ptn/programs?cari=$encoded&per_halaman=8',
      );
      if (mounted) setState(() => _programs = _mapList(result));
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _searching = false);
    }
  }

  Future<void> _addTarget(Map<String, dynamic> program) async {
    final id = program['id'];
    if (id == null) return;
    setState(() => _error = null);
    try {
      final result = await ApiClient.postData(
        '/ptn/targets',
        body: {'program_id': id},
      );
      if (!mounted) return;
      setState(() {
        _targets = _mapList(result);
        _programs.removeWhere((item) => item['id'] == id);
      });
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    }
  }

  Future<void> _removeTarget(Map<String, dynamic> target) async {
    final id = target['program_id'] ?? target['id'];
    if (id == null) return;
    setState(() => _error = null);
    try {
      await ApiClient.deleteData('/ptn/targets/$id');
      if (mounted) setState(() => _targets.remove(target));
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    }
  }

  Future<void> _generateEstimate() async {
    if (_targets.isEmpty) {
      setState(
        () => _error =
            'Tambahkan minimal satu program studi target terlebih dahulu.',
      );
      return;
    }
    final scoreText = _scoreController.text.trim();
    final body = <String, dynamic>{};
    if (widget.tryoutScore != null) {
      body['utbk_score'] = 400 + widget.tryoutScore!.clamp(0, 100) * 4;
    } else if (scoreText.isNotEmpty) {
      final score = double.tryParse(scoreText);
      if (score == null || score < 200 || score > 1000) {
        setState(() => _error = 'Masukkan skor UTBK antara 200 dan 1000.');
        return;
      }
      body['utbk_score'] = score;
    }
    setState(() {
      _generating = true;
      _error = null;
    });
    try {
      final result = _map(
        await ApiClient.postData('/ai/insights/ptn', body: body),
      );
      if (mounted) setState(() => _estimate = _map(result['estimate']));
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _generating = false);
    }
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: 14,
    children: [
      if (widget.tryoutScore != null)
        _card(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 8,
            children: [
              Text(
                'Prediksi dari ${widget.tryoutTitle ?? 'tryout terpilih'}',
                style: DS.sectionTitle,
              ),
              Text(
                'Skor tryout ${widget.tryoutScore}/100 dikonversi ke skala UTBK untuk membuat estimasi AI.',
                style: DS.body,
              ),
            ],
          ),
        )
      else
        _card(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 12,
            children: [
              const Text('Skor UTBK', style: DS.sectionTitle),
              const Text(
                'Isi skor skala 200–1000. Kosongkan untuk memakai rata-rata tryout yang tersimpan.',
                style: DS.body,
              ),
              TextField(
                controller: _scoreController,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: InputDecoration(
                  hintText: 'Contoh: 650',
                  suffixText: '/ 1000',
                  filled: true,
                  fillColor: DS.pageBackground,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: DS.borderSoft),
                  ),
                ),
              ),
            ],
          ),
        ),
      _targetsCard(),
      if (_error != null) _messageCard(_error!, isError: true),
      AppActionButton(
        label: _generating ? 'Menganalisis...' : 'Buat Prediksi dengan AI',
        onPressed: _loading || _generating ? null : _generateEstimate,
        leading: _generating
            ? const SizedBox.square(
                dimension: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            : const Icon(Icons.auto_awesome_outlined, size: 18),
      ),
      if (_estimate != null) _estimateCard(_estimate!),
      if (_loading) const Center(child: CircularProgressIndicator()),
    ],
  );

  Widget _targetsCard() => _card(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 12,
      children: [
        Row(
          children: [
            const Expanded(
              child: Text('Target program studi', style: DS.sectionTitle),
            ),
            Text('${_targets.length}/3', style: DS.label),
          ],
        ),
        if (_targets.isEmpty && !_loading)
          const Text(
            'Pilih satu hingga tiga program. AI akan membandingkan skor dengan data seleksi di backend.',
            style: DS.body,
          ),
        for (final target in _targets) _targetTile(target, selected: true),
        if (_targets.length < 3) ...[
          TextField(
            controller: _searchController,
            textInputAction: TextInputAction.search,
            onSubmitted: _searchPrograms,
            decoration: InputDecoration(
              hintText: 'Cari universitas atau program studi',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: IconButton(
                tooltip: 'Cari',
                onPressed: _searching
                    ? null
                    : () => _searchPrograms(_searchController.text),
                icon: _searching
                    ? const SizedBox.square(
                        dimension: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.arrow_forward),
              ),
              filled: true,
              fillColor: DS.pageBackground,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: DS.borderSoft),
              ),
            ),
          ),
          for (final program in _programs)
            _targetTile(program, selected: false),
        ],
      ],
    ),
  );

  Widget _targetTile(Map<String, dynamic> item, {required bool selected}) =>
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: DS.pageBackground,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            const Icon(Icons.school_outlined, color: DS.primary),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${item['program_name'] ?? 'Program studi'}',
                    style: DS.cardTitle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    '${item['university'] ?? ''} · ${item['degree'] ?? ''}',
                    style: DS.caption,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            IconButton(
              tooltip: selected ? 'Hapus target' : 'Tambah target',
              onPressed: () =>
                  selected ? _removeTarget(item) : _addTarget(item),
              icon: Icon(
                selected ? Icons.close : Icons.add_circle_outline,
                color: selected ? DS.textSecondary : DS.primary,
              ),
            ),
          ],
        ),
      );

  Widget _estimateCard(Map<String, dynamic> response) {
    final estimate = _map(response['estimate']).isEmpty
        ? response
        : _map(response['estimate']);
    final basis = _map(estimate['basis']);
    final programs = _mapList(estimate['programs']);
    return _card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 12,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text('Hasil prediksi', style: DS.sectionTitle),
              ),
              const Icon(Icons.auto_awesome, color: DS.primary),
            ],
          ),
          if (basis['your_score'] != null)
            Text(
              'Skor yang dianalisis: ${basis['your_score']}',
              style: DS.label,
            ),
          if (estimate['overview'] is String)
            Text('${estimate['overview']}', style: DS.body),
          for (final program in programs) _programResult(program),
          if (estimate['strategy'] is String)
            _messageCard('${estimate['strategy']}'),
          Text(
            response['disclaimer'] is String ? '${response['disclaimer']}' : 'Hasil ini adalah estimasi dari data yang tersedia, bukan jaminan kelulusan resmi.',
            style: DS.caption,
          ),
          if (response['provider'] is String)
            Text('Sumber: ${response['provider']}', style: DS.caption),
        ],
      ),
    );
  }

  Widget _programResult(Map<String, dynamic> program) {
    final chance = (program['chance_percent'] as num?)?.toDouble();
    final (color, label) = _chanceBand(chance);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .09),
        border: Border.all(color: color.withValues(alpha: .32)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 6,
        children: [
          Text(
            '${program['program_name'] ?? 'Program studi'}',
            style: DS.cardTitle,
          ),
          Text('${program['university'] ?? ''}', style: DS.caption),
          if (chance != null)
            Row(
              children: [
                Expanded(
                  child: Text(
                    label,
                    style: DS.label.copyWith(
                      color: color,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Text(
                  '${chance.round()}%',
                  style: DS.sectionTitle.copyWith(color: color),
                ),
              ],
            ),
          Text(
            '${program['category'] ?? 'Hasil estimasi'} · Skor minimum ${program['score_min'] ?? '-'} · rata-rata ${program['score_avg'] ?? '-'}',
            style: DS.label,
          ),
          if (program['explanation'] is String)
            Text('${program['explanation']}', style: DS.body),
          if (program['tip'] is String)
            Text('Saran: ${program['tip']}', style: DS.caption),
        ],
      ),
    );
  }

  (Color, String) _chanceBand(double? chance) {
    if (chance == null) return (DS.primary, 'Estimasi peluang');
    if (chance >= 90) return (const Color(0xFF1687E8), 'Peluang sangat tinggi');
    if (chance >= 80) return (const Color(0xFF208A53), 'Peluang tinggi');
    if (chance >= 70) return (const Color(0xFFC69500), 'Berpeluang lulus');
    if (chance > 60) {
      return (const Color(0xFFE47A16), 'Peluang perlu ditingkatkan');
    }
    return (const Color(0xFFD94141), 'Peluang rendah');
  }

  Widget _card({required Widget child}) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: DS.borderSoft),
      boxShadow: DS.cardShadow,
    ),
    child: child,
  );

  Widget _messageCard(String message, {bool isError = false}) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: isError ? DS.dangerSoft : DS.primarySoft,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Text(
      message,
      style: DS.body.copyWith(color: isError ? DS.danger : DS.primary),
    ),
  );
}
