import 'package:flutter/material.dart';

import '../core/network/api_client.dart';
import '../features/exam/screens/exam_screen.dart';
import '../features/exam/services/exam_content_service.dart';
import '../features/learning/models/learning_models.dart';
import '../features/learning/screens/materi_screen.dart';
import '../features/learning/screens/materi_search_screen.dart';
import '../features/learning/screens/subject_curriculum_screen.dart';
import '../features/membership/screens/membership_screen.dart';
import '../features/tryout/screens/tryout_screen.dart';
import '../features/extras/screens/feature_pages_screen.dart';
import '../features/extras/screens/prediction_history_screen.dart';
import '../features/mentor/screens/mentor_screen.dart';

/// Navigasi terpusat untuk tombol-tombol di seluruh aplikasi.
/// Semua tombol memanggil fungsi di sini, jadi tujuan cukup diubah sekali.
/// (Nanti bisa dipindahkan ke app_router tanpa mengubah pemanggil.)
abstract final class AppNav {
  static void _push(BuildContext context, Widget page) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
  }

  /// Halaman Materi (Materi Hari Ini + Bab Selanjutnya).
  static void materials(BuildContext context) =>
      _push(context, const MateriScreen());

  static void subjectCurriculum(
    BuildContext context, {
    required String subject,
  }) => _push(context, SubjectCurriculumScreen(subject: subject));

  /// Cari Materi, opsional dengan kata kunci dan jenis awal (mis. latihan).
  static void searchMaterials(
    BuildContext context, {
    String query = '',
    LearningType? type,
  }) => _push(
    context,
    MateriSearchScreen(initialQuery: query, initialType: type),
  );

  /// Daftar Tryout.
  static void tryouts(BuildContext context) =>
      _push(context, const TryoutScreen());

  static void mentor(BuildContext context) =>
      _push(context, const MentorScreen());

  /// Mengerjakan tryout (semua subtes).
  static Future<void> startTryout(
    BuildContext context, {
    required String title,
    int? backendTryoutId,
    int? durationMinutes,
  }) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Mulai tryout sekarang?'),
        content: Text(
          'Timer akan langsung berjalan saat $title dimulai. Pastikan kamu sudah siap dan punya waktu untuk menyelesaikannya.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text('Belum, kembali'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text('Ya, mulai tryout'),
          ),
        ],
      ),
    );
    if (confirmed == true && context.mounted) {
      try {
        if (backendTryoutId == null) {
          _push(
            context,
            ExamScreen(session: ExamContentService.tryoutSession(title: title)),
          );
          return;
        }
        final questions = _mapList(
          await ApiClient.getData('/tryouts/$backendTryoutId/questions'),
        );
        if (questions.isEmpty) {
          throw const ApiException('Soal untuk tryout ini belum tersedia.');
        }
        if (!context.mounted) return;
        _push(
          context,
          ExamScreen(
            session: ExamContentService.tryoutFromBackend(
              title: title,
              tryoutId: backendTryoutId,
              durationMinutes: durationMinutes ?? 90,
              rows: questions,
            ),
          ),
        );
      } catch (error) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Tryout belum dapat dimulai: $error')),
          );
        }
      }
    }
  }

  /// Latihan soal per topik.
  static Future<void> practice(
    BuildContext context, {
    required String topic,
  }) async {
    try {
      final encoded = Uri.encodeQueryComponent(topic);
      var questions = _mapList(
        await ApiClient.getData(
          '/practice/questions?subject=$encoded&limit=10',
        ),
      );
      if (questions.isEmpty) {
        questions = _mapList(
          await ApiClient.getData('/practice/questions?limit=10'),
        );
      }
      if (questions.isEmpty) {
        throw const ApiException('Soal latihan belum tersedia di server.');
      }
      if (!context.mounted) return;
      _push(
        context,
        ExamScreen(
          session: ExamContentService.practiceFromBackend(
            topic: topic,
            rows: questions,
          ),
        ),
      );
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Latihan belum dapat dimulai: $error')),
        );
      }
    }
  }

  static List<Map<String, dynamic>> _mapList(dynamic value) => value is List
      ? value
            .whereType<Map>()
            .map((row) => row.map((key, item) => MapEntry('$key', item)))
            .toList()
      : <Map<String, dynamic>>[];

  /// Langganan Membership.
  static void membership(BuildContext context) =>
      _push(context, const MembershipScreen());

  static void prediction(BuildContext context) =>
      _push(context, const PredictionHistoryScreen());

  static void videos(
    BuildContext context, {
    String? title,
    int? backendVideoId,
    String? videoUrl,
  }) => _push(
    context,
    FeaturePagesScreen(
      kind: FeaturePageKind.videos,
      itemTitle: title,
      backendVideoId: backendVideoId,
      videoUrl: videoUrl,
    ),
  );

  static void module(
    BuildContext context, {
    required String title,
    String? description,
  }) => _push(
    context,
    FeaturePagesScreen(
      kind: FeaturePageKind.module,
      itemTitle: title,
      description: description,
    ),
  );

  static void flashcards(BuildContext context) => _push(
    context,
    const FeaturePagesScreen(kind: FeaturePageKind.flashcards),
  );

  static void liveClasses(BuildContext context) => _push(
    context,
    const FeaturePagesScreen(kind: FeaturePageKind.liveClasses),
  );

  static void mentorProfile(
    BuildContext context, {
    required String name,
    required String specialty,
    String? imagePath,
    int? backendMentorId,
  }) => _push(
    context,
    FeaturePagesScreen(
      kind: FeaturePageKind.mentorProfile,
      itemTitle: name,
      description: specialty,
      imagePath: imagePath,
      backendMentorId: backendMentorId,
    ),
  );

  static void studyNotes(BuildContext context) => _push(
    context,
    const FeaturePagesScreen(kind: FeaturePageKind.studyNotes),
  );

  static void progressStats(BuildContext context) => _push(
    context,
    const FeaturePagesScreen(kind: FeaturePageKind.progressStats),
  );

  static void tryoutReview(
    BuildContext context, {
    required String title,
    int? attemptId,
  }) => _push(
    context,
    FeaturePagesScreen(
      kind: FeaturePageKind.tryoutReview,
      itemTitle: title,
      attemptId: attemptId,
    ),
  );

  /// Untuk tombol yang halamannya belum dibuat.
  static void comingSoon(BuildContext context, String feature) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('$feature segera hadir')));
  }
}
