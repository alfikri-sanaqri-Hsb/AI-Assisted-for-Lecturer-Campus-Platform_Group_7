import 'package:flutter/material.dart';

import '../../home/widgets/greeting_header.dart'; 

import '../widgets/progress_header_card.dart';
import '../widgets/tryout_result_list.dart';
import '../widgets/tryout_stats_chart.dart';
import '../widgets/strengths_improvements_card.dart';
import '../widgets/subject_progress_card.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        ProgressHeaderCard(),
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
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Daftar Tryout List
                  const TryoutResultList(),
                  const SizedBox(height: 24),
                  
                  // 2. Judul & Grafik Statistik TryOut
                  const Text(
                    'Statistik TryOut',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const TryoutStatsChart(),
                  
                  const SizedBox(height: 24),
                  
                  // 3. Card Kekuatan & Perlu Ditingkatkan
                  const StrengthsImprovementsCard(),
                  
                  const SizedBox(height: 24),
                  
                  // 4. Daftar Kategori Subtes
                  const SubjectProgressCard(title: 'Pengetahuan Kuantitatif'),
                  const SubjectProgressCard(title: 'Penalaran Matematika'),
                  const SubjectProgressCard(title: 'Penalaran Umum'),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}