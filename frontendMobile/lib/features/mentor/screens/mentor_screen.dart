import 'package:flutter/material.dart';
import '../../home/widgets/greeting_header.dart';
import '../widgets/mentor_header_card.dart';
import '../widgets/featured_mentor_carousel.dart';
import '../widgets/mentor_list_card.dart';
import '../widgets/next_session_card.dart';

class MentorScreen extends StatelessWidget {
  const MentorScreen({super.key});

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
            expandedHeight: 330,
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
                        MentorHeaderCard(),
                        SizedBox(height: 25),
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
                  const FeaturedMentorCarousel(),
                  const SizedBox(height: 28),
                  
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Daftar Lengkap Mentor',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward,
                        size: 18,
                        color: Colors.black87,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  
                  const MentorListCard(
                    name: 'Ir. Alfi',
                    rating: '5 Bintang',
                    specialty: 'Ahli Penalaran Matematika dan Sains',
                    imagePath: 'assets/images/foto_alfi.jpeg',
                  ),
                  const MentorListCard(
                    name: 'Prof. Ojan',
                    rating: '5 Bintang',
                    specialty: 'Biologi dan Fisika Peminatan',
                    imagePath: 'assets/images/foto_ojan.jpeg',
                  ),
                  const MentorListCard(
                    name: 'Mister Ryan',
                    rating: '5 Bintang',
                    specialty: 'Penalaran Pengetahuan Kuantitatif',
                    imagePath: 'assets/images/foto_ryan.jpeg',
                  ),
                  
                  const SizedBox(height: 20),
                  
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Sesi Saya Berikutnya',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward,
                        size: 18,
                        color: Colors.black87,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  
                  const NextSessionCard(),
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