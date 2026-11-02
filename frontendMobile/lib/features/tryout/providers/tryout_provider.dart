import 'package:flutter/foundation.dart';

import '../models/tryout_models.dart';
import '../services/tryout_content_service.dart';

/// State halaman Daftar Tryout: data + filter yang dipilih.
class TryoutProvider extends ChangeNotifier {
  TryoutProvider({List<TryoutItem>? items})
      : _items = items ?? TryoutContentService.items;

  final List<TryoutItem> _items;

  MyTryout get myTryout => TryoutContentService.myTryout;

  TryoutTrack _track = TryoutTrack.snbt;
  TryoutTrack get track => _track;

  TryoutAccessFilter _access = TryoutAccessFilter.all;
  TryoutAccessFilter get access => _access;

  List<TryoutItem> get filtered => _items
      .where((t) =>
          t.track == _track && _access.matches(isPremium: t.isPremium))
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
