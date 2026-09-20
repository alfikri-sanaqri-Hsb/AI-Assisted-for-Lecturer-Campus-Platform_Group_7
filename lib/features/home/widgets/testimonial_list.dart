import 'package:flutter/material.dart';

class TestimonialList extends StatelessWidget {
  const TestimonialList({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildTestimonialItem(
            name: 'Alfikri Sanaqri Hsb',
            university: 'STEI-K ITB',
            message: 'Rekom banget buat adik-adik yang pengen ngejar ptn impian, materinya asik dan mudah dipahami',
            imagePath: 'assets/images/foto_alfi.jpeg',
          ),
          const SizedBox(height: 16),
          
          _buildTestimonialItem(
            name: 'Ryan Fikri Ramadhan',
            university: 'Kedokteran UNDIP',
            message: 'AYO!! yang mau lulus kayak abang, langsung saja berlangganan fitur premiumnya, WORTH IT BANGETTT! Terimakasih untuk mentor-mentor yang baikk hatiiii',
            imagePath: 'assets/images/foto_ryan.jpeg',
          ),
          const SizedBox(height: 16),
          
          _buildTestimonialItem(
            name: 'Fauzan',
            university: 'Kedokteran UGM',
            message: 'Aplikasinya sangat membantu aku lulus ke PTN impianku. Fitur misi hariannya sangat membantu aku untuk mengerjakan soal-soal setiap harinya',
            imagePath: 'assets/images/foto_ojan.jpeg',
          ),
        ],
      ),
    );
  }

  Widget _buildTestimonialItem({
    required String name,
    required String university,
    required String message,
    required String imagePath,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 22,
          backgroundImage: AssetImage(imagePath),
          backgroundColor: Colors.grey[300],
        ),
        const SizedBox(width: 12),
        
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 4),
                    child: Text(' • ', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  ),
                  Expanded(
                    child: Text(
                      university,
                      style: const TextStyle(
                        fontSize: 11,
                        color: Colors.black54,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F0F0),
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(12),
                    bottomLeft: Radius.circular(12),
                    bottomRight: Radius.circular(12),
                  ),
                ),
                child: Text(
                  message,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Colors.black87,
                    height: 1.4,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}