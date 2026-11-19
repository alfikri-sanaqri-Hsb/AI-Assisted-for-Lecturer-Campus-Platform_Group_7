import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../models/learning_models.dart';
import '../models/subject_curriculum.dart';
import 'material_detail_screen.dart';

class SubjectCurriculumScreen extends StatefulWidget {
  const SubjectCurriculumScreen({super.key, required this.subject});

  final String subject;

  @override
  State<SubjectCurriculumScreen> createState() =>
      _SubjectCurriculumScreenState();
}

class _SubjectCurriculumScreenState extends State<SubjectCurriculumScreen> {
  List<Map<String, dynamic>> _backendMaterials = [];
  bool _loading = true;
  String? _error;

  Map<String, dynamic> _map(dynamic value) => value is Map
      ? value.map((key, value) => MapEntry(key.toString(), value))
      : <String, dynamic>{};

  @override
  void initState() {
    super.initState();
    _loadBackendMaterials();
  }

  Future<void> _loadBackendMaterials() async {
    try {
      final subject = Uri.encodeQueryComponent(widget.subject);
      final response = await ApiClient.getData('/materials?subject=$subject');
      if (mounted) {
        setState(() {
          _backendMaterials = response is List
              ? response.whereType<Map>().map(_map).toList()
              : [];
          _error = null;
        });
      }
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final chapters = SubjectCurriculum.forSubject(widget.subject);
    final theme = _subjectTheme(widget.subject);
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: theme.light
          ? SystemUiOverlayStyle.light
          : SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: DS.pageBackground,
        body: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverAppBar(
              pinned: true,
              expandedHeight: 280,
              toolbarHeight: 64,
              backgroundColor: theme.background,
              foregroundColor: theme.foreground,
              elevation: 0,
              scrolledUnderElevation: 0,
              titleSpacing: 0,
              title: const SizedBox.shrink(),
              flexibleSpace: LayoutBuilder(
                builder: (context, constraints) {
                  final visibleHeight = constraints.biggest.height;
                  final expanded = ((visibleHeight - 90) / 190).clamp(0.0, 1.0);
                  return Stack(
                    fit: StackFit.expand,
                    children: [
                      DecoratedBox(
                        decoration: BoxDecoration(color: theme.background),
                      ),
                      Positioned(
                        left: 72,
                        right: 16,
                        top: MediaQuery.paddingOf(context).top + 10,
                        child: IgnorePointer(
                          child: Opacity(
                            opacity: 1 - expanded,
                            child: Text(
                              widget.subject,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: DS.itemTitle.copyWith(
                                color: theme.foreground,
                                fontSize: 17,
                              ),
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 24,
                        right: 24,
                        bottom: 28,
                        child: IgnorePointer(
                          child: Opacity(
                            opacity: expanded,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  widget.subject,
                                  style: DS.pageTitle.copyWith(
                                    fontSize: 29,
                                    height: 1.25,
                                    color: theme.foreground,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'UTBK',
                                  style: DS.body.copyWith(
                                    color: theme.foreground,
                                    fontSize: 17,
                                  ),
                                ),
                                if (theme.showBankLink) ...[
                                  const SizedBox(height: 18),
                                  InkWell(
                                    onTap: () => AppNav.searchMaterials(
                                      context,
                                      query: widget.subject,
                                      type: LearningType.latihan,
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Flexible(
                                          child: Text(
                                            'Lihat naskah asli UTBK & Bank Soal',
                                            style: DS.body.copyWith(
                                              color: theme.foreground,
                                              decoration:
                                                  TextDecoration.underline,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Icon(
                                          Icons.chevron_right_rounded,
                                          color: theme.foreground,
                                          size: 25,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
            SliverToBoxAdapter(
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: DS.pageBackground,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                ),
                padding: EdgeInsets.fromLTRB(16, 18, 16, 36),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  spacing: 10,
                  children: [
                    Text(
                      'Pilihan Bab (${chapters.length})',
                      style: DS.sectionTitle.copyWith(
                        color: const Color(0xFF60768F),
                      ),
                    ),
                    if (chapters.isEmpty)
                      _emptyCurriculum()
                    else
                      for (final (index, chapter) in chapters.indexed)
                        _chapterRow(chapter, index),
                    if (_loading)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        child: LinearProgressIndicator(),
                      ),
                    if (_error != null && chapters.isEmpty)
                      _infoCard(
                        'Kurikulum untuk mata pelajaran ini belum tersedia. Data bab akan ditambahkan setelah materinya dikirim.',
                      ),
                    if (_backendMaterials.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Text('Materi dari pengajar', style: DS.sectionTitle),
                      for (final material in _backendMaterials)
                        _backendMaterialTile(material),
                    ] else if (!_loading &&
                        chapters.isNotEmpty &&
                        _error == null) ...[
                      const SizedBox(height: 8),
                      _infoCard(
                        'Bab kurikulum sudah ditampilkan. Materi lengkap dari pengajar untuk pelajaran ini belum tersedia di backend.',
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _chapterRow(SubjectChapter chapter, int index) {
    final palette = _chapterColors[index % _chapterColors.length];
    final tileColor = _subjectTheme(widget.subject).tileColor ?? palette.$1;
    return Container(
      constraints: const BoxConstraints(minHeight: 86),
      padding: const EdgeInsets.symmetric(vertical: 11),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Color(0xFFE5EAF1), width: 1)),
      ),
      child: Row(
        spacing: 14,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: tileColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(chapter.icon, size: 27, color: palette.$2),
          ),
          Expanded(
            child: Text(
              chapter.title,
              style: DS.itemTitle.copyWith(
                fontSize: 15,
                color: const Color(0xFF53677F),
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          SizedBox(
            width: 54,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '0%',
                  style: DS.label.copyWith(
                    color: const Color(0xFF69B52E),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 7),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: const LinearProgressIndicator(
                    value: 0,
                    minHeight: 4,
                    backgroundColor: Color(0xFFE9EDF5),
                    color: Color(0xFF69B52E),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _backendMaterialTile(Map<String, dynamic> material) {
    final id = (material['id'] as num?)?.toInt();
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: id == null
            ? null
            : () => Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => MaterialDetailScreen(
                    materialId: id,
                    title: material['title']?.toString() ?? 'Materi',
                  ),
                ),
              ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            spacing: 10,
            children: [
              const Icon(Icons.menu_book_rounded, color: DS.primary),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      material['title']?.toString() ?? 'Materi',
                      style: DS.cardTitle,
                    ),
                    Text(
                      material['description']?.toString() ?? '',
                      style: DS.caption,
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: DS.textSecondary),
            ],
          ),
        ),
      ),
    );
  }

  Widget _emptyCurriculum() => _infoCard(
    'Rincian bab untuk ${widget.subject} belum tersedia. Kirimkan daftar babnya agar halaman ini bisa dilengkapi.',
  );

  Widget _infoCard(String message) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: DS.borderSoft),
    ),
    child: Text(message, style: DS.body),
  );

  ({
    Color background,
    Color foreground,
    Color? tileColor,
    bool light,
    bool showBankLink,
  })
  _subjectTheme(String subject) => switch (subject) {
    'Fisika' => (
      background: const Color(0xFFED91B2),
      foreground: const Color(0xFF53677F),
      tileColor: const Color(0xFFED91B2),
      light: false,
      showBankLink: true,
    ),
    'Kimia' => (
      background: const Color(0xFFFFCE68),
      foreground: const Color(0xFF53677F),
      tileColor: const Color(0xFFFFCE68),
      light: false,
      showBankLink: true,
    ),
    'Biologi' => (
      background: const Color(0xFFA8DF70),
      foreground: const Color(0xFF53677F),
      tileColor: const Color(0xFFA8DF70),
      light: false,
      showBankLink: true,
    ),
    'Geografi' => (
      background: const Color(0xFF73E5AE),
      foreground: const Color(0xFF53677F),
      tileColor: const Color(0xFF73E5AE),
      light: false,
      showBankLink: true,
    ),
    'Sejarah' => (
      background: const Color(0xFFC7A581),
      foreground: const Color(0xFF53677F),
      tileColor: const Color(0xFFC7A581),
      light: false,
      showBankLink: true,
    ),
    'Ekonomi' => (
      background: const Color(0xFFFFF16D),
      foreground: const Color(0xFF53677F),
      tileColor: const Color(0xFFFFF16D),
      light: false,
      showBankLink: true,
    ),
    'Sosiologi' => (
      background: const Color(0xFFC987F4),
      foreground: const Color(0xFF53677F),
      tileColor: const Color(0xFFC987F4),
      light: false,
      showBankLink: true,
    ),
    _ => (
      background: const Color(0xFF3D76C3),
      foreground: Colors.white,
      tileColor: null,
      light: true,
      showBankLink: false,
    ),
  };

  static const _chapterColors = <(Color, Color)>[
    (Color(0xFFF18C84), Color(0xFF087CB3)),
    (Color(0xFF56CDE3), Color(0xFF177DA5)),
    (Color(0xFF8BE6C2), Color(0xFF20896C)),
    (Color(0xFFA880E3), Color(0xFF673AB7)),
    (Color(0xFF8ADDF1), Color(0xFF176EA0)),
    (Color(0xFFFFB0A1), Color(0xFFDB564B)),
  ];
}
