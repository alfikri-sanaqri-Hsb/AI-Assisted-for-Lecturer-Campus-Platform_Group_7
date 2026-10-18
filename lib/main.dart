import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/database/app_database.dart';
import 'features/study/providers/study_provider.dart';
import 'features/auth/screens/login_screen.dart';

void main() async {
  // Memastikan binding Flutter terinisialisasi sebelum instansiasi database
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inisialisasi database lokal Drift (Offline-First)
  final appDatabase = AppDatabase();

  runApp(
    MultiProvider(
      providers: [
        // Menyediakan instance database secara global
        Provider<AppDatabase>.value(value: appDatabase),
        // Menyediakan StudyProvider yang terhubung reaktif dengan Drift
        ChangeNotifierProvider(
          create: (_) => StudyProvider(appDatabase)..seedInitialData(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sahabat Alfary',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
      ),
      home: const LoginScreen(),
    );
  }
}