import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import 'ptn_prediction_screen.dart';

enum FeaturePageKind {
  prediction,
  videos,
  module,
  flashcards,
  liveClasses,
  mentorProfile,
  mentorBooking,
  studyNotes,
  progressStats,
  tryoutReview,
}

/// Lightweight, interactive pages for features that previously had no destination.
/// Content is local demo data until the corresponding API is available.
class FeaturePagesScreen extends StatefulWidget {
  const FeaturePagesScreen({
    super.key,
    required this.kind,
    this.itemTitle,
    this.description,
    this.imagePath,
    this.attemptId,
    this.backendVideoId,
    this.videoUrl,
    this.backendMentorId,
  });

  final FeaturePageKind kind;
  final String? itemTitle;
  final String? description;
  final String? imagePath;
  final int? attemptId;
  final int? backendVideoId;
  final String? videoUrl;
  final int? backendMentorId;

  @override
  State<FeaturePagesScreen> createState() => _FeaturePagesScreenState();
}

class _FeaturePagesScreenState extends State<FeaturePagesScreen> {
  int _index = 0;
  bool _revealed = false;
  bool _joined = false;
  final _noteController = TextEditingController();
  static const _noteStorageKey = 'saved_study_notes';
  String _flashcardTopic = 'Penalaran Umum';
  Map<String, dynamic>? _attempt;
  List<Map<String, dynamic>> _videos = [];
  Map<String, dynamic>? _mentor;
  dynamic _studyInsight;
  bool _loadingInsight = false;
  bool _watching = false;

  @override
  void initState() {
    super.initState();
    if (widget.kind == FeaturePageKind.tryoutReview &&
        widget.attemptId != null) {
      _loadAttempt();
    }
    if (widget.kind == FeaturePageKind.videos) _loadVideos();
    if (widget.kind == FeaturePageKind.mentorProfile &&
        widget.backendMentorId != null)
      _loadMentor();
    if (widget.kind == FeaturePageKind.progressStats) _loadStudyInsight();
  }

  Future<void> _loadStudyInsight() async {
    try {
      final value = await ApiClient.getData('/ai/insights/study/latest');
      if (mounted) setState(() => _studyInsight = value);
    } catch (_) {}
  }

  Future<void> _generateStudyInsight() async {
    setState(() => _loadingInsight = true);
    try {
      final value = await ApiClient.postData('/ai/insights/study');
      if (mounted) setState(() => _studyInsight = value);
    } catch (error) {
      if (mounted)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Analisis belum dapat dibuat: $error')),
        );
    } finally {
      if (mounted) setState(() => _loadingInsight = false);
    }
  }

  Future<void> _loadMentor() async {
    try {
      final value = await ApiClient.getData(
        '/mentors/${widget.backendMentorId}',
      );
      if (mounted && value is Map)
        setState(() => _mentor = value.map((k, v) => MapEntry('$k', v)));
    } catch (_) {}
  }

  Future<void> _loadVideos() async {
    try {
      final value = await ApiClient.getData('/videos');
      if (mounted && value is List) {
        setState(
          () => _videos = value
              .whereType<Map>()
              .map((row) => row.map((k, v) => MapEntry('$k', v)))
              .toList(),
        );
      }
    } catch (_) {}
  }

  Future<void> _recordVideoWatch() async {
    final id = widget.backendVideoId;
    if (id == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Video ini belum memiliki data backend.')),
      );
      return;
    }
    setState(() => _watching = true);
    try {
      await ApiClient.postData('/videos/$id/watch');
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Aktivitas menonton berhasil dicatat.')),
      );
    } catch (error) {
      if (mounted)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Video belum dapat dicatat: $error')),
        );
    } finally {
      if (mounted) setState(() => _watching = false);
    }
  }

  Future<void> _loadAttempt() async {
    try {
      final value = await ApiClient.getData(
        '/tryouts/attempts/${widget.attemptId}',
      );
      if (mounted && value is Map) {
        setState(
          () => _attempt = value.map((key, value) => MapEntry('$key', value)),
        );
      }
    } catch (error) {
      if (mounted) setState(() => _attempt = {'error': error.toString()});
    }
  }

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  String get _title =>
      widget.itemTitle ??
      switch (widget.kind) {
        FeaturePageKind.prediction => 'Prediksi Peluang',
        FeaturePageKind.videos => 'Video Materi',
        FeaturePageKind.module => 'Modul Belajar',
        FeaturePageKind.flashcards => 'Flashcard',
        FeaturePageKind.liveClasses => 'Live Class',
        FeaturePageKind.mentorProfile => 'Profil Mentor',
        FeaturePageKind.mentorBooking => 'Pesan Sesi Mentor',
        FeaturePageKind.studyNotes => 'Catatan Belajar',
        FeaturePageKind.progressStats => 'Statistik Belajar',
        FeaturePageKind.tryoutReview => 'Hasil Tryout',
      };

  String get _subtitle => switch (widget.kind) {
    FeaturePageKind.prediction =>
      'Buat strategi target kampus berdasarkan progres belajarmu.',
    FeaturePageKind.videos =>
      'Belajar lewat video singkat yang disusun untuk persiapan ujian.',
    FeaturePageKind.module =>
      'Ringkasan materi, tujuan belajar, dan latihan terarah.',
    FeaturePageKind.flashcards =>
      'Ulang konsep penting dengan sesi kartu singkat.',
    FeaturePageKind.liveClasses =>
      'Jadwal kelas interaktif dan pembahasan bersama mentor.',
    FeaturePageKind.mentorProfile =>
      widget.description ?? 'Mentor pendamping persiapan ujian.',
    FeaturePageKind.mentorBooking =>
      widget.description ?? 'Pilih mentor dan rencanakan sesi belajarmu.',
    FeaturePageKind.studyNotes =>
      'Simpan evaluasi singkat agar langkah belajar berikutnya lebih jelas.',
    FeaturePageKind.progressStats =>
      'Lihat ringkasan kemampuan dan area yang perlu diperkuat.',
    FeaturePageKind.tryoutReview => 'Ringkasan hasil dan rekomendasi evaluasi.',
  };

  @override
  Widget build(BuildContext context) => AppHeaderScaffold(
    title: _title,
    subtitle: _subtitle,
    children: [
      switch (widget.kind) {
        FeaturePageKind.prediction => const PtnPredictionScreen(),
        FeaturePageKind.videos => _videoList(),
        FeaturePageKind.module => _module(),
        FeaturePageKind.flashcards => _flashcards(),
        FeaturePageKind.liveClasses => _liveClasses(),
        FeaturePageKind.mentorProfile => _mentorProfile(),
        FeaturePageKind.mentorBooking => _mentorBooking(),
        FeaturePageKind.studyNotes => _studyNotes(),
        FeaturePageKind.progressStats => _progressStats(),
        FeaturePageKind.tryoutReview => _tryoutReview(),
      },
    ],
  );

  Widget _surface({
    required Widget child,
    EdgeInsets padding = const EdgeInsets.all(16),
  }) => Container(
    padding: padding,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: DS.borderSoft),
      boxShadow: DS.cardShadow,
    ),
    child: child,
  );

  Widget _eyebrow(String text) =>
      Text(text.toUpperCase(), style: DS.label.copyWith(letterSpacing: 1.1));

  Widget _metric(String label, String value) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: DS.primarySoft,
      borderRadius: BorderRadius.circular(13),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: DS.caption),
        Text(value, style: DS.heading.copyWith(color: DS.primary)),
      ],
    ),
  );

  Widget _videoList() {
    final fallback = [
      (
        'Strategi Cepat Penalaran Matematika',
        '12 menit · Dasar',
        Icons.functions,
      ),
      (
        'Membaca Grafik dan Tabel',
        '18 menit · Menengah',
        Icons.bar_chart_rounded,
      ),
      (
        'Pola Bilangan untuk UTBK',
        '15 menit · Menengah',
        Icons.grid_4x4_rounded,
      ),
    ];
    final apiItems = _videos
        .where(
          (row) => widget.itemTitle == null || row['title'] == widget.itemTitle,
        )
        .toList();
    final items = apiItems.isEmpty
        ? fallback
        : apiItems
              .map(
                (row) => (
                  row['title']?.toString() ?? 'Video',
                  '${row['duration_minutes'] ?? 0} menit · ${row['subject'] ?? 'Materi'}',
                  Icons.play_circle_outline,
                ),
              )
              .toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 12,
      children: [
        if (widget.itemTitle != null) _videoPlayerCard(),
        _surface(
          child: Row(
            children: [
              const Icon(Icons.auto_awesome, color: DS.primary),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  widget.itemTitle == null
                      ? 'Lanjutkan belajar dalam sesi singkat.'
                      : 'Rangkaian video untuk ${widget.itemTitle}.',
                  style: DS.body,
                ),
              ),
            ],
          ),
        ),
        for (final (index, item) in items.indexed)
          _surface(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Container(
                  width: 82,
                  height: 70,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFEAF7FF), Color(0xFFD6F0ED)],
                    ),
                    borderRadius: BorderRadius.circular(13),
                  ),
                  child: Icon(item.$3, color: DS.primary, size: 30),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.$1, style: DS.cardTitle),
                      const SizedBox(height: 5),
                      Text(item.$2, style: DS.caption),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: 'Buka video',
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => FeaturePagesScreen(
                        kind: FeaturePageKind.videos,
                        itemTitle: item.$1,
                        backendVideoId: apiItems.isEmpty
                            ? null
                            : (apiItems[index]['id'] as num?)?.toInt(),
                        videoUrl: apiItems.isEmpty
                            ? null
                            : apiItems[index]['url']?.toString(),
                      ),
                    ),
                  ),
                  icon: const Icon(
                    Icons.play_circle_outline,
                    color: DS.primary,
                    size: 30,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _videoPlayerCard() => _surface(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 12,
      children: [
        Container(
          height: 190,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0A6FAF), Color(0xFF138A86)],
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Center(
            child: Icon(Icons.play_circle_fill, size: 58, color: Colors.white),
          ),
        ),
        Text(_title, style: DS.heading),
        Text(
          widget.videoUrl == null
              ? 'Tautan video belum tersedia.'
              : 'Tautan materi: ${widget.videoUrl}',
          style: DS.body,
        ),
        AppActionButton(
          label: _watching ? 'Mencatat...' : 'Tandai sudah ditonton',
          onPressed: _watching ? null : _recordVideoWatch,
        ),
      ],
    ),
  );

  Widget _module() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: 14,
    children: [
      _surface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 10,
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: DS.primarySoft,
                borderRadius: BorderRadius.circular(15),
              ),
              child: const Icon(
                Icons.menu_book_rounded,
                color: DS.primary,
                size: 28,
              ),
            ),
            _eyebrow('Modul belajar'),
            Text(_title, style: DS.heading),
            Text(
              widget.description ?? 'Pahami konsep inti, lihat contoh, lalu kerjakan soal untuk menguji pemahaman.',
              style: DS.body,
            ),
            const Wrap(
              spacing: 8,
              children: [
                _Tag(text: '4 bab'),
                _Tag(text: '25 menit'),
                _Tag(text: 'Dasar–Menengah'),
              ],
            ),
          ],
        ),
      ),
      _surface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 4,
          children: [
            Text('Isi modul', style: DS.sectionTitle),
            for (final (i, item) in [
              'Konsep dasar dan istilah penting',
              'Contoh soal bertahap',
              'Strategi menjawab cepat',
              'Latihan pemahaman',
            ].indexed)
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  radius: 16,
                  backgroundColor: DS.primarySoft,
                  child: Text('${i + 1}', style: DS.label),
                ),
                title: Text(item, style: DS.cardTitle),
                trailing: const Icon(
                  Icons.chevron_right,
                  color: DS.textSecondary,
                ),
                onTap: () => setState(() => _index = i),
              ),
          ],
        ),
      ),
      AppActionButton(
        label: _joined ? 'Modul ditambahkan' : 'Mulai modul',
        onPressed: () => setState(() => _joined = true),
      ),
    ],
  );

  Widget _flashcards() {
    const cards = [
      (
        'Apa yang dimaksud dengan gradien?',
        'Gradien adalah ukuran kemiringan garis, yaitu perubahan nilai y dibagi perubahan nilai x.',
      ),
      (
        'Bagaimana cara membaca median?',
        'Urutkan data terlebih dahulu, lalu ambil nilai tengah. Jika jumlah data genap, rata-ratakan dua nilai tengah.',
      ),
    ];
    final card = cards[_index % cards.length];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 14,
      children: [
        _surface(
          child: DropdownButtonFormField<String>(
            initialValue: _flashcardTopic,
            decoration: const InputDecoration(
              labelText: 'Pilih materi flashcard',
            ),
            items:
                const [
                      'Penalaran Umum',
                      'Penalaran Kuantitatif',
                      'Literasi Bahasa Indonesia',
                      'Literasi Bahasa Inggris',
                    ]
                    .map(
                      (topic) =>
                          DropdownMenuItem(value: topic, child: Text(topic)),
                    )
                    .toList(),
            onChanged: (topic) => setState(() {
              _flashcardTopic = topic ?? _flashcardTopic;
              _index = 0;
              _revealed = false;
            }),
          ),
        ),
        _surface(
          child: Row(
            children: [
              Expanded(
                child: Text(
                  '$_flashcardTopic • Kartu ${_index + 1} dari 12',
                  style: DS.cardTitle,
                ),
              ),
              Text('Sesi belajar', style: DS.label),
            ],
          ),
        ),
        GestureDetector(
          onTap: () => setState(() => _revealed = !_revealed),
          child: Container(
            height: 270,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF0A6FAF), Color(0xFF148A82)],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: DS.cardShadow,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _revealed ? Icons.lightbulb_outline : Icons.quiz_outlined,
                  color: Colors.white,
                  size: 36,
                ),
                const SizedBox(height: 18),
                Text(
                  _revealed ? card.$2 : card.$1,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    height: 1.45,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  _revealed
                      ? 'KETUK UNTUK MELIHAT PERTANYAAN'
                      : 'KETUK KARTU UNTUK MELIHAT JAWABAN',
                  style: const TextStyle(
                    color: Color(0xCCFFFFFF),
                    fontSize: 10,
                    letterSpacing: 1.1,
                  ),
                ),
              ],
            ),
          ),
        ),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => setState(() {
                  _index = (_index + 1) % 12;
                  _revealed = false;
                }),
                icon: const Icon(Icons.replay),
                label: const Text('Ulangi'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: FilledButton.icon(
                onPressed: () => setState(() {
                  _index = (_index + 1) % 12;
                  _revealed = false;
                }),
                icon: const Icon(Icons.check),
                label: const Text('Sudah paham'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _liveClasses() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: 12,
    children: [
      _surface(
        child: Row(
          children: [
            const Icon(
              Icons.calendar_month_outlined,
              color: DS.primary,
              size: 28,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text('Kelas pilihan minggu ini', style: DS.sectionTitle),
            ),
          ],
        ),
      ),
      for (final item in [
        (
          'Pembahasan Penalaran Matematika',
          'Hari ini · 19.00 WIB',
          'Mister Ryan',
        ),
        ('Strategi SNBT: Literasi Indonesia', 'Besok · 16.00 WIB', 'Kak Alfi'),
        ('Bedah Tryout Kuantitatif', 'Jumat · 19.30 WIB', 'Prof. Ojan'),
      ])
        _surface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 10,
            children: [
              Row(
                children: [
                  const Icon(Icons.videocam_outlined, color: DS.primary),
                  const SizedBox(width: 8),
                  Expanded(child: Text(item.$1, style: DS.cardTitle)),
                ],
              ),
              Text('${item.$2}  ·  ${item.$3}', style: DS.caption),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => setState(() => _joined = !_joined),
                  child: Text(_joined ? 'Terdaftar · batal' : 'Daftar kelas'),
                ),
              ),
            ],
          ),
        ),
      if (_joined)
        _surface(
          child: const Row(
            children: [
              Icon(Icons.check_circle, color: DS.success),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Pendaftaran tersimpan di perangkat ini.',
                  style: DS.body,
                ),
              ),
            ],
          ),
        ),
    ],
  );

  Widget _mentorProfile() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: 14,
    children: [
      _surface(
        child: Column(
          children: [
            CircleAvatar(
              radius: 42,
              backgroundColor: DS.primarySoft,
              backgroundImage:
                  _mentor?['photo_url'] is String &&
                      '${_mentor!['photo_url']}'.startsWith('http')
                  ? NetworkImage('${_mentor!['photo_url']}')
                  : widget.imagePath == null
                  ? null
                  : AssetImage(widget.imagePath!),
              child: widget.imagePath == null && _mentor?['photo_url'] == null
                  ? const Icon(Icons.person, color: DS.primary, size: 42)
                  : null,
            ),
            const SizedBox(height: 12),
            Text(_title, textAlign: TextAlign.center, style: DS.heading),
            Text(
              '${_mentor?['university'] ?? 'Mentor akademik'}${_mentor?['major'] == null ? '' : ' • ${_mentor!['major']}'}',
              style: DS.body,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              _mentor?['bio']?.toString() ?? widget.description ?? 'Pendamping belajar dengan fokus pada strategi ujian dan penguatan konsep.',
              textAlign: TextAlign.center,
              style: DS.body,
            ),
          ],
        ),
      ),
      _surface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 10,
          children: [
            Text('Keahlian', style: DS.sectionTitle),
            Text(
              (_mentor?['subjects'] is List
                      ? (_mentor!['subjects'] as List).join(' • ')
                      : null) ??
                  widget.description ??
                  'Belum ada keahlian yang dicantumkan.',
              style: DS.body,
            ),
          ],
        ),
      ),
      if (_mentor?['upcoming_sessions'] is List)
        for (final session
            in (_mentor!['upcoming_sessions'] as List).whereType<Map>())
          _surface(
            child: Text(
              '${session['title'] ?? 'Sesi'} • ${session['label'] ?? ''}\n${session['meeting_url'] ?? 'Tautan sesi belum tersedia'}',
              style: DS.body,
            ),
          ),
    ],
  );

  Widget _mentorBooking() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: 14,
    children: [
      _surface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 10,
          children: [
            _eyebrow('Mentor pilihan'),
            Text(_title, style: DS.heading),
            const Text(
              'Pilih waktu yang tersedia untuk sesi konsultasi belajar.',
              style: DS.body,
            ),
          ],
        ),
      ),
      _surface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Pilih jadwal', style: DS.sectionTitle),
            for (final (i, time) in [
              'Hari ini · 19.00–19.30',
              'Besok · 16.00–16.30',
              'Jumat · 19.30–20.00',
            ].indexed)
              InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () => setState(() => _index = i),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Row(
                    children: [
                      Icon(
                        _index == i
                            ? Icons.radio_button_checked
                            : Icons.radio_button_unchecked,
                        color: _index == i ? DS.primary : DS.textSecondary,
                      ),
                      const SizedBox(width: 10),
                      Expanded(child: Text(time, style: DS.body)),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
      AppActionButton(
        label: _joined ? 'Permintaan terkirim' : 'Konfirmasi permintaan',
        onPressed: () => setState(() => _joined = true),
      ),
      if (_joined)
        _surface(
          child: const Text(
            'Permintaan sesi tercatat. Mentor akan menghubungi kamu untuk konfirmasi.',
            style: DS.body,
          ),
        ),
    ],
  );

  Future<void> _saveNote() async {
    final note = _noteController.text.trim();
    if (note.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Tulis catatan terlebih dahulu.')),
      );
      return;
    }
    final prefs = await SharedPreferences.getInstance();
    final notes = prefs.getStringList(_noteStorageKey) ?? <String>[];
    notes.insert(0, note);
    await prefs.setStringList(_noteStorageKey, notes);
    if (!mounted) return;
    setState(() => _joined = true);
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Catatan berhasil disimpan.')));
  }

  Widget _studyNotes() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: 14,
    children: [
      _surface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 12,
          children: [
            const Text('Apa yang ingin kamu ingat?', style: DS.sectionTitle),
            TextField(
              controller: _noteController,
              maxLines: 5,
              decoration: InputDecoration(
                hintText: 'Contoh: Ulangi konsep peluang dan latihan 10 soal sebelum tryout berikutnya.',
                filled: true,
                fillColor: DS.pageBackground,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: DS.borderSoft),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: DS.borderSoft),
                ),
              ),
            ),
            AppActionButton(
              label: _joined ? 'Catatan tersimpan' : 'Simpan catatan',
              onPressed: _saveNote,
            ),
          ],
        ),
      ),
      if (_joined)
        _surface(child: Text(_noteController.text.trim(), style: DS.body)),
    ],
  );

  Widget _progressStats() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    spacing: 14,
    children: [
      AppActionButton(
        label: _loadingInsight
            ? 'Menyusun analisis...'
            : 'Buat analisis belajar AI',
        onPressed: _loadingInsight ? null : _generateStudyInsight,
      ),
      if (_studyInsight != null)
        _surface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 8,
            children: [
              Text('Rekomendasi belajarmu', style: DS.sectionTitle),
              Text(
                _studyInsight is String
                    ? _studyInsight as String
                    : const JsonEncoder.withIndent('  ').convert(_studyInsight),
                style: DS.body,
              ),
            ],
          ),
        ),
      _surface(
        child: Row(
          children: [
            Expanded(child: _metric('Skor tryout', '612')),
            const SizedBox(width: 10),
            Expanded(child: _metric('Konsistensi', '5 hari')),
          ],
        ),
      ),
      _surface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 16,
          children: [
            Text('Penguasaan subtes', style: DS.sectionTitle),
            for (final item in [
              ('Penalaran Umum', .78),
              ('Pengetahuan Kuantitatif', .61),
              ('Literasi Indonesia', .84),
              ('Literasi Inggris', .55),
            ])
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(child: Text(item.$1, style: DS.body)),
                      Text('${(item.$2 * 100).round()}%', style: DS.label),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(7),
                    child: LinearProgressIndicator(
                      value: item.$2,
                      minHeight: 8,
                      color: item.$2 > .7
                          ? const Color(0xFF138A72)
                          : DS.primary,
                      backgroundColor: DS.primarySoft,
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
      _surface(
        child: const Text(
          'Fokus berikutnya: latih kembali subtes dengan skor terendah, lalu bandingkan hasil pada tryout berikutnya.',
          style: DS.body,
        ),
      ),
    ],
  );

  Widget _tryoutReview() {
    final review = _attempt?['review'] is List
        ? (_attempt!['review'] as List)
              .whereType<Map>()
              .map((row) => row.map((k, v) => MapEntry('$k', v)))
              .toList()
        : <Map<String, dynamic>>[];
    final score = _attempt?['score']?.toString() ?? '—';
    final correct = (_attempt?['correct_count'] as num?)?.toInt() ?? 0;
    final total = (_attempt?['total_questions'] as num?)?.toInt() ?? 0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 14,
      children: [
        if (widget.attemptId != null && _attempt == null)
          const LinearProgressIndicator(),
        if (_attempt?['error'] case final String error)
          _surface(
            child: Text('Hasil belum dapat dimuat: $error', style: DS.body),
          ),
        if (_attempt != null && _attempt!['error'] == null) ...[
          _surface(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 10,
              children: [
                _eyebrow('Hasil tryout'),
                Text(_title, style: DS.heading),
                Row(
                  children: [
                    Expanded(child: _metric('Skor', score)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _metric('Jawaban benar', '$correct/$total'),
                    ),
                  ],
                ),
                Text(
                  'Dikirim: ${_attempt!['submitted_at'] ?? '—'}',
                  style: DS.caption,
                ),
              ],
            ),
          ),
          _surface(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 12,
              children: [
                Text('Tinjauan jawaban', style: DS.sectionTitle),
                if (review.isEmpty)
                  const Text(
                    'Rincian jawaban tidak tersedia.',
                    style: DS.caption,
                  ),
                for (final (index, item) in review.indexed)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${index + 1}. ${item['question_text'] ?? ''}',
                        style: DS.cardTitle,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Jawabanmu: ${item['selected_option'] ?? 'Tidak dijawab'}',
                        style: DS.body,
                      ),
                      if (item['answer_key_locked'] == true)
                        const Text(
                          'Kunci jawaban tersedia untuk anggota premium.',
                          style: DS.caption,
                        )
                      else
                        Text(
                          'Kunci: ${item['correct_option'] ?? '—'}  •  ${item['is_correct'] == true ? 'Benar' : 'Perlu dipelajari'}',
                          style: DS.caption,
                        ),
                      const Divider(height: 18),
                    ],
                  ),
              ],
            ),
          ),
        ],
        if (_attempt == null && widget.attemptId == null)
          _surface(
            child: Text(
              'Hasil untuk $_title belum memiliki tautan riwayat dari backend.',
              style: DS.body,
            ),
          ),
      ],
    );
  }
}

class _Tag extends StatelessWidget {
  const _Tag({required this.text});
  final String text;
  @override
  Widget build(BuildContext context) => Chip(
    label: Text(text, style: DS.caption),
    visualDensity: VisualDensity.compact,
    backgroundColor: DS.primarySoft,
    side: BorderSide.none,
  );
}
