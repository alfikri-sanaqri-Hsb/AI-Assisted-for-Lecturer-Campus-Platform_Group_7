import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/providers/course_provider.dart'; 
import 'app/app.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CourseProvider()),
      ],
      child: const SahabatBelajarApp(),
    ),
  );
}