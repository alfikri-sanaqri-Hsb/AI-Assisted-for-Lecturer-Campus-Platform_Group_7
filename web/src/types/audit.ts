export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: "ADMIN" | "MENTOR";
  actorName: string;
  action: string;
  targetType: "STUDENT" | "MENTOR" | "MATERIAL" | "QUESTION" | "TRYOUT" | "SCHEDULE" | "SETTINGS";
  targetId: string;
  targetTitle: string;
  details: string;
}
