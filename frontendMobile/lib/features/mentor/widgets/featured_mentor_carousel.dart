import 'package:flutter/material.dart';

class FeaturedMentorCarousel extends StatelessWidget {
  const FeaturedMentorCarousel({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> mentors = [
      {
        'name': 'Mister Ryan,\nalumni UNDIP',
        'subject': 'Penalaran Pengetahuan Kuantitatif',
        'image': 'assets/images/foto_ryan.jpeg',
      },
      {
        'name': 'Ir. Alfi\nalumni ITB',
        'subject': 'Penalaran Matematika dan Sains',
        'image': 'assets/images/foto_alfi.jpeg',
      },
      {
        'name': 'Prof. Ojan\nalumni UGM',
        'subject': 'Biologi dan Fisika Peminatan',
        'image': 'assets/images/foto_ojan.jpeg',
      },
    ];

    return SizedBox(
      height: 235,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: mentors.length,
        itemBuilder: (context, index) {
          final mentor = mentors[index];
          return Container(
            width: 155,
            margin: EdgeInsets.only(right: index == mentors.length - 1 ? 0 : 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.grey.shade200,
                  backgroundImage: AssetImage(mentor['image']!),
                ),
                const SizedBox(height: 8),
                Text(
                  mentor['name']!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    5,
                    (index) => const Icon(Icons.star, size: 12, color: Colors.amber),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  mentor['subject']!,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey.shade600,
                  ),
                ),
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  height: 28,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0088FF),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: EdgeInsets.zero,
                    ),
                    child: const Text(
                      'Lihat Profil',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}