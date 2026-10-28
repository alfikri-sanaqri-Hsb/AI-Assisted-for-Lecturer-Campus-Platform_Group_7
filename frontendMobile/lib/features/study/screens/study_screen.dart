import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/constants/design_tokens.dart';
import '../providers/study_provider.dart';
import '../services/study_content_service.dart';
import '../../tryout/screens/tryout_screen.dart';
import '../widgets/continue_learning_section.dart';
import '../widgets/daily_missions_section.dart';
import '../widgets/quick_access_section.dart';
import '../widgets/study_header.dart'; // header versi A (tetap)
import '../widgets/study_tips_section.dart';
import '../widgets/topic_recommendations_section.dart';
import '../widgets/upcoming_schedule_section.dart';

class StudyScreen extends StatelessWidget {
  const StudyScreen({super.key});

  /// Tinggi area header berlatar header_bg.jpeg. Sesuaikan jika perlu.
  static const double _headerHeight = 160;

  /// Ruang kosong di bawah agar konten tidak tertutup bottom nav versi A.
  static const double _bottomNavSpace = 80;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudyProvider>();

    // Rekomendasi topik membaca data Drift (Tugas #9).
    // Jika database masih kosong, pakai data cadangan.
    final topics = provider.studyItems.isEmpty
        ? StudyContentService.topics
        : StudyContentService.topicsFromDb(provider.studyItems);

    return Scaffold(
      backgroundColor: DS.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            pinned: true,
            stretch: true,
            elevation: 0,
            backgroundColor: const Color(0xFF48B5FF),
            toolbarHeight: 95,
            expandedHeight: _headerHeight,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
            ),
            title: const Padding(
              padding: EdgeInsets.only(top: 8.0),
              child: StudyHeader(),
            ),
            centerTitle: false,
            flexibleSpace: const FlexibleSpaceBar(
              stretchModes: [StretchMode.zoomBackground],
              background: ClipRRect(
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage('assets/images/header_bg.jpeg'),
                      fit: BoxFit.cover,
                      alignment: Alignment.topCenter,
                    ),
                  ),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                DS.screenPadding,
                20,
                DS.screenPadding,
                24 + _bottomNavSpace,
              ),
              child: Column(
                spacing: 16,
                children: [
                  const ContinueLearningSection(
                    data: StudyContentService.continueLearning,
                    // TODO: onContinue / onDetail -> navigasi ke materi
                  ),
                  const DailyMissionsSection(
                    missions: StudyContentService.missions,
                    footnote: StudyContentService.missionsFootnote,
                  ),
                  TopicRecommendationsSection(topics: topics),
                  const UpcomingScheduleSection(
                    items: StudyContentService.schedule,
                  ),
                  const StudyTipsSection(tip: StudyContentService.tip),
                  QuickAccessSection(
                    items: StudyContentService.quickAccess,
                    onItemTap: (item) {
                      if (item.label == 'TryOut Online') {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => const TryoutScreen(),
                          ),
                        );
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
