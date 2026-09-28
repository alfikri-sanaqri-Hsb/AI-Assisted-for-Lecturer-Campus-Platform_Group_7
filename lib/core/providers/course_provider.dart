import 'package:flutter/material.dart';

class CourseProvider with ChangeNotifier {
  final List<String> _enrolledCourses = [];

  List<String> get enrolledCourses => _enrolledCourses;

  bool checkIsEnrolled(String courseTitle) {
    return _enrolledCourses.contains(courseTitle);
  }

  void toggleEnrollment(String courseTitle) {
    if (_enrolledCourses.contains(courseTitle)) {
      _enrolledCourses.remove(courseTitle);
    } else {
      _enrolledCourses.add(courseTitle);
    }
    notifyListeners(); 
  }
}