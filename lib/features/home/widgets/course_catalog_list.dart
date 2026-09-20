import 'package:flutter/material.dart';
import '../../detail/screens/course_detail_screen.dart'; 

class CourseCatalogList extends StatelessWidget {
  const CourseCatalogList({super.key});

  final List<Map<String, String>> courses = const [
    {
      'title': 'Paket UTBK SNBT 2026',
      'price': 'Rp 39.500/bulan',
      'desc': 'Akses ribuan video belajar dan latihan soal tes skolastik lengkap dengan pembahasan tutor.'
    },
    {
      'title': 'Paket Mentoring Premium',
      'price': 'Rp 65.000/bulan',
      'desc': 'Kuasai materi dengan sesi live mentoring 2x per minggu dan diskusi strategi lulus PTN impian.'
    },
    {
      'title': 'Paket TryOut Akbar SNBT Vol. 5',
      'price': 'Rp 25.000',
      'desc': 'Uji kemampuanmu secara nasional dengan simulasi sistem UTBK asli dan penilaian IRT.'
    },
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: EdgeInsets.zero, 
      shrinkWrap: true, 
      physics: const NeverScrollableScrollPhysics(),
      itemCount: courses.length,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          elevation: 2,
          color: Colors.white,
          surfaceTintColor: Colors.white, 
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: Colors.grey.shade200, width: 1),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF38A3FF).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.menu_book, color: Color(0xFF38A3FF)),
            ),
            title: Text(
              courses[index]['title']!,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 4.0),
              child: Text(
                courses[index]['price']!,
                style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold),
              ),
            ),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => CourseDetailScreen(
                    title: courses[index]['title']!,
                    price: courses[index]['price']!,
                    description: courses[index]['desc']!,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}