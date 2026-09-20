import 'package:flutter/material.dart';

class CourseDetailScreen extends StatefulWidget {
  final String title;
  final String price;
  final String description;

  const CourseDetailScreen({
    super.key, 
    required this.title, 
    required this.price, 
    required this.description,
  });

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  bool isEnrolled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail Katalog', style: TextStyle(color: Colors.white, fontSize: 16)),
        backgroundColor: const Color(0xFF38A3FF),
        iconTheme: const IconThemeData(color: Colors.white),
        centerTitle: true,
      ),
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Menampilkan nama dan harga
            Text(
              widget.title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 8),
            Text(
              widget.price,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.orange),
            ),
            const SizedBox(height: 24),
            
            // Container latar belakang warna pastel & padding untuk deskripsi
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.blue.shade100),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.info_outline, color: Colors.blue),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      widget.description,
                      style: const TextStyle(fontSize: 14, color: Colors.black87, height: 1.5),
                    ),
                  ),
                ],
              ),
            ),
            
            const Spacer(),
            
            // Interaksi perubahan state (Event & State)
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    isEnrolled = !isEnrolled;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: isEnrolled ? Colors.green : const Color(0xFF38A3FF),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  isEnrolled ? 'Berhasil Berlangganan ✓' : 'Berlangganan Sekarang',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}