/**
 * BACKEND API ADAPTER SKELETON
 *
 * Adapter ini disiapkan untuk menghubungkan Web Dashboard dengan Backend REST API
 * ketika backend sudah siap diintegrasikan.
 *
 * Status saat ini: SKELETON / MENUNGGU INTEGRASI BACKEND.
 * Backend root repository saat ini belum diekspos untuk semua endpoint dashboard.
 * Frontend secara default menggunakan Mock Repository agar seluruh fitur dapat diuji.
 */

import type {
  IStudentRepository,
  IMentorRepository,
  IMaterialRepository,
  IQuestionBankRepository,
  ITryoutRepository,
  IScheduleRepository,
  ISettingsRepository,
  IAuditRepository,
} from "../interfaces";
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error [${res.status}]: ${res.statusText}`);
  }

  return res.json();
}

export class ApiStudentRepository implements IStudentRepository {
  async getAll(): Promise<Student[]> {
    return fetchApi<Student[]>("/students");
  }

  async getById(id: string): Promise<Student | null> {
    return fetchApi<Student>(`/students/${id}`);
  }

  async getByMentorId(mentorId: string): Promise<Student[]> {
    return fetchApi<Student[]>(`/mentors/${mentorId}/students`);
  }

  async create(data: Omit<Student, "id" | "joinedAt">): Promise<Student> {
    return fetchApi<Student>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<Student>): Promise<Student> {
    return fetchApi<Student>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/students/${id}`, { method: "DELETE" });
    return true;
  }
}

export class ApiMentorRepository implements IMentorRepository {
  async getAll(): Promise<Mentor[]> {
    return fetchApi<Mentor[]>("/mentors");
  }

  async getById(id: string): Promise<Mentor | null> {
    return fetchApi<Mentor>(`/mentors/${id}`);
  }

  async create(data: Omit<Mentor, "id" | "joinedAt">): Promise<Mentor> {
    return fetchApi<Mentor>("/mentors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<Mentor>): Promise<Mentor> {
    return fetchApi<Mentor>(`/mentors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/mentors/${id}`, { method: "DELETE" });
    return true;
  }

  async updatePermissions(id: string, permissions: MentorPermissions): Promise<Mentor> {
    return fetchApi<Mentor>(`/mentors/${id}/permissions`, {
      method: "PATCH",
      body: JSON.stringify(permissions),
    });
  }
}

export class ApiMaterialRepository implements IMaterialRepository {
  async getAll(): Promise<LearningMaterial[]> {
    return fetchApi<LearningMaterial[]>("/materials");
  }

  async getById(id: string): Promise<LearningMaterial | null> {
    return fetchApi<LearningMaterial>(`/materials/${id}`);
  }

  async getByAuthorId(authorId: string): Promise<LearningMaterial[]> {
    return fetchApi<LearningMaterial[]>(`/materials?authorId=${authorId}`);
  }

  async create(data: Omit<LearningMaterial, "id" | "history" | "createdAt" | "updatedAt">): Promise<LearningMaterial> {
    return fetchApi<LearningMaterial>("/materials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<LearningMaterial>): Promise<LearningMaterial> {
    return fetchApi<LearningMaterial>(`/materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/materials/${id}`, { method: "DELETE" });
    return true;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<LearningMaterial> {
    return fetchApi<LearningMaterial>(`/materials/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, actor, reason }),
    });
  }
}

export class ApiQuestionBankRepository implements IQuestionBankRepository {
  async getAll(): Promise<QuestionBankItem[]> {
    return fetchApi<QuestionBankItem[]>("/questions");
  }

  async getById(id: string): Promise<QuestionBankItem | null> {
    return fetchApi<QuestionBankItem>(`/questions/${id}`);
  }

  async getByAuthorId(authorId: string): Promise<QuestionBankItem[]> {
    return fetchApi<QuestionBankItem[]>(`/questions?authorId=${authorId}`);
  }

  async create(data: Omit<QuestionBankItem, "id" | "history" | "createdAt" | "updatedAt">): Promise<QuestionBankItem> {
    return fetchApi<QuestionBankItem>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<QuestionBankItem>): Promise<QuestionBankItem> {
    return fetchApi<QuestionBankItem>(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/questions/${id}`, { method: "DELETE" });
    return true;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<QuestionBankItem> {
    return fetchApi<QuestionBankItem>(`/questions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, actor, reason }),
    });
  }
}

export class ApiTryoutRepository implements ITryoutRepository {
  async getAll(): Promise<TryoutPackage[]> {
    return fetchApi<TryoutPackage[]>("/tryouts");
  }

  async getById(id: string): Promise<TryoutPackage | null> {
    return fetchApi<TryoutPackage>(`/tryouts/${id}`);
  }

  async getByAuthorId(authorId: string): Promise<TryoutPackage[]> {
    return fetchApi<TryoutPackage[]>(`/tryouts?authorId=${authorId}`);
  }

  async create(data: Omit<TryoutPackage, "id" | "history" | "createdAt" | "updatedAt">): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>("/tryouts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<TryoutPackage>): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>(`/tryouts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/tryouts/${id}`, { method: "DELETE" });
    return true;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>(`/tryouts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, actor, reason }),
    });
  }

  async requestWithdrawal(id: string, reason: string): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>(`/tryouts/${id}/request-withdrawal`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }
}

export class ApiScheduleRepository implements IScheduleRepository {
  async getAll(): Promise<ScheduleItem[]> {
    return fetchApi<ScheduleItem[]>("/schedules");
  }

  async getById(id: string): Promise<ScheduleItem | null> {
    return fetchApi<ScheduleItem>(`/schedules/${id}`);
  }

  async getByMentorId(mentorId: string): Promise<ScheduleItem[]> {
    return fetchApi<ScheduleItem[]>(`/mentors/${mentorId}/schedules`);
  }

  async create(data: Omit<ScheduleItem, "id" | "createdAt">): Promise<ScheduleItem> {
    return fetchApi<ScheduleItem>("/schedules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    return fetchApi<ScheduleItem>(`/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/schedules/${id}`, { method: "DELETE" });
    return true;
  }

  async checkConflicts(
    date: string,
    startTime: string,
    endTime: string,
    mentorId: string,
    excludeId?: string
  ): Promise<ScheduleItem[]> {
    const params = new URLSearchParams({ date, startTime, endTime, mentorId });
    if (excludeId) params.append("excludeId", excludeId);
    return fetchApi<ScheduleItem[]>(`/schedules/check-conflicts?${params.toString()}`);
  }
}

export class ApiSettingsRepository implements ISettingsRepository {
  async getSettings(): Promise<AdminSettings> {
    return fetchApi<AdminSettings>("/settings");
  }

  async updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
    return fetchApi<AdminSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getMentorProfile(mentorId: string): Promise<MentorProfile> {
    return fetchApi<MentorProfile>(`/mentors/${mentorId}/profile`);
  }

  async updateMentorProfile(mentorId: string, data: Partial<MentorProfile>): Promise<MentorProfile> {
    return fetchApi<MentorProfile>(`/mentors/${mentorId}/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export class ApiAuditRepository implements IAuditRepository {
  async getAll(): Promise<AuditLog[]> {
    return fetchApi<AuditLog[]>("/audit-logs");
  }

  async log(entry: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    return fetchApi<AuditLog>("/audit-logs", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  }
}
