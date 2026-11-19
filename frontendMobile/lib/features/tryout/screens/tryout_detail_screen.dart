import 'package:flutter/material.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_bottom_action_bar.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/tryout_models.dart';
import '../services/tryout_content_service.dart';
import '../widgets/tryout_detail_summary_card.dart';
import '../widgets/tryout_guidelines_section.dart';
import '../widgets/tryout_subtests_section.dart';

/// Detail tryout juga menjadi tempat memilih target PTN dan melihat analisis skor.
class TryoutDetailScreen extends StatefulWidget {
  const TryoutDetailScreen({super.key, required this.item});

  final TryoutItem item;

  @override
  State<TryoutDetailScreen> createState() => _TryoutDetailScreenState();
}

class _TryoutDetailScreenState extends State<TryoutDetailScreen> {
  final _search = TextEditingController();
  final _score = TextEditingController();
  List<Map<String, dynamic>> _targets = [];
  List<Map<String, dynamic>> _results = [];
  Map<String, dynamic>? _selected;
  Map<String, dynamic>? _prediction;
  String? _universityValue;
  String? _majorValue;
  bool _loadingTargets = true;
  bool _searching = false;
  bool _predicting = false;
  String? _error;

  Map<String, dynamic> _map(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) {
      return value.map((key, value) => MapEntry(key.toString(), value));
    }
    return <String, dynamic>{};
  }

  List<Map<String, dynamic>> _list(dynamic value) => value is List
      ? value.map(_map).where((item) => item.isNotEmpty).toList()
      : <Map<String, dynamic>>[];

  @override
  void initState() {
    super.initState();
    _loadTargets();
  }

  @override
  void dispose() {
    _search.dispose();
    _score.dispose();
    super.dispose();
  }

  Future<void> _loadTargets() async {
    try {
      final targets = _list(await ApiClient.getData('/ptn/targets'));
      if (!mounted) return;
      setState(() {
        _targets = targets;
        if (targets.isNotEmpty) _selected = targets.first;
      });
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loadingTargets = false);
    }
  }

  Future<void> _searchPrograms(String query) async {
    if (query.trim().isEmpty) {
      setState(() => _results = []);
      return;
    }
    setState(() {
      _searching = true;
      _error = null;
    });
    try {
      final q = Uri.encodeQueryComponent(query.trim());
      final response = await ApiClient.getData(
        '/ptn/programs?cari=$q&per_halaman=30',
      );
      if (mounted) setState(() => _results = _list(response));
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _searching = false);
    }
  }

  List<Map<String, dynamic>> get _availablePrograms {
    final byId = <Object, Map<String, dynamic>>{};
    for (final program in [..._targets, ..._results]) {
      final id = program['program_id'] ?? program['id'];
      if (id != null) byId[id] = program;
    }
    return byId.values.toList();
  }

  List<String> get _universities =>
      _availablePrograms
          .map((p) => '${p['university'] ?? ''}')
          .where((name) => name.isNotEmpty)
          .toSet()
          .toList()
        ..sort();

  String? get _selectedUniversity =>
      _universityValue ??
      (_selected == null ? null : '${_selected!['university'] ?? ''}');

  List<Map<String, dynamic>> get _programsAtUniversity => _availablePrograms
      .where((p) => '${p['university'] ?? ''}' == _selectedUniversity)
      .toList();

  String? get _selectedProgram =>
      _majorValue ??
      (_selected == null ? null : '${_selected!['program_name'] ?? ''}');

  Future<void> _selectProgram(Map<String, dynamic> program) async {
    final id = program['program_id'] ?? program['id'];
    if (id == null) return;
    try {
      final detail = _map(await ApiClient.getData('/ptn/programs/$id'));
      program = {...program, ...detail};
    } catch (error) {
      if (mounted)
        setState(() => _error = 'Detail program studi gagal dimuat: $error');
      return;
    }
    final existing = _targets.where(
      (target) => '${target['program_id'] ?? target['id']}' == '$id',
    );
    if (existing.isNotEmpty) {
      setState(() {
        _selected = existing.first;
        _universityValue = '${existing.first['university'] ?? ''}';
        _majorValue = '${existing.first['program_name'] ?? ''}';
        _prediction = null;
      });
      return;
    }
    if (_targets.length >= 3) {
      setState(
        () => _error = 'Maksimal 3 target PTN. Kelola target lama melalui halaman Prediksi.',
      );
      return;
    }
    try {
      final updated = await ApiClient.postData(
        '/ptn/targets',
        body: {'program_id': id},
      );
      if (!mounted) return;
      final targets = _list(updated);
      final chosen = targets.firstWhere(
        (target) => '${target['program_id'] ?? target['id']}' == '$id',
        orElse: () => program,
      );
      setState(() {
        _targets = targets;
        _selected = chosen;
        _universityValue = '${chosen['university'] ?? ''}';
        _majorValue = '${chosen['program_name'] ?? ''}';
        _prediction = null;
        _error = null;
      });
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    }
  }

  Future<void> _predict() async {
    if (_selected == null) {
      setState(
        () => _error = 'Pilih universitas dan program studi terlebih dahulu.',
      );
      return;
    }
    final body = <String, dynamic>{};
    if (_score.text.trim().isNotEmpty) {
      final score = double.tryParse(_score.text.trim());
      if (score == null || score < 200 || score > 1000) {
        setState(() => _error = 'Masukkan skor perkiraan antara 200 dan 1000.');
        return;
      }
      body['utbk_score'] = score;
    }
    setState(() {
      _predicting = true;
      _error = null;
    });
    try {
      final data = _map(
        await ApiClient.postData('/ai/insights/ptn', body: body),
      );
      if (mounted) setState(() => _prediction = data);
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _predicting = false);
    }
  }

  Map<String, dynamic>? get _selectedEstimate {
    final estimate = _map(_prediction?['estimate']);
    final programs = _list(estimate['programs']);
    final selectedId = _selected?['program_id'] ?? _selected?['id'];
    for (final program in programs) {
      if ('${program['program_id']}' == '$selectedId') return program;
    }
    return programs.isEmpty ? null : programs.first;
  }

  @override
  Widget build(BuildContext context) {
    final detail = TryoutContentService.detailFor(widget.item);
    return AppHeaderScaffold(
      title: 'Detail Tryout',
      subtitle: 'Kenali ujiannya dan siapkan targetmu.',
      bottomBar: AppBottomActionBar(
        children: [
          Row(
            spacing: 8,
            children: [
              Expanded(
                child: Text(
                  'Biaya pendaftaran',
                  style: DS.itemTitle.copyWith(height: 1.45),
                ),
              ),
              Text(
                detail.priceLabel,
                style: const TextStyle(
                  fontFamily: DS.fontFamily,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: DS.primary,
                ),
              ),
            ],
          ),
          AppActionButton(
            label: detail.ctaLabel,
            height: 48,
            onPressed: () {
              if (detail.isPremium) {
                AppNav.membership(context);
                return;
              }
              AppNav.startTryout(
                context,
                title: widget.item.title,
                backendTryoutId: widget.item.backendId,
                durationMinutes: widget.item.durationMinutes,
              );
            },
          ),
          Text(detail.ctaNote, textAlign: TextAlign.center, style: DS.caption),
        ],
      ),
      children: [
        TryoutDetailSummaryCard(detail: detail),
        _targetCard(),
        TryoutSubtestsSection(subtests: detail.subtests),
        TryoutGuidelinesSection(steps: detail.guidelines),
      ],
    );
  }

  Widget _targetCard() => AppSurfaceCard(
    children: [
      const Row(
        children: [
          Icon(Icons.school_outlined, color: DS.primary),
          SizedBox(width: 8),
          Expanded(
            child: Text('Target Jurusan & Prediksi AI', style: DS.sectionTitle),
          ),
        ],
      ),
      const Text(
        'Pilih kampus dan program studi. Masukkan skor perkiraan atau gunakan rata-rata tryout yang sudah tersimpan.',
        style: DS.body,
      ),
      TextField(
        controller: _search,
        onSubmitted: _searchPrograms,
        textInputAction: TextInputAction.search,
        decoration: InputDecoration(
          labelText: 'Cari universitas atau jurusan',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: IconButton(
            onPressed: _searching ? null : () => _searchPrograms(_search.text),
            icon: _searching
                ? const SizedBox.square(
                    dimension: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.arrow_forward),
          ),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      if (_universities.isNotEmpty)
        DropdownButtonFormField<String>(
          key: ValueKey('university-$_universityValue'),
          initialValue: _universities.contains(_selectedUniversity)
              ? _selectedUniversity
              : null,
          decoration: InputDecoration(
            labelText: 'Pilih Universitas',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
          items: [
            for (final name in _universities)
              DropdownMenuItem(
                value: name,
                child: Text(name, overflow: TextOverflow.ellipsis),
              ),
          ],
          onChanged: (name) {
            final matches = _availablePrograms.where(
              (p) => '${p['university']}' == name,
            );
            final first = matches.isEmpty ? null : matches.first;
            setState(() {
              _universityValue = name;
              _majorValue = null;
              _selected = first;
              _prediction = null;
            });
          },
        ),
      if (_programsAtUniversity.isNotEmpty)
        DropdownButtonFormField<String>(
          key: ValueKey('major-$_universityValue-$_majorValue'),
          initialValue:
              _programsAtUniversity.any(
                (p) => '${p['program_name']}' == _selectedProgram,
              )
              ? _selectedProgram
              : null,
          decoration: InputDecoration(
            labelText: 'Pilih Jurusan',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
          items: [
            for (final program in _programsAtUniversity)
              DropdownMenuItem(
                value: '${program['program_name']}',
                child: Text(
                  '${program['program_name']} (${program['degree'] ?? 'S1'})',
                ),
              ),
          ],
          onChanged: (name) {
            _majorValue = name;
            final matches = _programsAtUniversity.where(
              (p) => '${p['program_name']}' == name,
            );
            final program = matches.isEmpty ? null : matches.first;
            if (program != null) _selectProgram(program);
          },
        ),
      if (_loadingTargets) const Center(child: CircularProgressIndicator()),
      if (_results.isNotEmpty && _selected == null)
        Text(
          '${_results.length} program ditemukan. Pilih universitas dan jurusan dari daftar di atas.',
          style: DS.caption,
        ),
      if (_selected != null)
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: DS.primarySoft,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            'Target dipilih: ${_selected!['program_name'] ?? ''} — ${_selected!['university'] ?? ''}',
            style: DS.label.copyWith(color: DS.primary),
          ),
        ),
      TextField(
        controller: _score,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(
          labelText: 'Skor perkiraan UTBK (opsional)',
          hintText: '200–1000; kosongkan untuk memakai rata-rata tryout',
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      if (_error != null)
        Text(_error!, style: DS.caption.copyWith(color: DS.danger)),
      AppActionButton(
        label: _predicting ? 'Menganalisis...' : 'Prediksi peluang dengan AI',
        onPressed: _predicting || _loadingTargets ? null : _predict,
        leading: _predicting
            ? const SizedBox.square(
                dimension: 16,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            : const Icon(Icons.auto_awesome_outlined, size: 18),
      ),
      if (_selectedEstimate != null) _estimateCard(_selectedEstimate!),
      if (_prediction != null)
        const Text(
          'Persentase adalah indeks kesesuaian skor terhadap rentang skor historis, bukan peluang kelulusan resmi. Hasil seleksi dapat berbeda.',
          style: DS.caption,
        ),
    ],
  );

  Widget _estimateCard(Map<String, dynamic> result) {
    final chance = num.tryParse('${result['chance_percent']}')?.round();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: DS.primary.withValues(alpha: .25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 6,
        children: [
          Text(
            '${chance ?? '—'}% indeks kesesuaian skor',
            style: DS.sectionTitle.copyWith(color: DS.primary),
          ),
          Text(
            'Skor dianalisis: ${result['your_score'] ?? '—'}  •  Rata-rata historis: ${result['score_avg'] ?? '—'}',
            style: DS.caption,
          ),
          Text(
            '${result['category'] ?? ''} — ${result['explanation'] ?? 'Estimasi skor berdasarkan data yang tersedia.'}',
            style: DS.body,
          ),
          if (result['tip'] is String)
            Text('Saran: ${result['tip']}', style: DS.caption),
        ],
      ),
    );
  }
}
