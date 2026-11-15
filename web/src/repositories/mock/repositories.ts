import { simulatedDb } from "./storage";
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
  ContentAuditTrail,
} from "@/types";

export class MockStudentRepository implements IStudentRepository {
  async getAll(): Promise<Student[]> {
    return simulatedDb.getState().students;
  }

  async getById(id: string): Promise<Student | null> {
    return simulatedDb.getState().students.find((s) => s.id === id) || null;
  }

  async getByMentorId(mentorId: string): Promise<Student[]> {
    return simulatedDb.getState().students.filter((s) => s.assignedMentorId === mentorId);
  }

  async create(data: Omit<Student, "id" | "joinedAt">): Promise<Student> {
    const newStudent: Student = {
      ...data,
      id: `std-${Date.now().toString().slice(-4)}`,
      joinedAt: new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
    };
    simulatedDb.updateState((state) => {
      state.students.unshift(newStudent);
      state.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString("id-ID"),
        actorRole: "ADMIN",
        actorName: "Administrator Alfary",
        action: "Tambah Siswa Baru",
        targetType: "STUDENT",
        targetId: newStudent.id,
        targetTitle: newStudent.name,
        details: `Siswa terdaftar di ${newStudent.school} dengan target ${newStudent.targetMajor}.`,
      });
    });
    return newStudent;
  }

  async update(id: string, data: Partial<Student>): Promise<Student> {
    let updated: Student | null = null;
    simulatedDb.updateState((state) => {
      const idx = state.students.findIndex((s) => s.id === id);
      if (idx !== -1) {
        state.students[idx] = { ...state.students[idx], ...data };
        updated = state.students[idx];
      }
    });
    if (!updated) throw new Error(`Siswa dengan ID ${id} tidak ditemukan.`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    let success = false;
    simulatedDb.updateState((state) => {
      const prevLength = state.students.length;
      state.students = state.students.filter((s) => s.id !== id);
      success = state.students.length < prevLength;
    });
    return success;
  }
}

export class MockMentorRepository implements IMentorRepository {
  async getAll(): Promise<Mentor[]> {
    return simulatedDb.getState().mentors;
  }

  async getById(id: string): Promise<Mentor | null> {
    return simulatedDb.getState().mentors.find((m) => m.id === id) || null;
  }

  async create(data: Omit<Mentor, "id" | "joinedAt">): Promise<Mentor> {
    const newMentor: Mentor = {
      ...data,
      id: `mnt-${Date.now().toString().slice(-4)}`,
      joinedAt: new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
    };
    simulatedDb.updateState((state) => {
      state.mentors.unshift(newMentor);
      state.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString("id-ID"),
        actorRole: "ADMIN",
        actorName: "Administrator Alfary",
        action: "Tambah Mentor Baru",
        targetType: "MENTOR",
        targetId: newMentor.id,
        targetTitle: newMentor.name,
        details: `Mentor terdaftar untuk subtes ${newMentor.subject}.`,
      });
    });
    return newMentor;
  }

  async update(id: string, data: Partial<Mentor>): Promise<Mentor> {
    let updated: Mentor | null = null;
    simulatedDb.updateState((state) => {
      const idx = state.mentors.findIndex((m) => m.id === id);
      if (idx !== -1) {
        state.mentors[idx] = { ...state.mentors[idx], ...data };
        updated = state.mentors[idx];
      }
    });
    if (!updated) throw new Error(`Mentor dengan ID ${id} tidak ditemukan.`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    let success = false;
    simulatedDb.updateState((state) => {
      const prev = state.mentors.length;
      state.mentors = state.mentors.filter((m) => m.id !== id);
      success = state.mentors.length < prev;
    });
    return success;
  }

  async updatePermissions(id: string, permissions: MentorPermissions): Promise<Mentor> {
    return this.update(id, { permissions });
  }
}

export class MockMaterialRepository implements IMaterialRepository {
  async getAll(): Promise<LearningMaterial[]> {
    return simulatedDb.getState().materials;
  }

  async getById(id: string): Promise<LearningMaterial | null> {
    return simulatedDb.getState().materials.find((m) => m.id === id) || null;
  }

  async getByAuthorId(authorId: string): Promise<LearningMaterial[]> {
    return simulatedDb.getState().materials.filter((m) => m.authorId === authorId);
  }

  async create(data: Omit<LearningMaterial, "id" | "history" | "createdAt" | "updatedAt">): Promise<LearningMaterial> {
    const now = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    const newMaterial: LearningMaterial = {
      ...data,
      id: `mat-${Date.now().toString().slice(-4)}`,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: `${now}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
          actorRole: "MENTOR",
          actorName: data.authorName,
          action: data.status === "SUBMITTED" ? "Pengajuan Materi" : "Simpan Draf Materi",
          newStatus: data.status,
          notes: "Naskah materi dibuat oleh mentor.",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    simulatedDb.updateState((state) => {
      state.materials.unshift(newMaterial);
    });
    return newMaterial;
  }

  async update(id: string, data: Partial<LearningMaterial>): Promise<LearningMaterial> {
    let updated: LearningMaterial | null = null;
    const now = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    simulatedDb.updateState((state) => {
      const idx = state.materials.findIndex((m) => m.id === id);
      if (idx !== -1) {
        state.materials[idx] = { ...state.materials[idx], ...data, updatedAt: now };
        updated = state.materials[idx];
      }
    });
    if (!updated) throw new Error(`Materi dengan ID ${id} tidak ditemukan.`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    let success = false;
    simulatedDb.updateState((state) => {
      const prev = state.materials.length;
      state.materials = state.materials.filter((m) => m.id !== id);
      success = state.materials.length < prev;
    });
    return success;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<LearningMaterial> {
    let updated: LearningMaterial | null = null;
    const nowStr = `${new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;

    simulatedDb.updateState((state) => {
      const idx = state.materials.findIndex((m) => m.id === id);
      if (idx !== -1) {
        const item = state.materials[idx];
        const prevStatus = item.status;
        const trail: ContentAuditTrail = {
          id: `h-${Date.now()}`,
          timestamp: nowStr,
          actorRole: actor.role,
          actorName: actor.name,
          action:
            status === "APPROVED"
              ? "Menyetujui Materi"
              : status === "REJECTED"
              ? "Menolak Materi"
              : status === "PUBLISHED"
              ? "Menerbitkan Materi"
              : status === "DEACTIVATED"
              ? "Menonaktifkan Materi"
              : status === "SUBMITTED"
              ? "Mengajukan Verifikasi"
              : "Perubahan Status",
          previousStatus: prevStatus,
          newStatus: status,
          notes: reason,
        };

        const newIsActive = status === "DEACTIVATED" || status === "REJECTED" ? false : item.isActive;

        state.materials[idx] = {
          ...item,
          status,
          rejectionReason: status === "REJECTED" ? reason : undefined,
          isActive: status === "PUBLISHED" ? true : newIsActive,
          history: [trail, ...item.history],
          updatedAt: nowStr.split(",")[0],
        };
        updated = state.materials[idx];

        state.auditLogs.unshift({
          id: `aud-${Date.now()}`,
          timestamp: nowStr,
          actorRole: actor.role,
          actorName: actor.name,
          action: trail.action,
          targetType: "MATERIAL",
          targetId: item.id,
          targetTitle: item.title,
          details: reason ? `Status diubah ke ${status}. Alasan/Catatan: ${reason}` : `Status diubah ke ${status}.`,
        });
      }
    });

    if (!updated) throw new Error(`Materi dengan ID ${id} tidak ditemukan.`);
    return updated;
  }
}

export class MockQuestionBankRepository implements IQuestionBankRepository {
  async getAll(): Promise<QuestionBankItem[]> {
    return simulatedDb.getState().questions;
  }

  async getById(id: string): Promise<QuestionBankItem | null> {
    return simulatedDb.getState().questions.find((q) => q.id === id) || null;
  }

  async getByAuthorId(authorId: string): Promise<QuestionBankItem[]> {
    return simulatedDb.getState().questions.filter((q) => q.authorId === authorId);
  }

  async create(data: Omit<QuestionBankItem, "id" | "history" | "createdAt" | "updatedAt">): Promise<QuestionBankItem> {
    const now = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    const newQuestion: QuestionBankItem = {
      ...data,
      id: `q-${Date.now().toString().slice(-4)}`,
      history: [
        {
          id: `hq-${Date.now()}`,
          timestamp: `${now}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
          actorRole: "MENTOR",
          actorName: data.authorName,
          action: data.status === "SUBMITTED" ? "Pengajuan Soal Baru" : "Simpan Draf Soal",
          newStatus: data.status,
          notes: "Naskah butir soal disusun mentor.",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    simulatedDb.updateState((state) => {
      state.questions.unshift(newQuestion);
    });
    return newQuestion;
  }

  async update(id: string, data: Partial<QuestionBankItem>): Promise<QuestionBankItem> {
    let updated: QuestionBankItem | null = null;
    const now = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    simulatedDb.updateState((state) => {
      const idx = state.questions.findIndex((q) => q.id === id);
      if (idx !== -1) {
        state.questions[idx] = { ...state.questions[idx], ...data, updatedAt: now };
        updated = state.questions[idx];
      }
    });
    if (!updated) throw new Error(`Soal dengan ID ${id} tidak ditemukan.`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    let success = false;
    simulatedDb.updateState((state) => {
      const prev = state.questions.length;
      state.questions = state.questions.filter((q) => q.id !== id);
      success = state.questions.length < prev;
    });
    return success;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<QuestionBankItem> {
    let updated: QuestionBankItem | null = null;
    const nowStr = `${new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;

    simulatedDb.updateState((state) => {
      const idx = state.questions.findIndex((q) => q.id === id);
      if (idx !== -1) {
        const item = state.questions[idx];
        const prevStatus = item.status;
        const trail: ContentAuditTrail = {
          id: `hq-${Date.now()}`,
          timestamp: nowStr,
          actorRole: actor.role,
          actorName: actor.name,
          action:
            status === "APPROVED"
              ? "Menyetujui Soal"
              : status === "REJECTED"
              ? "Menolak Soal"
              : status === "PUBLISHED"
              ? "Menerbitkan Soal"
              : status === "DEACTIVATED"
              ? "Menonaktifkan Soal"
              : status === "SUBMITTED"
              ? "Mengajukan Soal"
              : "Perubahan Status",
          previousStatus: prevStatus,
          newStatus: status,
          notes: reason,
        };

        state.questions[idx] = {
          ...item,
          status,
          rejectionReason: status === "REJECTED" ? reason : undefined,
          isActive: status === "DEACTIVATED" || status === "REJECTED" ? false : status === "PUBLISHED" ? true : item.isActive,
          history: [trail, ...item.history],
          updatedAt: nowStr.split(",")[0],
        };
        updated = state.questions[idx];

        state.auditLogs.unshift({
          id: `aud-${Date.now()}`,
          timestamp: nowStr,
          actorRole: actor.role,
          actorName: actor.name,
          action: trail.action,
          targetType: "QUESTION",
          targetId: item.id,
          targetTitle: item.code || item.questionText.slice(0, 30),
          details: reason ? `Status diubah ke ${status}. Alasan: ${reason}` : `Status diubah ke ${status}.`,
        });
      }
    });

    if (!updated) throw new Error(`Soal dengan ID ${id} tidak ditemukan.`);
    return updated;
  }
}

export class MockTryoutRepository implements ITryoutRepository {
  async getAll(): Promise<TryoutPackage[]> {
    return simulatedDb.getState().tryouts;
  }

  async getById(id: string): Promise<TryoutPackage | null> {
    return simulatedDb.getState().tryouts.find((t) => t.id === id) || null;
  }

  async getByAuthorId(authorId: string): Promise<TryoutPackage[]> {
    return simulatedDb.getState().tryouts.filter((t) => t.authorId === authorId);
  }

  async create(data: Omit<TryoutPackage, "id" | "history" | "createdAt" | "updatedAt">): Promise<TryoutPackage> {
    const now = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    const newPackage: TryoutPackage = {
      ...data,
      id: `to-${Date.now().toString().slice(-4)}`,
      history: [
        {
          id: `hto-${Date.now()}`,
          timestamp: `${now}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
          actorRole: "MENTOR",
          actorName: data.authorName,
          action: data.status === "SUBMITTED" ? "Pengajuan Paket Tryout" : "Simpan Draf Paket",
          newStatus: data.status,
          notes: "Paket tryout disusun mentor.",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    simulatedDb.updateState((state) => {
      state.tryouts.unshift(newPackage);
    });
    return newPackage;
  }

  async update(id: string, data: Partial<TryoutPackage>): Promise<TryoutPackage> {
    let updated: TryoutPackage | null = null;
    const now = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    simulatedDb.updateState((state) => {
      const idx = state.tryouts.findIndex((t) => t.id === id);
      if (idx !== -1) {
        state.tryouts[idx] = { ...state.tryouts[idx], ...data, updatedAt: now };
        updated = state.tryouts[idx];
      }
    });
    if (!updated) throw new Error(`Paket Tryout dengan ID ${id} tidak ditemukan.`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    let success = false;
    simulatedDb.updateState((state) => {
      const prev = state.tryouts.length;
      state.tryouts = state.tryouts.filter((t) => t.id !== id);
      success = state.tryouts.length < prev;
    });
    return success;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    actor: { role: "ADMIN" | "MENTOR"; name: string },
    reason?: string
  ): Promise<TryoutPackage> {
    let updated: TryoutPackage | null = null;
    const nowStr = `${new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;

    simulatedDb.updateState((state) => {
      const idx = state.tryouts.findIndex((t) => t.id === id);
      if (idx !== -1) {
        const item = state.tryouts[idx];
        const prevStatus = item.status;
        const trail: ContentAuditTrail = {
          id: `hto-${Date.now()}`,
          timestamp: nowStr,
          actorRole: actor.role,
          actorName: actor.name,
          action:
            status === "APPROVED"
              ? "Menyetujui Paket Tryout"
              : status === "REJECTED"
              ? "Menolak Paket Tryout"
              : status === "PUBLISHED"
              ? "Menerbitkan Paket Tryout"
              : status === "DEACTIVATED"
              ? "Menonaktifkan Paket Tryout"
              : status === "SUBMITTED"
              ? "Mengajukan Paket Tryout"
              : "Perubahan Status",
          previousStatus: prevStatus,
          newStatus: status,
          notes: reason,
        };

        state.tryouts[idx] = {
          ...item,
          status,
          rejectionReason: status === "REJECTED" ? reason : undefined,
          isActive: status === "DEACTIVATED" || status === "REJECTED" ? false : status === "PUBLISHED" ? true : item.isActive,
          withdrawalRequested: status === "DEACTIVATED" ? false : item.withdrawalRequested,
          history: [trail, ...item.history],
          updatedAt: nowStr.split(",")[0],
        };
        updated = state.tryouts[idx];

        state.auditLogs.unshift({
          id: `aud-${Date.now()}`,
          timestamp: nowStr,
          actorRole: actor.role,
          actorName: actor.name,
          action: trail.action,
          targetType: "TRYOUT",
          targetId: item.id,
          targetTitle: item.title,
          details: reason ? `Status diubah ke ${status}. Alasan: ${reason}` : `Status diubah ke ${status}.`,
        });
      }
    });

    if (!updated) throw new Error(`Paket Tryout dengan ID ${id} tidak ditemukan.`);
    return updated;
  }

  async requestWithdrawal(id: string, reason: string): Promise<TryoutPackage> {
    let updated: TryoutPackage | null = null;
    const nowStr = `${new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;

    simulatedDb.updateState((state) => {
      const idx = state.tryouts.findIndex((t) => t.id === id);
      if (idx !== -1) {
        state.tryouts[idx].withdrawalRequested = true;
        state.tryouts[idx].withdrawalReason = reason;
        state.tryouts[idx].history.unshift({
          id: `hto-${Date.now()}`,
          timestamp: nowStr,
          actorRole: "MENTOR",
          actorName: state.tryouts[idx].authorName,
          action: "Permohonan Penarikan Paket Terbit",
          newStatus: state.tryouts[idx].status,
          notes: `Permohonan penarikan diajukan ke Admin. Alasan: ${reason}`,
        });
        updated = state.tryouts[idx];

        state.auditLogs.unshift({
          id: `aud-${Date.now()}`,
          timestamp: nowStr,
          actorRole: "MENTOR",
          actorName: state.tryouts[idx].authorName,
          action: "Permohonan Penarikan Paket Tryout",
          targetType: "TRYOUT",
          targetId: id,
          targetTitle: state.tryouts[idx].title,
          details: `Mentor meminta penarikan paket yang sudah terbit: ${reason}`,
        });
      }
    });

    if (!updated) throw new Error(`Paket Tryout dengan ID ${id} tidak ditemukan.`);
    return updated;
  }
}

export class MockScheduleRepository implements IScheduleRepository {
  async getAll(): Promise<ScheduleItem[]> {
    return simulatedDb.getState().schedules;
  }

  async getById(id: string): Promise<ScheduleItem | null> {
    return simulatedDb.getState().schedules.find((s) => s.id === id) || null;
  }

  async getByMentorId(mentorId: string): Promise<ScheduleItem[]> {
    return simulatedDb.getState().schedules.filter((s) => s.mentorId === mentorId);
  }

  async checkConflicts(
    date: string,
    startTime: string,
    endTime: string,
    mentorId: string,
    excludeId?: string
  ): Promise<ScheduleItem[]> {
    const schedules = simulatedDb.getState().schedules;
    return schedules.filter((s) => {
      if (s.id === excludeId) return false;
      if (s.mentorId !== mentorId) return false;
      if (s.date !== date) return false;
      if (s.status === "Dibatalkan") return false;

      // Cek bentrok waktu interval [startTime, endTime)
      const startA = startTime;
      const endA = endTime;
      const startB = s.startTime;
      const endB = s.endTime;

      return startA < endB && endA > startB;
    });
  }

  async create(data: Omit<ScheduleItem, "id" | "createdAt">): Promise<ScheduleItem> {
    const now = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
    const newSchedule: ScheduleItem = {
      ...data,
      id: `sch-${Date.now().toString().slice(-4)}`,
      createdAt: now,
    };
    simulatedDb.updateState((state) => {
      state.schedules.unshift(newSchedule);
      state.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString("id-ID"),
        actorRole: "ADMIN",
        actorName: "Administrator Alfary",
        action: "Penetapan Jadwal Baru",
        targetType: "SCHEDULE",
        targetId: newSchedule.id,
        targetTitle: newSchedule.title,
        details: `Jadwal ${newSchedule.type} ditetapkan pada ${newSchedule.date} (${newSchedule.startTime} - ${newSchedule.endTime}) bersama ${newSchedule.mentorName}.`,
      });
    });
    return newSchedule;
  }

  async update(id: string, data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    let updated: ScheduleItem | null = null;
    simulatedDb.updateState((state) => {
      const idx = state.schedules.findIndex((s) => s.id === id);
      if (idx !== -1) {
        state.schedules[idx] = { ...state.schedules[idx], ...data };
        updated = state.schedules[idx];
      }
    });
    if (!updated) throw new Error(`Jadwal dengan ID ${id} tidak ditemukan.`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    let success = false;
    simulatedDb.updateState((state) => {
      const prev = state.schedules.length;
      state.schedules = state.schedules.filter((s) => s.id !== id);
      success = state.schedules.length < prev;
    });
    return success;
  }
}

export class MockSettingsRepository implements ISettingsRepository {
  async getSettings(): Promise<AdminSettings> {
    return simulatedDb.getState().settings;
  }

  async updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
    let updated: AdminSettings = simulatedDb.getState().settings;
    simulatedDb.updateState((state) => {
      state.settings = { ...state.settings, ...data };
      updated = state.settings;
      state.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString("id-ID"),
        actorRole: "ADMIN",
        actorName: "Administrator Alfary",
        action: "Pembaruan Pengaturan Sistem",
        targetType: "SETTINGS",
        targetId: "settings-global",
        targetTitle: "Pengaturan Platform",
        details: "Admin memperbarui preferensi operasional platform.",
      });
    });
    return updated;
  }

  async getMentorProfile(_mentorId?: string): Promise<MentorProfile> {
    if (_mentorId) {
      // In mock mode, single mentor profile is served
    }
    return simulatedDb.getState().mentorProfile;
  }

  async updateMentorProfile(mentorId: string, data: Partial<MentorProfile>): Promise<MentorProfile> {
    let updated: MentorProfile = simulatedDb.getState().mentorProfile;
    simulatedDb.updateState((state) => {
      state.mentorProfile = { ...state.mentorProfile, ...data };
      updated = state.mentorProfile;
    });
    return updated;
  }
}

export class MockAuditRepository implements IAuditRepository {
  async getAll(): Promise<AuditLog[]> {
    return simulatedDb.getState().auditLogs;
  }

  async log(entry: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: `${new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
    };
    simulatedDb.updateState((state) => {
      state.auditLogs.unshift(newLog);
    });
    return newLog;
  }
}
