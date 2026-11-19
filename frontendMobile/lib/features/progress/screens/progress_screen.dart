import 'package:flutter/material.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../profile/widgets/profile_popup.dart';
import '../models/progress_models.dart';
import '../widgets/notes_card.dart';
import '../widgets/progress_hero.dart';
import '../widgets/progress_trend_card.dart';
import '../widgets/subtest_access_card.dart';
import '../widgets/tryout_history_card.dart';
import '../widgets/tryout_stats_card.dart';

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({super.key});

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  Map<String, dynamic>? _overview;
  bool _loading = true;

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
      final result = _map(await ApiClient.getData('/progress/overview'));
      if (mounted) {
        setState(() {
          _overview = result;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _overview = {};
          _loading = false;
        });
      }
    }
  }

  List<Map<String, dynamic>> get _attemptRows => _overview?['tryouts'] is List
      ? (_overview!['tryouts'] as List)
            .map(_map)
            .where((x) => x.isNotEmpty)
            .toList()
      : <Map<String, dynamic>>[];

  List<Map<String, dynamic>> get _practiceRows =>
      _overview?['practice_history'] is List
      ? (_overview!['practice_history'] as List)
            .map(_map)
            .where((x) => x.isNotEmpty)
            .toList()
      : <Map<String, dynamic>>[];

  ProgressData get _progressData {
    const fallback = ProgressData(
      userName: '',
      university: '',
      score: '0',
      streak: 0,
      latest: TryoutResult(label: '', score: 0, status: ''),
      history: [],
      statsLabel: '',
      stats: [],
      subtests: [],
    );
    final overview = _overview;
    if (overview == null) return fallback;
    final summary = _map(overview['summary']);
    final attempts = overview['tryouts'] is List
        ? (overview['tryouts'] as List)
              .map(_map)
              .where((x) => x.isNotEmpty)
              .toList()
        : <Map<String, dynamic>>[];
    final results = attempts.map((row) {
      final submitted = row['submitted_at']?.toString();
      final correct = (row['correct_count'] as num?)?.toInt() ?? 0;
      final total = (row['total_questions'] as num?)?.toInt() ?? 0;
      return TryoutResult(
        label: row['title']?.toString() ?? 'Tryout',
        score: (row['score'] as num?)?.round() ?? 0,
        status: 'Selesai',
        dateLabel: submitted,
        summary: '$correct benar • $total soal',
        attemptId: (row['attempt_id'] as num?)?.toInt(),
      );
    }).toList();
    final subjectRows = overview['subjects'] is List
        ? (overview['subjects'] as List)
              .map(_map)
              .where((x) => x.isNotEmpty)
              .toList()
        : <Map<String, dynamic>>[];
    final strengths = overview['strengths'] is List
        ? (overview['strengths'] as List).map((x) => '$x').toSet()
        : <String>{};
    final stats = subjectRows.map((row) {
      final accuracy = row['accuracy_percent'] as num?;
      final progress = row['progress_percent'] as num?;
      final name = row['subject']?.toString() ?? 'Subtes';
      return SubjectStat(
        code: name,
        topic: accuracy == null
            ? 'Belum ada jawaban'
            : '${row['questions_correct'] ?? 0} benar dari ${row['questions_answered'] ?? 0} soal',
        value: ((accuracy ?? progress ?? 0) / 100).clamp(0, 1).toDouble(),
        isStrong: strengths.contains(name),
      );
    }).toList();
    final score = results.isEmpty ? fallback.score : '${results.first.score}';
    return ProgressData(
      userName: fallback.userName,
      university: fallback.university,
      score: '${summary['total_points'] ?? score}',
      streak: (summary['streak_days'] as num?)?.toInt() ?? 0,
      latest: results.isEmpty ? fallback.latest : results.first,
      history: results.length < 2 ? const [] : results.skip(1).toList(),
      statsLabel: results.isEmpty ? 'Progres' : results.first.label,
      stats: stats,
      subtests: subjectRows
          .map(
            (row) => SubtestAccess(
              name: row['subject']?.toString() ?? 'Subtes',
              summary:
                  '${row['questions_answered'] ?? 0} soal dijawab • ${row['accuracy_percent'] ?? 0}% akurasi',
            ),
          )
          .toList(),
      notes: fallback.notes,
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = _progressData;
    return Scaffold(
      backgroundColor: DS.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverPersistentHeader(
            pinned: true,
            delegate: _PinnedProgressHeaderDelegate(
              child: ProgressHero(
                data: data,
                onAvatarTap: () => showProfilePopup(context),
                onCreateNote: () => AppNav.studyNotes(context),
                onOpenStats: () => AppNav.progressStats(context),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                DS.screenPadding,
                16,
                DS.screenPadding,
                104,
              ),
              child: Column(
                spacing: 16,
                children: [
                  if (_loading)
                    const Padding(
                      padding: EdgeInsets.all(32),
                      child: CircularProgressIndicator(),
                    )
                  else if (_attemptRows.isEmpty && _practiceRows.isEmpty)
                    _emptyProgress(context)
                  else ...[
                    if (_attemptRows.isNotEmpty)
                      TryoutHistoryCard(
                        latest: data.latest,
                        history: data.history,
                        onOpen: (result) => AppNav.tryoutReview(
                          context,
                          title: result.label,
                          attemptId: result.attemptId,
                        ),
                      ),
                    ProgressTrendCard(
                      title: 'Tren skor tryout',
                      subtitle:
                          'Perubahan skor dari tryout yang sudah diselesaikan.',
                      points: [
                        for (final (index, row)
                            in _attemptRows.reversed.indexed)
                          TrendPoint(
                            label: 'TO-${index + 1}',
                            value: ((row['score'] as num?)?.toDouble() ?? 0),
                          ),
                      ],
                      emptyMessage: 'Belum ada hasil tryout untuk ditampilkan.',
                    ),
                    ProgressTrendCard(
                      title: 'Tren latihan soal',
                      subtitle: 'Akurasi jawaban latihan per hari.',
                      color: const Color(0xFF22A06B),
                      points: [
                        for (final row in _practiceRows)
                          TrendPoint(
                            label: _dateLabel(row['activity_date']?.toString()),
                            value:
                                (row['score_percent'] as num?)?.toDouble() ?? 0,
                          ),
                      ],
                      emptyMessage: 'Belum ada latihan soal. Selesaikan latihan agar grafik akurasi muncul.',
                    ),
                    if (data.stats.isNotEmpty)
                      TryoutStatsCard(
                        tryoutLabel: data.statsLabel,
                        stats: data.stats,
                      ),
                    if (data.subtests.isNotEmpty)
                      SubtestAccessCard(
                        subtests: data.subtests,
                        onCheck: (s) => AppNav.practice(context, topic: s.name),
                      ),
                    NotesCard(
                      notes: data.notes,
                      onCreate: () => AppNav.studyNotes(context),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _dateLabel(String? raw) {
    if (raw == null || raw.length < 10) return '';
    return raw.substring(5, 10);
  }

  Widget _emptyProgress(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(24),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: DS.borderSoft),
      boxShadow: DS.cardShadow,
    ),
    child: Column(
      children: [
        Container(
          width: 76,
          height: 76,
          decoration: const BoxDecoration(
            color: DS.primarySoft,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.insights_outlined,
            size: 38,
            color: DS.primary,
          ),
        ),
        const SizedBox(height: 14),
        Text(
          'Perjalanan belajarmu dimulai di sini',
          style: DS.sectionTitle,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          'Selesaikan tryout atau latihan soal. Hasil dan perkembanganmu akan tercatat di halaman ini.',
          style: DS.body,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 18),
        AppActionButton(
          label: 'Mulai tryout',
          onPressed: () => AppNav.tryouts(context),
          leading: const Icon(Icons.assignment_outlined, size: 18),
        ),
        const SizedBox(height: 10),
        OutlinedButton.icon(
          onPressed: () => AppNav.practice(context, topic: 'Penalaran Umum'),
          icon: const Icon(Icons.menu_book_outlined),
          label: const Text('Mulai latihan soal'),
        ),
      ],
    ),
  );
}

class _PinnedProgressHeaderDelegate extends SliverPersistentHeaderDelegate {
  const _PinnedProgressHeaderDelegate({required this.child});
  final Widget child;
  static const double _extent = 242;
  @override
  double get minExtent => _extent;
  @override
  double get maxExtent => _extent;
  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) => child;
  @override
  bool shouldRebuild(_PinnedProgressHeaderDelegate oldDelegate) =>
      oldDelegate.child != child;
}
