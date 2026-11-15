import {
  INITIAL_STUDENTS,
  INITIAL_MENTORS,
  INITIAL_MATERIALS,
  INITIAL_QUESTIONS,
  INITIAL_TRYOUTS,
  INITIAL_SCHEDULES,
  INITIAL_SETTINGS,
  INITIAL_MENTOR_PROFILE,
  INITIAL_AUDIT_LOGS,
} from "./initial-data";
import type {
  Student,
  Mentor,
  LearningMaterial,
  QuestionBankItem,
  TryoutPackage,
  ScheduleItem,
  AdminSettings,
  MentorProfile,
  AuditLog,
} from "@/types";

interface MockDatabaseState {
  students: Student[];
  mentors: Mentor[];
  materials: LearningMaterial[];
  questions: QuestionBankItem[];
  tryouts: TryoutPackage[];
  schedules: ScheduleItem[];
  settings: AdminSettings;
  mentorProfile: MentorProfile;
  auditLogs: AuditLog[];
}

const STORAGE_KEY = "SAHABAT_ALFARY_SIMULATED_DB_V1";

class SimulatedDatabase {
  private state: MockDatabaseState;

  constructor() {
    this.state = {
      students: [...INITIAL_STUDENTS],
      mentors: [...INITIAL_MENTORS],
      materials: [...INITIAL_MATERIALS],
      questions: [...INITIAL_QUESTIONS],
      tryouts: [...INITIAL_TRYOUTS],
      schedules: [...INITIAL_SCHEDULES],
      settings: { ...INITIAL_SETTINGS },
      mentorProfile: { ...INITIAL_MENTOR_PROFILE },
      auditLogs: [...INITIAL_AUDIT_LOGS],
    };

    this.loadFromSession();
  }

  private isClient(): boolean {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  }

  private loadFromSession() {
    if (!this.isClient()) return;
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
      }
    } catch {
      // Fallback to in-memory state
    }
  }

  private saveToSession() {
    if (!this.isClient()) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore quota or serialization errors
    }
  }

  public getState(): MockDatabaseState {
    this.loadFromSession();
    return this.state;
  }

  public updateState(updater: (state: MockDatabaseState) => void) {
    this.loadFromSession();
    updater(this.state);
    this.saveToSession();
  }

  public resetAll() {
    this.state = {
      students: [...INITIAL_STUDENTS],
      mentors: [...INITIAL_MENTORS],
      materials: [...INITIAL_MATERIALS],
      questions: [...INITIAL_QUESTIONS],
      tryouts: [...INITIAL_TRYOUTS],
      schedules: [...INITIAL_SCHEDULES],
      settings: { ...INITIAL_SETTINGS },
      mentorProfile: { ...INITIAL_MENTOR_PROFILE },
      auditLogs: [...INITIAL_AUDIT_LOGS],
    };
    if (this.isClient()) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }
}

export const simulatedDb = new SimulatedDatabase();
