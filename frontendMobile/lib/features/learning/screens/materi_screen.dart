import 'package:flutter/material.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_filter_chip.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/learning_models.dart';
import '../services/learning_content_service.dart';
import '../widgets/chapter_tile.dart';
import '../widgets/today_lesson_card.dart';
import 'material_detail_screen.dart';

class MateriScreen extends StatefulWidget {
  const MateriScreen({super.key});

  @override
  State<MateriScreen> createState() => _MateriScreenState();
}

class _MateriScreenState extends State<MateriScreen> {
  List<Map<String, dynamic>> _materials = [];
  bool _loading = true;
  bool _showAllLessons = false;
  String _group = 'Semua';
  String? _loadError;

  static const _subjects = <_SubjectInfo>[
    _SubjectInfo('Penalaran Umum', 'TPS', Icons.psychology_alt_rounded),
    _SubjectInfo(
      'Pengetahuan & Pemahaman Umum',
      'TPS',
      Icons.menu_book_rounded,
    ),
    _SubjectInfo(
      'Kemampuan Memahami Bacaan dan Menulis',
      'TPS',
      Icons.edit_note_rounded,
    ),
    _SubjectInfo('Pengetahuan Kuantitatif', 'TPS', Icons.calculate_rounded),
    _SubjectInfo('Literasi Bahasa Indonesia', 'TPS', Icons.translate_rounded),
    _SubjectInfo('Literasi Bahasa Inggris', 'TPS', Icons.language_rounded),
    _SubjectInfo('Penalaran Matematika', 'TPS', Icons.functions_rounded),
    _SubjectInfo('Matematika Saintek', 'Saintek', Icons.square_foot_rounded),
    _SubjectInfo('Fisika', 'Saintek', Icons.bubble_chart_rounded),
    _SubjectInfo('Kimia', 'Saintek', Icons.science_rounded),
    _SubjectInfo('Biologi', 'Saintek', Icons.biotech_rounded),
    _SubjectInfo('Geografi', 'Soshum', Icons.public_rounded),
    _SubjectInfo('Sejarah', 'Soshum', Icons.history_edu_rounded),
    _SubjectInfo('Ekonomi', 'Soshum', Icons.trending_up_rounded),
    _SubjectInfo('Sosiologi', 'Soshum', Icons.groups_rounded),
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Map<String, dynamic> _map(dynamic value) => value is Map
      ? value.map((key, value) => MapEntry(key.toString(), value))
      : <String, dynamic>{};

  Future<void> _load() async {
    try {
      final response = await ApiClient.getData('/materials');
      if (mounted && response is List) {
        setState(() {
          _materials = response
              .whereType<Map>()
              .map(_map)
              .where((row) => row.isNotEmpty)
              .toList();
          _loadError = null;
        });
      }
    } catch (error) {
      if (mounted) setState(() => _loadError = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  List<_SubjectInfo> get _visibleSubjects {
    final subjects = [..._subjects];
    if (_showAllLessons) {
      final knownNames = _subjects.map((s) => s.name.toLowerCase()).toSet();
      final extra = _materials
          .map((row) => row['subject']?.toString().trim() ?? '')
          .where(
            (name) =>
                name.isNotEmpty && !knownNames.contains(name.toLowerCase()),
          )
          .toSet();
      subjects.addAll(
        extra.map(
          (name) => _SubjectInfo(name, 'Lainnya', Icons.menu_book_rounded),
        ),
      );
    }
    return subjects
        .where((s) => _group == 'Semua' || s.group == _group)
        .toList();
  }

  List<Map<String, dynamic>> _materialsFor(_SubjectInfo subject) => _materials
      .where(
        (row) =>
            (row['subject']?.toString() ?? '').toLowerCase() ==
            subject.name.toLowerCase(),
      )
      .toList();

  void _openSubject(_SubjectInfo subject) {
    AppNav.subjectCurriculum(context, subject: subject.name);
  }

  void _openMaterial(Map<String, dynamic> row) {
    final id = (row['id'] as num?)?.toInt();
    if (id == null) return;
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => MaterialDetailScreen(
          materialId: id,
          title: row['title']?.toString() ?? 'Materi',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppHeaderScaffold(
      title: 'Materi',
      subtitle: 'Pilih pelajaran dan lanjutkan persiapan UTBK/SNBT.',
      children: [
        _catalogCard(),
        _backendMaterialsCard(),
        TodayLessonCard(
          lesson: LearningContentService.today,
          onLessonTap: (title) => AppNav.searchMaterials(context, query: title),
        ),
        AppSectionCard(
          title: 'Bab Selanjutnya',
          children: [
            for (final chapter in LearningContentService.chapters)
              ChapterTile(
                chapter: chapter,
                onTap: () => AppNav.practice(
                  context,
                  topic: 'Bab ${chapter.number}: ${chapter.title}',
                ),
              ),
          ],
        ),
      ],
    );
  }

  Widget _catalogCard() {
    final total = _materials.length;
    final completed = _materials
        .where((m) => m['is_completed'] == true || m['is_completed'] == 1)
        .length;
    final progress = total == 0 ? 0.0 : completed / total;
    final subjects = _visibleSubjects;
    return AppSectionCard(
      title: 'Fitur Belajar',
      elevated: true,
      children: [
        Row(
          children: [
            const Spacer(),
            PopupMenuButton<String>(
              initialValue: 'Belajar Mandiri',
              onSelected: (value) {
                if (value == 'Belajar dengan Mentor') {
                  AppNav.mentor(context);
                } else if (value == 'Latihan Soal') {
                  AppNav.searchMaterials(context, type: LearningType.latihan);
                }
              },
              itemBuilder: (_) => const [
                PopupMenuItem(
                  value: 'Belajar Mandiri',
                  child: Text('Belajar Mandiri'),
                ),
                PopupMenuItem(
                  value: 'Belajar dengan Mentor',
                  child: Text('Belajar dengan Mentor'),
                ),
                PopupMenuItem(
                  value: 'Latihan Soal',
                  child: Text('Latihan Soal'),
                ),
              ],
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: DS.primarySoft,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Belajar Mandiri', style: DS.label),
                    SizedBox(width: 6),
                    Icon(Icons.keyboard_arrow_down_rounded, color: DS.primary),
                  ],
                ),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: _tab(
                'Materi UTBK',
                selected: !_showAllLessons,
                onTap: () => setState(() => _showAllLessons = false),
              ),
            ),
            Expanded(
              child: _tab(
                'Semua Pelajaran',
                selected: _showAllLessons,
                onTap: () => setState(() => _showAllLessons = true),
              ),
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 6,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text('Progres materi', style: DS.caption),
                ),
                Text('$completed/$total selesai', style: DS.caption),
              ],
            ),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 7,
                backgroundColor: DS.borderSoft,
                color: DS.primary,
              ),
            ),
          ],
        ),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final group in ['Semua', 'TPS', 'Saintek', 'Soshum'])
              AppFilterChip(
                label: group,
                selected: _group == group,
                onTap: () => setState(() => _group = group),
              ),
          ],
        ),
        if (_loading) const LinearProgressIndicator(),
        if (_loadError != null && _materials.isEmpty)
          Text(
            'Materi backend belum dapat dimuat. Periksa koneksi server lalu coba lagi.',
            style: DS.caption.copyWith(color: DS.textSecondary),
          ),
        LayoutBuilder(
          builder: (context, constraints) {
            final columns = constraints.maxWidth >= 500 ? 4 : 3;
            return GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: subjects.length,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: columns,
                mainAxisSpacing: 12,
                crossAxisSpacing: 8,
                childAspectRatio: .78,
              ),
              itemBuilder: (context, index) => _subjectTile(subjects[index]),
            );
          },
        ),
        Row(
          spacing: 10,
          children: [
            Expanded(
              child: _utilityTile(
                'Bank Soal',
                Icons.account_balance_outlined,
                () =>
                    AppNav.searchMaterials(context, type: LearningType.latihan),
              ),
            ),
            Expanded(
              child: _utilityTile(
                'Try Out',
                Icons.assignment_outlined,
                () => AppNav.tryouts(context),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _tab(
    String title, {
    required bool selected,
    required VoidCallback onTap,
  }) => InkWell(
    onTap: onTap,
    child: Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Column(
        children: [
          Text(
            title,
            textAlign: TextAlign.center,
            style: DS.itemTitle.copyWith(
              fontSize: 14,
              color: selected ? DS.primary : DS.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            height: 3,
            decoration: BoxDecoration(
              color: selected ? DS.primary : DS.borderSoft,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
        ],
      ),
    ),
  );

  Widget _subjectTile(_SubjectInfo subject) {
    final count = _materialsFor(subject).length;
    final colors =
        _subjectColors[subject.group] ?? const (Color(0xFFE8F5FF), DS.primary);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _openSubject(subject),
        child: Padding(
          padding: const EdgeInsets.all(4),
          child: Column(
            children: [
              Expanded(
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: colors.$1,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(subject.icon, size: 38, color: colors.$2),
                      if (count > 0)
                        Positioned(
                          right: 4,
                          top: 4,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '$count',
                              style: DS.caption.copyWith(
                                fontSize: 9,
                                color: DS.primary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                subject.name,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: DS.caption.copyWith(
                  color: DS.textPrimary,
                  fontWeight: FontWeight.w600,
                  height: 1.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _utilityTile(String label, IconData icon, VoidCallback onTap) =>
      Material(
        color: DS.primarySoft,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              spacing: 8,
              children: [
                Icon(icon, color: DS.primary),
                Expanded(child: Text(label, style: DS.cardTitle)),
              ],
            ),
          ),
        ),
      );

  Widget _backendMaterialsCard() {
    final subjects =
        _materials
            .map((row) => row['subject']?.toString() ?? 'Materi lainnya')
            .toSet()
            .toList()
          ..sort((a, b) {
            final ai = _subjects.indexWhere(
              (s) => s.name.toLowerCase() == a.toLowerCase(),
            );
            final bi = _subjects.indexWhere(
              (s) => s.name.toLowerCase() == b.toLowerCase(),
            );
            return (ai < 0 ? 999 : ai).compareTo(bi < 0 ? 999 : bi);
          });
    return AppSectionCard(
      title: 'Materi dari Backend',
      elevated: true,
      children: [
        if (_loading && _materials.isEmpty) const LinearProgressIndicator(),
        if (!_loading && _materials.isEmpty)
          Text(
            _loadError == null
                ? 'Belum ada materi yang diterbitkan.'
                : 'Materi server belum dapat dimuat. Periksa koneksi backend.',
            style: DS.body,
          ),
        for (final subject in subjects) ...[
          Row(
            children: [
              Expanded(child: Text(subject, style: DS.cardTitle)),
              Text(
                '${_materials.where((m) => m['subject'] == subject).length} materi',
                style: DS.caption,
              ),
            ],
          ),
          for (final item in _materials.where((m) => m['subject'] == subject))
            _backendMaterialTile(item),
        ],
      ],
    );
  }

  Widget _backendMaterialTile(Map<String, dynamic> item) => Material(
    color: DS.pageBackground,
    borderRadius: BorderRadius.circular(12),
    child: InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () => _openMaterial(item),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          spacing: 10,
          children: [
            Icon(
              item['is_completed'] == true || item['is_completed'] == 1
                  ? Icons.check_circle
                  : Icons.menu_book_rounded,
              color: DS.primary,
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item['title']?.toString() ?? 'Materi',
                    style: DS.cardTitle,
                  ),
                  Text(
                    item['description']?.toString() ?? '',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: DS.caption,
                  ),
                ],
              ),
            ),
            Text(
              '${(item['estimated_minutes'] as num?)?.toInt() ?? 0} mnt',
              style: DS.caption,
            ),
          ],
        ),
      ),
    ),
  );

  static const _subjectColors = <String, (Color, Color)>{
    'TPS': (Color(0xFFE8F0FE), Color(0xFF477CC4)),
    'Saintek': (Color(0xFFE2F4F2), Color(0xFF168B8B)),
    'Soshum': (Color(0xFFFFF1E5), Color(0xFFD77A32)),
  };
}

class _SubjectInfo {
  const _SubjectInfo(this.name, this.group, this.icon);
  final String name;
  final String group;
  final IconData icon;
}
