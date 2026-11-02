import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'app_database.g.dart';

// Definisi Tabel Study Materi Cache Offline
class StudyItems extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  TextColumn get category => text()();
  BoolColumn get isCompleted => boolean().withDefault(const Constant(false))();
  
  IntColumn get lastFetched => integer()(); 
}

@DriftDatabase(tables: [StudyItems])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // 1. Stream reaktif untuk UI (.watch())
  Stream<List<StudyItem>> watchAllStudyItems() => select(studyItems).watch();

  // 2. Mengambil semua data secara normal
  Future<List<StudyItem>> getAllStudyItems() => select(studyItems).get();

  Future<void> updateStudyCache(List<StudyItemsCompanion> newItems) async {
    await transaction(() async {
      await delete(studyItems).go();
      await batch((batch) {
        batch.insertAll(studyItems, newItems);
      });
    });
  }

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'sahabat_alfary_db');
  }
}