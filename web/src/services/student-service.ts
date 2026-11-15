import { studentRepository } from "@/repositories";
import type { Student, StudentStatus } from "@/types";

export class StudentService {
  /**
   * Mengambil semua siswa (Kewenangan Admin).
   */
  async getAllStudents(): Promise<Student[]> {
    return studentRepository.getAll();
  }

  /**
   * Mengambil siswa binaan yang ditugaskan kepada mentor tertentu (Kewenangan Mentor).
   * Memastikan Mentor TIDAK dapat mengakses siswa di luar assignment aktif.
   */
  async getAssignedStudents(mentorId: string): Promise<Student[]> {
    return studentRepository.getByMentorId(mentorId);
  }

  /**
   * Mengambil detail siswa berdasarkan ID.
   * Jika dipanggil oleh Mentor, verifikasi apakah siswa tersebut memang ditugaskan kepadanya.
   */
  async getStudentById(id: string, requesterRole: "admin" | "mentor", mentorId?: string): Promise<Student | null> {
    const student = await studentRepository.getById(id);
    if (!student) return null;

    if (requesterRole === "mentor") {
      if (!mentorId || student.assignedMentorId !== mentorId) {
        throw new Error("Akses Ditolak: Mentor hanya dapat melihat rincian siswa binaan aktif.");
      }
    }

    return student;
  }

  /**
   * Menambah siswa baru (Hanya Admin).
   */
  async createStudent(
    data: Omit<Student, "id" | "joinedAt">,
    requesterRole: "admin" | "mentor"
  ): Promise<Student> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang berwenang menambahkan siswa.");
    }
    return studentRepository.create(data);
  }

  /**
   * Memperbarui data siswa (Hanya Admin).
   * Mentor dilarang mengubah data utama siswa.
   */
  async updateStudent(
    id: string,
    data: Partial<Student>,
    requesterRole: "admin" | "mentor"
  ): Promise<Student> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Mentor tidak berwenang mengubah data master siswa.");
    }
    return studentRepository.update(id, data);
  }

  /**
   * Mengubah status akun siswa (Hanya Admin).
   */
  async updateStudentStatus(
    id: string,
    status: StudentStatus,
    requesterRole: "admin" | "mentor"
  ): Promise<Student> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang dapat mengubah status akun siswa.");
    }
    return studentRepository.update(id, { status });
  }

  /**
   * Menghapus siswa (Hanya Admin).
   */
  async deleteStudent(id: string, requesterRole: "admin" | "mentor"): Promise<boolean> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang dapat menghapus akun siswa.");
    }
    return studentRepository.delete(id);
  }
}

export const studentService = new StudentService();
