import 'dart:ui';
import 'package:flutter/material.dart';

class RankingPodium extends StatelessWidget {
  const RankingPodium({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF007ACC).withOpacity(0.08),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: Colors.white.withOpacity(0.6),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              // Badge Nasional
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF48B5FF),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.bar_chart, color: Colors.white, size: 14),
                        SizedBox(width: 4),
                        Text(
                          'Nasional',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Ilustrasi Podium Tiga Besar
              SizedBox(
                height: 230,
                child: Stack(
                  alignment: Alignment.bottomCenter,
                  children: [
                    // Peringkat 2 
                    Positioned(
                      left: 10,
                      bottom: 0,
                      child: Column(
                        children: [
                          Stack(
                            children: [
                              const CircleAvatar(
                                radius: 22,
                                backgroundImage: AssetImage('assets/images/foto_ryan.jpeg'),
                              ),
                              Positioned(
                                right: 0,
                                bottom: 0,
                                child: Container(
                                  padding: const EdgeInsets.all(2),
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Text('😡', style: TextStyle(fontSize: 10)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Container(
                            width: 95,
                            height: 125,
                            decoration: const BoxDecoration(
                              color: Color(0xFFE8F1F8),
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                            ),
                            child: const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('Singh', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color.fromARGB(255, 0, 0, 0))),
                                SizedBox(height: 4),
                                Text('🥈', style: TextStyle(fontSize: 22)),
                                SizedBox(height: 4),
                                Text('1217', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF007ACC))),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Peringkat 3 
                    Positioned(
                      right: 10,
                      bottom: 0,
                      child: Column(
                        children: [
                          Stack(
                            children: [
                              const CircleAvatar(
                                radius: 22,
                                backgroundImage: AssetImage('assets/images/foto_alfi.jpeg'),
                              ),
                              Positioned(
                                right: 0,
                                bottom: 0,
                                child: Container(
                                  padding: const EdgeInsets.all(2),
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Text('😢', style: TextStyle(fontSize: 10)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Container(
                            width: 95,
                            height: 105,
                            decoration: const BoxDecoration(
                              color: Color(0xFFE8F1F8),
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                            ),
                            child: const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('Apiki', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color.fromARGB(255, 0, 0, 0))),
                                SizedBox(height: 4),
                                Text('🥉', style: TextStyle(fontSize: 22)),
                                SizedBox(height: 4),
                                Text('1198', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF007ACC))),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Peringkat 1 
                    Positioned(
                      bottom: 0,
                      child: Column(
                        children: [
                          const Text('👑', style: TextStyle(fontSize: 24)),
                          const SizedBox(height: 2),
                          Stack(
                            children: [
                              const CircleAvatar(
                                radius: 26,
                                backgroundImage: AssetImage('assets/images/foto_ojan.jpeg'),
                              ),
                              Positioned(
                                right: 0,
                                bottom: 0,
                                child: Container(
                                  padding: const EdgeInsets.all(2),
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Text('😎', style: TextStyle(fontSize: 10)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Container(
                            width: 105,
                            height: 150,
                            decoration: const BoxDecoration(
                              color: Color(0xFFE5C158),
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(16),
                                topRight: Radius.circular(16),
                              ),
                            ),
                            child: const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('Ojan', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color.fromARGB(255, 0, 0, 0))),
                                SizedBox(height: 4),
                                Text('🥇', style: TextStyle(fontSize: 26)),
                                SizedBox(height: 4),
                                Text('1308', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF007ACC))),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}