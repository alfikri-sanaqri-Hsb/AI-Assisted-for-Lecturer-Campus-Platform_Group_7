import 'package:flutter/material.dart';

import '../widgets/greeting_header.dart';
import '../widgets/main_menu_row.dart';
import '../widgets/continue_learning_card.dart';
import '../widgets/daily_mission_card.dart';
import '../widgets/live_schedule_list.dart';
import '../widgets/testimonial_list.dart';
import '../widgets/promo_banner.dart';
import '../widgets/course_catalog_list.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

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
              // Memberikan efek zoom pada gambar background biru saat membal
              stretchModes: const [
                StretchMode.zoomBackground,
              ],
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
                      alignment: Alignment(0.0, -1.3), 
                    ),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        PromoBanner(), 
                        SizedBox(height: 20), 
                        
                        MainMenuRow(), 
                        SizedBox(height: 40), 
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
                  _buildSectionTitle('Lanjutkan Belajar ➔'),
                  const SizedBox(height: 12),
                  const ContinueLearningCard(), 

                  const SizedBox(height: 24),

                  _buildSectionTitle('Misi Harian Fauzan ➔'),
                  const SizedBox(height: 12),
                  const DailyMissionCard(), 

                  const SizedBox(height: 24),

                  _buildSectionTitle('Pembelian Program Belajar ➔'),
                  const SizedBox(height: 12),
                  const CourseCatalogList(), 
                  
                  const SizedBox(height: 24),

                  _buildSectionTitle('Jadwal Live Terdekat ➔'),
                  const SizedBox(height: 12),
                  const LiveScheduleList(), 
                  
                  const SizedBox(height: 24),

                  _buildSectionTitle('Apa Kata Mereka?'),
                  const SizedBox(height: 12),
                  const TestimonialList(), 
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
}