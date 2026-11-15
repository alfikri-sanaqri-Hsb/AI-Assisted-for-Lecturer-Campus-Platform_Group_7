export interface AdminSettings {
  platformName: string;
  academicYear: string;
  supportEmail: string;
  allowStudentRegistration: boolean;
  duplicateSimilarityThreshold: number; // e.g. 70 (%)
  maintenanceMode: boolean;
  notifyOnContentSubmission: boolean;
  notifyOnScheduleConflict: boolean;
}

export interface MentorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  subject: string;
  bio: string;
  availabilityNotes: string;
  rating: number;
  totalStudentsAssisted: number;
}
