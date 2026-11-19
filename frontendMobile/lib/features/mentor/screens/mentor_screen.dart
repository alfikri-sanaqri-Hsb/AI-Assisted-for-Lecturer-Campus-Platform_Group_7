import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../app/app_nav.dart';
import '../../../core/network/api_client.dart';
import '../../home/widgets/greeting_header.dart';

class MentorScreen extends StatefulWidget {
  const MentorScreen({super.key});
  @override
  State<MentorScreen> createState() => _MentorScreenState();
}

class _MentorScreenState extends State<MentorScreen> {
  List<Map<String, dynamic>> _mentors = [];
  Map<String, dynamic>? _nextSession;
  bool _loading = true;
  String? _error;

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
      final results = await Future.wait([
        ApiClient.getData('/mentors'),
        ApiClient.getData('/mentors/sessions/next'),
      ]);
      final list = results.first is List
          ? (results.first as List).whereType<Map>().map(_map).toList()
          : <Map<String, dynamic>>[];
      if (mounted)
        setState(() {
          _mentors = list;
          _nextSession = results.last == null ? null : _map(results.last);
        });
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF8F9FA),
    body: CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        SliverAppBar(
          pinned: true,
          stretch: true,
          elevation: 0,
          backgroundColor: const Color(0xFF48B5FF),
          toolbarHeight: 95,
          expandedHeight: 330,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(30),
              bottomRight: Radius.circular(30),
            ),
          ),
          title: const Padding(
            padding: EdgeInsets.only(top: 8),
            child: GreetingHeader(),
          ),
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
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [_MentorHero(), SizedBox(height: 25)],
                  ),
                ),
              ),
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: Text(
                        'Mentor pilihan',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    if (_loading)
                      const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                  ],
                ),
                const SizedBox(height: 12),
                if (_error != null)
                  Text('Data mentor belum dapat dimuat: $_error'),
                if (!_loading && _mentors.isEmpty && _error == null)
                  const Text('Belum ada profil mentor aktif.'),
                if (_mentors.isNotEmpty)
                  SizedBox(
                    height: 220,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _mentors.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        final mentor = _mentors[index];
                        final id = (mentor['id'] as num?)?.toInt();
                        final subjects = mentor['subjects'] is List
                            ? (mentor['subjects'] as List).join(', ')
                            : '';
                        return SizedBox(
                          width: 165,
                          child: Card(
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Column(
                                children: [
                                  CircleAvatar(
                                    radius: 30,
                                    backgroundImage:
                                        mentor['photo_url'] is String &&
                                            '${mentor['photo_url']}'.startsWith(
                                              'http',
                                            )
                                        ? NetworkImage('${mentor['photo_url']}')
                                        : null,
                                    child: mentor['photo_url'] == null
                                        ? const Icon(Icons.person, size: 30)
                                        : null,
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    '${mentor['name'] ?? 'Mentor'}',
                                    textAlign: TextAlign.center,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    '${mentor['university'] ?? ''}',
                                    textAlign: TextAlign.center,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 11),
                                  ),
                                  const SizedBox(height: 6),
                                  Expanded(
                                    child: Text(
                                      subjects,
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis,
                                      textAlign: TextAlign.center,
                                      style: const TextStyle(fontSize: 11),
                                    ),
                                  ),
                                  SizedBox(
                                    width: double.infinity,
                                    child: OutlinedButton(
                                      onPressed: id == null
                                          ? null
                                          : () => AppNav.mentorProfile(
                                              context,
                                              name:
                                                  '${mentor['name'] ?? 'Mentor'}',
                                              specialty: subjects,
                                              backendMentorId: id,
                                            ),
                                      child: const Text('Lihat profil'),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                const SizedBox(height: 24),
                const Text(
                  'Sesi terdekat',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                if (_nextSession == null && !_loading)
                  const Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Text('Belum ada jadwal sesi mendatang.'),
                    ),
                  ),
                if (_nextSession != null) _sessionCard(_nextSession!),
              ],
            ),
          ),
        ),
      ],
    ),
  );

  Widget _sessionCard(Map<String, dynamic> session) {
    final meeting = session['meeting_url']?.toString();
    final group = session['group_url']?.toString();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              session['title']?.toString() ?? 'Sesi mentoring',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            const SizedBox(height: 4),
            Text(
              '${session['label'] ?? ''} • ${session['mentor_name'] ?? 'Mentor'}',
              style: const TextStyle(color: Colors.black54),
            ),
            if (meeting != null && meeting.isNotEmpty)
              TextButton.icon(
                onPressed: () => _copy(meeting),
                icon: const Icon(Icons.link),
                label: const Text('Salin tautan sesi'),
              ),
            if (group != null && group.isNotEmpty)
              TextButton.icon(
                onPressed: () => _copy(group),
                icon: const Icon(Icons.forum_outlined),
                label: const Text('Salin tautan grup mentor'),
              ),
          ],
        ),
      ),
    );
  }

  void _copy(String value) {
    Clipboard.setData(ClipboardData(text: value));
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Tautan disalin.')));
  }
}

class _MentorHero extends StatelessWidget {
  const _MentorHero();
  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: .92),
      borderRadius: BorderRadius.circular(18),
    ),
    child: const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Belajar bersama mentor',
          style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 6),
        Text(
          'Temukan pendamping sesuai topik dan ikuti sesi belajar terjadwal.',
        ),
      ],
    ),
  );
}
