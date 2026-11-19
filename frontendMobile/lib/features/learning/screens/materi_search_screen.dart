import 'package:flutter/material.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_filter_chip.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../profile/services/profile_content_service.dart';
import '../models/learning_models.dart';
import 'material_detail_screen.dart';
import '../services/learning_content_service.dart';
import '../widgets/learning_result_section.dart';
import '../widgets/learning_search_field.dart';

/// Halaman Cari Materi: pencarian + filter + hasil per kelompok.
class MateriSearchScreen extends StatefulWidget {
  const MateriSearchScreen({
    super.key,
    this.initialQuery = '',
    this.initialType,
  });

  final String initialQuery;
  final LearningType? initialType;

  @override
  State<MateriSearchScreen> createState() => _MateriSearchScreenState();
}

class _MateriSearchScreenState extends State<MateriSearchScreen> {
  late final TextEditingController _controller = TextEditingController(
    text: widget.initialQuery,
  );
  late LearningType? _type = widget.initialType;
  LearningLevel _level = LearningLevel.semua;
  bool _subject = false; // filter "Matematika"
  List<LearningItem> _apiItems = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  Map<String, dynamic> _map(dynamic value) => value is Map
      ? value.map((key, value) => MapEntry(key.toString(), value))
      : <String, dynamic>{};

  Future<void> _loadContent() async {
    try {
      final response = await Future.wait([
        ApiClient.getData('/materials'),
        ApiClient.getData('/videos'),
      ]);
      final materials = response[0] is List ? response[0] as List : const [];
      final videos = response[1] is List ? response[1] as List : const [];
      final mapped = <LearningItem>[];
      for (final raw in materials.whereType<Map>()) {
        final row = _map(raw);
        final id = (row['id'] as num?)?.toInt();
        if (id == null) continue;
        mapped.add(
          LearningItem(
            id: 'material-$id',
            backendId: id,
            type: LearningType.modul,
            title: row['title']?.toString() ?? 'Materi',
            description: row['description']?.toString() ?? '',
            subject: row['subject']?.toString() ?? 'Materi',
            level: LearningLevel.dasar,
            isPremium: false,
            durationMinutes: (row['estimated_minutes'] as num?)?.toInt() ?? 0,
            contentUrl: row['content_url']?.toString(),
          ),
        );
      }
      for (final raw in videos.whereType<Map>()) {
        final row = _map(raw);
        final id = (row['id'] as num?)?.toInt();
        if (id == null) continue;
        mapped.add(
          LearningItem(
            id: 'video-$id',
            backendId: id,
            type: LearningType.video,
            title: row['title']?.toString() ?? 'Video',
            description: row['subject']?.toString() ?? '',
            subject: row['subject']?.toString() ?? 'Video',
            level: LearningLevel.dasar,
            isPremium: false,
            durationMinutes: (row['duration_minutes'] as num?)?.toInt() ?? 0,
            contentUrl: row['url']?.toString(),
            views: row['watched_today'] == true
                ? 'Sudah ditonton hari ini'
                : 'Belum ditonton',
          ),
        );
      }
      if (mounted) setState(() => _apiItems = mapped);
    } catch (_) {
      // Keep curated local suggestions as a useful offline fallback.
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  List<LearningItem> get _matches {
    final tokens = _controller.text
        .toLowerCase()
        .split(RegExp(r'\s+'))
        .where((t) => t.isNotEmpty);

    return [..._apiItems, ...LearningContentService.items].where((i) {
      if (_subject && i.subject != 'Matematika') return false;
      if (_type != null && i.type != _type) return false;
      if (_level != LearningLevel.semua && i.level != _level) return false;
      final haystack = '${i.title} ${i.description} ${i.subject}'.toLowerCase();
      return tokens.every(haystack.contains);
    }).toList();
  }

  void _open(LearningItem item) {
    final premiumUser = ProfileContentService.user.isPremium;
    if (item.isPremium && !premiumUser) {
      AppNav.membership(context); // materi premium -> halaman langganan
      return;
    }
    switch (item.type) {
      case LearningType.latihan:
        AppNav.practice(context, topic: item.title);
      case LearningType.video:
        AppNav.videos(
          context,
          title: item.title,
          backendVideoId: item.backendId,
          videoUrl: item.contentUrl,
        );
      case LearningType.modul:
        if (item.backendId != null) {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => MaterialDetailScreen(
                materialId: item.backendId!,
                title: item.title,
              ),
            ),
          );
          return;
        }
        AppNav.module(
          context,
          title: item.title,
          description: item.description,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final matches = _matches;
    final videos = matches
        .where((i) => i.type == LearningType.video && !i.recommended)
        .toList();
    final modules = matches.where((i) => i.type != LearningType.video).toList();
    final recommended = matches.where((i) => i.recommended).toList();

    return AppHeaderScaffold(
      title: 'Cari Materi',
      subtitle: 'Temukan video, modul, dan latihan untuk persiapan SNBT/UTBK, Mandiri PTN, dan Kedinasan.',
      children: [
        if (_loading) const LinearProgressIndicator(),
        LearningSearchField(
          controller: _controller,
          onChanged: (_) => setState(() {}),
          onClear: () => setState(_controller.clear),
        ),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            AppFilterChip(
              label: 'Matematika',
              selected: _subject,
              onTap: () => setState(() => _subject = !_subject),
            ),
            for (final t in LearningType.values)
              AppFilterChip(
                label: t.label,
                selected: _type == t,
                onTap: () => setState(() => _type = _type == t ? null : t),
              ),
            for (final l in LearningLevel.values)
              AppFilterChip(
                label: l.label,
                selected: _level == l,
                onTap: () => setState(() => _level = l),
              ),
          ],
        ),
        Row(
          spacing: 8,
          children: [
            Expanded(child: Text('Hasil pencarian', style: DS.sectionTitle)),
            Text(
              '${matches.length} materi ditemukan',
              style: DS.label.copyWith(fontWeight: FontWeight.w500),
            ),
          ],
        ),
        if (matches.isEmpty)
          const Text(
            'Materi tidak ditemukan. Coba kata kunci atau filter lain.',
            textAlign: TextAlign.center,
            style: DS.body,
          ),
        if (videos.isNotEmpty)
          LearningResultSection(
            title: 'Video Materi',
            items: videos,
            onItemTap: _open,
            onSeeAll: () => setState(() => _type = LearningType.video),
          ),
        if (modules.isNotEmpty)
          LearningResultSection(
            title: 'Modul & Latihan',
            items: modules,
            onItemTap: _open,
            onSeeAll: () => setState(() => _type = LearningType.modul),
          ),
        if (recommended.isNotEmpty)
          LearningResultSection(
            title: 'Rekomendasi untukmu',
            items: recommended,
            onItemTap: _open,
            onSeeAll: () => setState(() {
              _type = null;
              _level = LearningLevel.semua;
            }),
          ),
        const Text(
          'Cari materi lain? Coba kata kunci "Penalaran Umum", "Logika", atau "Grafik".',
          textAlign: TextAlign.center,
          style: DS.caption,
        ),
      ],
    );
  }
}
