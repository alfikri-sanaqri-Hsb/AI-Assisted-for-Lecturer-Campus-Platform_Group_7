import 'package:flutter/foundation.dart';

import '../../../core/network/api_client.dart';
import '../models/tryout_models.dart';
import '../services/tryout_content_service.dart';

/// State halaman Daftar Tryout: data + filter yang dipilih.
class TryoutProvider extends ChangeNotifier {
  TryoutProvider({List<TryoutItem>? items})
    : _items = items ?? TryoutContentService.items;

  List<TryoutItem> _items;
  bool loading = true;
  String? error;

  MyTryout get myTryout => _items.isEmpty
      ? TryoutContentService.myTryout
      : MyTryout(
          title: _items.first.title,
          subtitle: _items.first.summary,
          registeredCount: 0,
          backendId: _items.first.backendId,
        );

  Future<void> load() async {
    try {
      final raw = await ApiClient.getData('/tryouts');
      if (raw is List) {
        final items = raw
            .whereType<Map>()
            .map((row) {
              final data = row.map((key, value) => MapEntry('$key', value));
              final id = (data['id'] as num?)?.toInt();
              if (id == null) return null;
              final duration = (data['duration_minutes'] as num?)?.toInt() ?? 0;
              return TryoutItem(
                id: 'backend-$id',
                title: data['title']?.toString() ?? 'Tryout',
                trackLabel: 'SNBT/UTBK',
                track: TryoutTrack.snbt,
                isPremium: false,
                startsAt: DateTime.now(),
                backendId: id,
                durationMinutes: duration,
                summary:
                    data['description']?.toString().trim().isNotEmpty == true
                    ? data['description'].toString()
                    : 'Durasi $duration menit',
                statusNote: 'Tersedia',
              );
            })
            .whereType<TryoutItem>()
            .toList();
        if (items.isNotEmpty) _items = items;
      }
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  TryoutTrack _track = TryoutTrack.snbt;
  TryoutTrack get track => _track;

  TryoutAccessFilter _access = TryoutAccessFilter.all;
  TryoutAccessFilter get access => _access;

  List<TryoutItem> get filtered => _items
      .where(
        (t) => t.track == _track && _access.matches(isPremium: t.isPremium),
      )
      .toList();

  void selectTrack(TryoutTrack value) {
    if (value == _track) return;
    _track = value;
    notifyListeners();
  }

  void selectAccess(TryoutAccessFilter value) {
    if (value == _access) return;
    _access = value;
    notifyListeners();
  }
}
