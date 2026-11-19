import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/network/api_client.dart';

import '../../../app/app_nav.dart';
import '../../profile/providers/current_user_provider.dart';
import '../widgets/greeting_header.dart';
import '../widgets/main_menu_row.dart';
import '../widgets/continue_learning_card.dart';
import '../widgets/daily_mission_card.dart';
import '../widgets/live_schedule_list.dart';
import '../widgets/testimonial_list.dart';
import '../widgets/promo_banner.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, dynamic> _data = {};
  bool _loading = true;
  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await ApiClient.getData('/home');
      if (mounted && data is Map)
        setState(() => _data = Map<String, dynamic>.from(data));
    } catch (_) {
      // Local design content remains visible when the API is unavailable.
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final account = context.watch<CurrentUserProvider>();
    final schedules = _data['schedules'] is List
        ? (_data['schedules'] as List)
              .whereType<Map>()
              .map((m) => Map<String, dynamic>.from(m))
              .toList()
        : const <Map<String, dynamic>>[];
    final testimonials = _data['testimonials'] is List
        ? (_data['testimonials'] as List)
              .whereType<Map>()
              .map((m) => Map<String, dynamic>.from(m))
              .toList()
        : const <Map<String, dynamic>>[];
    return Scaffold(
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
            expandedHeight: 380,

            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
            ),

            title: const Padding(
              padding: EdgeInsets.only(top: 8.0),
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
                    padding: EdgeInsets.symmetric(horizontal: 20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        PromoBanner(onTap: () => AppNav.membership(context)),
                        SizedBox(height: 20),
                        MainMenuRow(),
                        SizedBox(height: 30),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 24.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Lanjutkan Belajar ➔'),
                  const SizedBox(height: 12),
                  ContinueLearningCard(
                    title:
                        _map(_data['continue_learning'])?['last_material_title']
                            as String? ??
                        'Mulai belajar',
                    subject:
                        _map(_data['continue_learning'])?['subject']
                            as String? ??
                        'Materi pilihanmu',
                    progress:
                        ((_map(_data['continue_learning'])?['progress_percent']
                                as num?) ??
                            0) /
                        100,
                    onTap: () => AppNav.materials(context),
                  ),

                  const SizedBox(height: 24),

                  _buildSectionTitle('Misi Harian ${account.displayName} ➔'),
                  const SizedBox(height: 12),
                  DailyMissionCard(
                    onTap: () =>
                        AppNav.practice(context, topic: 'Penalaran Umum'),
                    missions: _data['daily_missions'] is List
                        ? List<Map<String, dynamic>>.from(
                            (_data['daily_missions'] as List)
                                .whereType<Map>()
                                .map((m) => Map<String, dynamic>.from(m)),
                          )
                        : const [],
                  ),

                  const SizedBox(height: 24),

                  _buildSectionTitle('Jadwal Live Terdekat ➔'),
                  const SizedBox(height: 12),
                  LiveScheduleList(
                    schedules: schedules,
                    onMentoringTap: () => AppNav.mentor(context),
                    onTryoutTap: () => AppNav.tryouts(context),
                  ),

                  const SizedBox(height: 24),

                  _buildSectionTitle('Apa Kata Mereka?'),
                  const SizedBox(height: 12),
                  if (_loading) const LinearProgressIndicator(),
                  TestimonialList(items: testimonials),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
    );
  }

  Map<String, dynamic>? _map(dynamic value) =>
      value is Map ? Map<String, dynamic>.from(value) : null;
}
