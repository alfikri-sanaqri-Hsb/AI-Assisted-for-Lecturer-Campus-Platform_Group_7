import 'package:flutter/foundation.dart';
import 'package:drift/drift.dart';
import '../../../core/database/app_database.dart';

class StudyProvider extends ChangeNotifier {
  final AppDatabase _database;

  StudyProvider(this._database) {
    _initStream();
  }

  List<StudyItem> _studyItems = [];
  List<StudyItem> get studyItems => _studyItems;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  // Inisialisasi stream reaktif (.watch()
  void _initStream() {
    _database.watchAllStudyItems().listen((items) {
      _studyItems = items;
      notifyListeners();
    });
  }

  Future<void> refreshStudyCache(List<StudyItemsCompanion> newItems) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Menggunakan atomic transaction yang ada di Drift database
      await _database.updateStudyCache(newItems);
    } catch (e) {
      debugPrint('Error updating study cache: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Memperbarui data awal materi belajar secara langsung
  Future<void> seedInitialData() async {
    final initialData = [
      StudyItemsCompanion.insert(
        title: 'Konsep Kilat Eksponen & Akar',
        category: 'Penalaran Kuantitatif',
        isCompleted: const Value(true),
        lastFetched: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
      StudyItemsCompanion.insert(
        title: 'Strategi Menjawab Soal TPS UTBK',
        category: 'Literasi Bahasa Indonesia',
        isCompleted: const Value(false),
        lastFetched: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
      StudyItemsCompanion.insert(
        title: 'Logika Matematika & Silogisme',
        category: 'Penalaran Umum',
        isCompleted: const Value(false),
        lastFetched: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    ];
    await refreshStudyCache(initialData);
  }
}