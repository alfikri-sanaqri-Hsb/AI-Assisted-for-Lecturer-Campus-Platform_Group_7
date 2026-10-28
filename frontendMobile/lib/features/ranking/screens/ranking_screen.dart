import 'package:flutter/material.dart';
import '../../home/widgets/greeting_header.dart';
import '../widgets/ranking_header_card.dart';
import '../widgets/ranking_podium.dart';
import '../widgets/ranking_list_item.dart';

class RankingScreen extends StatelessWidget {
  const RankingScreen({super.key});

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
            toolbarHeight: 85,
            expandedHeight: 310,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
            ),
            title: const Padding(
              padding: EdgeInsets.only(top: 4.0),
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
                        RankingHeaderCard(),
                        SizedBox(height: 14),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Podium Tiga Besar dengan Efek Kaca Biru & Medali Besar
                  const RankingPodium(),
                  const SizedBox(height: 24),

                  // 2. Daftar Peringkat 4 ke bawah
                  const RankingListItem(
                    rank: 4,
                    name: 'Putra Owi',
                    score: '1159',
                    imagePath: 'assets/images/foto_ryan.jpeg',
                    emoji: '😡',
                  ),
                  const RankingListItem(
                    rank: 5,
                    name: 'Lil Proro',
                    score: '1068',
                    imagePath: 'assets/images/foto_alfi.jpeg',
                    emoji: '😢',
                  ),
                  const RankingListItem(
                    rank: 6,
                    name: 'Bahlil Petranol',
                    score: '1050',
                    imagePath: 'assets/images/foto_ojan.jpeg',
                    emoji: '😎',
                  ),
                  const RankingListItem(
                    rank: 7,
                    name: 'Hamba Taat',
                    score: '1067',
                    imagePath: 'assets/images/foto_alfi.jpeg',
                    emoji: '😢',
                  ),
                  const RankingListItem(
                    rank: 8,
                    name: 'Ambajan',
                    score: '1004',
                    imagePath: 'assets/images/foto_ojan.jpeg',
                    emoji: '😎',
                  ),
                  const RankingListItem(
                    rank: 9,
                    name: 'Top Global',
                    score: '998',
                    imagePath: 'assets/images/foto_ryan.jpeg',
                    emoji: '😡',
                  ),
                  const RankingListItem(
                    rank: 10,
                    name: 'Yantzy',
                    score: '980',
                    imagePath: 'assets/images/foto_ryan.jpeg',
                    emoji: '😡',
                  ),
                  const RankingListItem(
                    rank: 11,
                    name: 'Rusdi',
                    score: '950',
                    imagePath: 'assets/images/foto_ojan.jpeg',
                    emoji: '😎',
                  ),
                  const RankingListItem(
                    rank: 12,
                    name: 'Loli',
                    score: '600',
                    imagePath: 'assets/images/foto_alfi.jpeg',
                    emoji: '😢',
                  ),
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