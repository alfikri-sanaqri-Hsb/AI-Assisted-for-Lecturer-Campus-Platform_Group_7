import {
  MockStudentRepository,
  MockMentorRepository,
  MockMaterialRepository,
  MockQuestionBankRepository,
  MockTryoutRepository,
  MockScheduleRepository,
  MockSettingsRepository,
  MockAuditRepository,
} from "./mock/repositories";
import {
  ApiStudentRepository,
  ApiMentorRepository,
  ApiMaterialRepository,
  ApiQuestionBankRepository,
  ApiTryoutRepository,
  ApiScheduleRepository,
  ApiSettingsRepository,
  ApiAuditRepository,
} from "./api/api-adapter";
import type {
  IStudentRepository,
  IMentorRepository,
  IMaterialRepository,
  IQuestionBankRepository,
  ITryoutRepository,
  IScheduleRepository,
  ISettingsRepository,
  IAuditRepository,
} from "./interfaces";
import { DATA_SOURCE_MODE } from "@/config/data-source";

const USE_REAL_API = DATA_SOURCE_MODE === "api";

export const studentRepository: IStudentRepository = USE_REAL_API
  ? new ApiStudentRepository()
  : new MockStudentRepository();

export const mentorRepository: IMentorRepository = USE_REAL_API
  ? new ApiMentorRepository()
  : new MockMentorRepository();

export const materialRepository: IMaterialRepository = USE_REAL_API
  ? new ApiMaterialRepository()
  : new MockMaterialRepository();

export const questionBankRepository: IQuestionBankRepository = USE_REAL_API
  ? new ApiQuestionBankRepository()
  : new MockQuestionBankRepository();

export const tryoutRepository: ITryoutRepository = USE_REAL_API
  ? new ApiTryoutRepository()
  : new MockTryoutRepository();

export const scheduleRepository: IScheduleRepository = USE_REAL_API
  ? new ApiScheduleRepository()
  : new MockScheduleRepository();

export const settingsRepository: ISettingsRepository = USE_REAL_API
  ? new ApiSettingsRepository()
  : new MockSettingsRepository();

export const auditRepository: IAuditRepository = USE_REAL_API
  ? new ApiAuditRepository()
  : new MockAuditRepository();

export * from "./interfaces";
export { simulatedDb } from "./mock/storage";
