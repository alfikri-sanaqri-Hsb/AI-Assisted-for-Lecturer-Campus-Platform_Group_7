import 'package:flutter/material.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../home/widgets/greeting_header.dart';
import '../widgets/ranking_header_card.dart';

class RankingScreen extends StatefulWidget {
  const RankingScreen({super.key});

  @override
  State<RankingScreen> createState() => _RankingScreenState();
}

class _RankingScreenState extends State<RankingScreen> {
  bool _practice = false;
  bool _loading = true;
  String? _error;
  int? _myRank;
  int _total = 0;
  List<Map<String, dynamic>> _rows = [];

  Map<String, dynamic> _map(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return value.map((key, value) => MapEntry('$key', value));
    return <String, dynamic>{};
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final response = _map(
        await ApiClient.getData(
          '/ranking?mode=${_practice ? 'practice' : 'tryout'}&limit=20',
        ),
      );
      final rawRows = response['top'];
      if (!mounted) return;
      setState(() {
        _myRank = int.tryParse('${response['my_rank']}');
        _total = int.tryParse('${response['total_users']}') ?? 0;
        _rows = rawRows is List ? rawRows.map(_map).toList() : [];
        _loading = false;
      });
    } catch (error) {
      if (mounted)
        setState(() {
          _loading = false;
          _error = error.toString();
        });
    }
  }

  void _changeMode(bool practice) {
    if (_practice == practice) {
      return;
    }
    setState(() => _practice = practice);
    _load();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: DS.background,
    body: CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        SliverAppBar(
          pinned: true,
          stretch: true,
          elevation: 0,
          backgroundColor: DS.accent,
          toolbarHeight: 85,
          expandedHeight: 310,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(30),
              bottomRight: Radius.circular(30),
            ),
          ),
          title: const Padding(
            padding: EdgeInsets.only(top: 4),
            child: GreetingHeader(),
          ),
          centerTitle: false,
          flexibleSpace: FlexibleSpaceBar(
            stretchModes: const [StretchMode.zoomBackground],
            background: ClipRRect(
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
              child: Container(
                decoration: const BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage('assets/images/header_bg.jpeg'),
                    fit: BoxFit.cover,
                    alignment: Alignment.topCenter,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      RankingHeaderCard(
                        isPractice: _practice,
                        rank: _myRank,
                        total: _total,
                        onModeChanged: _changeMode,
                      ),
                      const SizedBox(height: 14),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        if (_loading)
          const SliverFillRemaining(
            hasScrollBody: false,
            child: Center(child: CircularProgressIndicator()),
          )
        else if (_error != null)
          SliverFillRemaining(
            hasScrollBody: false,
            child: _emptyState(
              icon: Icons.cloud_off_outlined,
              title: 'Ranking belum dapat dimuat',
              message: _error!,
              action: 'Coba lagi',
              onTap: _load,
            ),
          )
        else if (_rows.isEmpty)
          SliverFillRemaining(
            hasScrollBody: false,
            child: _emptyState(
              icon: Icons.leaderboard_outlined,
              title: 'Belum ada hasil ${_practice ? 'latihan' : 'tryout'}',
              message:
                  'Peringkat akan muncul setelah peserta menyelesaikan ${_practice ? 'latihan soal' : 'tryout'}. Nilai diurutkan dari rata-rata tertinggi dan menampilkan maksimal 20 peserta.',
              action: _practice ? 'Mulai Latihan' : 'Lihat Tryout',
              onTap: () => _practice
                  ? AppNav.practice(context, topic: 'Penalaran Umum')
                  : AppNav.tryouts(context),
            ),
          )
        else
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    '20 besar • berdasarkan rata-rata nilai',
                    style: DS.sectionTitle,
                  ),
                  const SizedBox(height: 14),
                  if (_rows.length >= 3) _topThree(_rows.take(3).toList()),
                  const SizedBox(height: 12),
                  for (final row in _rows.skip(_rows.length >= 3 ? 3 : 0))
                    _rankTile(row),
                  if (_myRank != null && _myRank! > _rows.length) ...[
                    const SizedBox(height: 14),
                    Text(
                      'Peringkatmu: #$_myRank dari $_total peserta',
                      style: DS.label,
                    ),
                  ],
                ],
              ),
            ),
          ),
      ],
    ),
  );

  Widget _emptyState({
    required IconData icon,
    required String title,
    required String message,
    required String action,
    required VoidCallback onTap,
  }) => Padding(
    padding: const EdgeInsets.all(24),
    child: Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 360),
        child: Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: DS.cardShadow,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 72, color: DS.primary),
              const SizedBox(height: 12),
              Text(title, textAlign: TextAlign.center, style: DS.cardTitle),
              const SizedBox(height: 8),
              Text(message, textAlign: TextAlign.center, style: DS.caption),
              const SizedBox(height: 16),
              FilledButton(onPressed: onTap, child: Text(action)),
            ],
          ),
        ),
      ),
    ),
  );

  Widget _topThree(List<Map<String, dynamic>> rows) {
    final ordered = [rows[1], rows[0], rows[2]];
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        for (var i = 0; i < ordered.length; i++)
          Expanded(child: _podiumTile(ordered[i], i == 1 ? 136 : 112)),
      ],
    );
  }

  Widget _podiumTile(Map<String, dynamic> row, double height) {
    final rank = int.tryParse('${row['rank']}') ?? 0;
    return Container(
      height: height,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.all(9),
      decoration: BoxDecoration(
        color: rank == 1 ? const Color(0xFFE8F4FF) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: DS.borderSoft),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          CircleAvatar(
            radius: 21,
            backgroundColor: DS.primarySoft,
            child: Text(
              _initial(row),
              style: DS.cardTitle.copyWith(color: DS.primary),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '${row['full_name'] ?? 'Peserta'}',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: DS.caption.copyWith(fontWeight: FontWeight.w600),
          ),
          Text('#$rank', style: DS.label.copyWith(color: DS.primary)),
          Text(
            '${_score(row)}%',
            style: DS.cardTitle.copyWith(color: DS.primary),
          ),
        ],
      ),
    );
  }

  Widget _rankTile(Map<String, dynamic> row) {
    final rank = int.tryParse('${row['rank']}') ?? 0;
    return Container(
      margin: const EdgeInsets.only(bottom: 9),
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: DS.borderSoft),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 32,
            child: Text(
              '$rank',
              style: DS.cardTitle.copyWith(color: DS.primary),
            ),
          ),
          CircleAvatar(
            radius: 19,
            backgroundColor: DS.primarySoft,
            child: Text(
              _initial(row),
              style: DS.label.copyWith(color: DS.primary),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${row['full_name'] ?? 'Peserta'}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: DS.cardTitle,
                ),
                if ('${row['major'] ?? ''}'.isNotEmpty)
                  Text(
                    '${row['major']}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: DS.caption,
                  ),
              ],
            ),
          ),
          Text(
            '${_score(row)}%',
            style: DS.cardTitle.copyWith(color: DS.primary),
          ),
        ],
      ),
    );
  }

  String _initial(Map<String, dynamic> row) {
    final name = '${row['full_name'] ?? 'P'}'.trim();
    return name.isEmpty ? 'P' : name.substring(0, 1).toUpperCase();
  }

  String _score(Map<String, dynamic> row) =>
      (num.tryParse('${row['average_score']}') ?? 0).toStringAsFixed(1);
}
