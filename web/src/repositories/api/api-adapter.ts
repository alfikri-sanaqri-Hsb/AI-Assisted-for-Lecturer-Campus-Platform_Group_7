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
import { API_BASE_URL } from "@/config/data-source";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const path = endpoint.replace(/^\//, "");
  const res = await fetch(`${baseUrl}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null) as
      | { message?: string; error?: string; code?: string; details?: unknown }
      | null;
    throw new ApiRequestError(
      payload?.message || payload?.error || `API request failed with status ${res.status}.`,
      res.status,
      payload?.code,
      payload?.details,
    );
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export class ApiStudentRepository implements IStudentRepository {
  async getAll(): Promise<Student[]> {
    return fetchApi<Student[]>("/students");
  }

  async getById(id: string): Promise<Student | null> {
    return fetchApi<Student>(`/students/${encodeURIComponent(id)}`);
  }

  async getByMentorId(mentorId: string): Promise<Student[]> {
    return fetchApi<Student[]>(`/mentors/${encodeURIComponent(mentorId)}/students`);
  }

  async create(data: Omit<Student, "id" | "joinedAt">): Promise<Student> {
    return fetchApi<Student>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<Student>): Promise<Student> {
    return fetchApi<Student>(`/students/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/students/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  }
}

export class ApiMentorRepository implements IMentorRepository {
  async getAll(): Promise<Mentor[]> {
    return fetchApi<Mentor[]>("/mentors");
  }

  async getById(id: string): Promise<Mentor | null> {
    return fetchApi<Mentor>(`/mentors/${encodeURIComponent(id)}`);
  }

  async create(data: Omit<Mentor, "id" | "joinedAt">): Promise<Mentor> {
    return fetchApi<Mentor>("/mentors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<Mentor>): Promise<Mentor> {
    return fetchApi<Mentor>(`/mentors/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/mentors/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  }

  async updatePermissions(id: string, permissions: MentorPermissions): Promise<Mentor> {
    return fetchApi<Mentor>(`/mentors/${encodeURIComponent(id)}/permissions`, {
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
    return fetchApi<LearningMaterial>(`/materials/${encodeURIComponent(id)}`);
  }

  async getByAuthorId(authorId: string): Promise<LearningMaterial[]> {
    return fetchApi<LearningMaterial[]>(`/materials?${new URLSearchParams({ authorId }).toString()}`);
  }

  async create(data: Omit<LearningMaterial, "id" | "history" | "createdAt" | "updatedAt">): Promise<LearningMaterial> {
    return fetchApi<LearningMaterial>("/materials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<LearningMaterial>): Promise<LearningMaterial> {
    return fetchApi<LearningMaterial>(`/materials/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/materials/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<LearningMaterial> {
    return fetchApi<LearningMaterial>(`/materials/${encodeURIComponent(id)}/status`, {
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
    return fetchApi<QuestionBankItem>(`/questions/${encodeURIComponent(id)}`);
  }

  async getByAuthorId(authorId: string): Promise<QuestionBankItem[]> {
    return fetchApi<QuestionBankItem[]>(`/questions?${new URLSearchParams({ authorId }).toString()}`);
  }

  async create(data: Omit<QuestionBankItem, "id" | "history" | "createdAt" | "updatedAt">): Promise<QuestionBankItem> {
    return fetchApi<QuestionBankItem>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<QuestionBankItem>): Promise<QuestionBankItem> {
    return fetchApi<QuestionBankItem>(`/questions/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/questions/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<QuestionBankItem> {
    return fetchApi<QuestionBankItem>(`/questions/${encodeURIComponent(id)}/status`, {
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
    return fetchApi<TryoutPackage>(`/tryouts/${encodeURIComponent(id)}`);
  }

  async getByAuthorId(authorId: string): Promise<TryoutPackage[]> {
    return fetchApi<TryoutPackage[]>(`/tryouts?${new URLSearchParams({ authorId }).toString()}`);
  }

  async create(data: Omit<TryoutPackage, "id" | "history" | "createdAt" | "updatedAt">): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>("/tryouts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<TryoutPackage>): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>(`/tryouts/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/tryouts/${encodeURIComponent(id)}`, { method: "DELETE" });
    return true;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>(`/tryouts/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, actor, reason }),
    });
  }

  async requestWithdrawal(id: string, reason: string): Promise<TryoutPackage> {
    return fetchApi<TryoutPackage>(`/tryouts/${encodeURIComponent(id)}/request-withdrawal`, {
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
    return fetchApi<ScheduleItem>(`/schedules/${encodeURIComponent(id)}`);
  }

  async getByMentorId(mentorId: string): Promise<ScheduleItem[]> {
    return fetchApi<ScheduleItem[]>(`/mentors/${encodeURIComponent(mentorId)}/schedules`);
  }

  async create(data: Omit<ScheduleItem, "id" | "createdAt">): Promise<ScheduleItem> {
    return fetchApi<ScheduleItem>("/schedules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    return fetchApi<ScheduleItem>(`/schedules/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await fetchApi(`/schedules/${encodeURIComponent(id)}`, { method: "DELETE" });
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
    return fetchApi<MentorProfile>(`/mentors/${encodeURIComponent(mentorId)}/profile`);
  }

  async updateMentorProfile(mentorId: string, data: Partial<MentorProfile>): Promise<MentorProfile> {
    return fetchApi<MentorProfile>(`/mentors/${encodeURIComponent(mentorId)}/profile`, {
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
