import type {
  Student,
  Mentor,
  MentorPermissions,
  LearningMaterial,
  QuestionBankItem,
  TryoutPackage,
  ScheduleItem,
  AdminSettings,
  MentorProfile,
  AuditLog,
  ContentStatus,
} from "@/types";

export interface IStudentRepository {
  getAll(): Promise<Student[]>;
  getById(id: string): Promise<Student | null>;
  getByMentorId(mentorId: string): Promise<Student[]>;
  create(data: Omit<Student, "id" | "joinedAt">): Promise<Student>;
  update(id: string, data: Partial<Student>): Promise<Student>;
  delete(id: string): Promise<boolean>;
}

export interface IMentorRepository {
  getAll(): Promise<Mentor[]>;
  getById(id: string): Promise<Mentor | null>;
  create(data: Omit<Mentor, "id" | "joinedAt">): Promise<Mentor>;
  update(id: string, data: Partial<Mentor>): Promise<Mentor>;
  delete(id: string): Promise<boolean>;
  updatePermissions(id: string, permissions: MentorPermissions): Promise<Mentor>;
}

export interface IMaterialRepository {
  getAll(): Promise<LearningMaterial[]>;
  getById(id: string): Promise<LearningMaterial | null>;
  getByAuthorId(authorId: string): Promise<LearningMaterial[]>;
  create(data: Omit<LearningMaterial, "id" | "history" | "createdAt" | "updatedAt">): Promise<LearningMaterial>;
  update(id: string, data: Partial<LearningMaterial>): Promise<LearningMaterial>;
  delete(id: string): Promise<boolean>;
  updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<LearningMaterial>;
}

export interface IQuestionBankRepository {
  getAll(): Promise<QuestionBankItem[]>;
  getById(id: string): Promise<QuestionBankItem | null>;
  getByAuthorId(authorId: string): Promise<QuestionBankItem[]>;
  create(data: Omit<QuestionBankItem, "id" | "history" | "createdAt" | "updatedAt">): Promise<QuestionBankItem>;
  update(id: string, data: Partial<QuestionBankItem>): Promise<QuestionBankItem>;
  delete(id: string): Promise<boolean>;
  updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<QuestionBankItem>;
}

export interface ITryoutRepository {
  getAll(): Promise<TryoutPackage[]>;
  getById(id: string): Promise<TryoutPackage | null>;
  getByAuthorId(authorId: string): Promise<TryoutPackage[]>;
  create(data: Omit<TryoutPackage, "id" | "history" | "createdAt" | "updatedAt">): Promise<TryoutPackage>;
  update(id: string, data: Partial<TryoutPackage>): Promise<TryoutPackage>;
  delete(id: string): Promise<boolean>;
  updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<TryoutPackage>;
  requestWithdrawal(id: string, reason: string): Promise<TryoutPackage>;
}

export interface IScheduleRepository {
  getAll(): Promise<ScheduleItem[]>;
  getById(id: string): Promise<ScheduleItem | null>;
  getByMentorId(mentorId: string): Promise<ScheduleItem[]>;
  create(data: Omit<ScheduleItem, "id" | "createdAt">): Promise<ScheduleItem>;
  update(id: string, data: Partial<ScheduleItem>): Promise<ScheduleItem>;
  delete(id: string): Promise<boolean>;
  checkConflicts(date: string, startTime: string, endTime: string, mentorId: string, excludeId?: string): Promise<ScheduleItem[]>;
}

export interface ISettingsRepository {
  getSettings(): Promise<AdminSettings>;
  updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings>;
  getMentorProfile(mentorId: string): Promise<MentorProfile>;
  updateMentorProfile(mentorId: string, data: Partial<MentorProfile>): Promise<MentorProfile>;
}

export interface IAuditRepository {
  getAll(): Promise<AuditLog[]>;
  log(entry: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog>;
}
