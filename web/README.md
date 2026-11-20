# Sahabat Alfary Web

Frontend Next.js untuk dashboard Admin dan Mentor Sahabat Alfary. Repository ini
tidak menyediakan backend, database, autentikasi server, atau endpoint API.
Lapisan service/repository menjaga UI tetap dapat berjalan dengan mock data dan
siap ditukar ke API milik tim Backend.

## Menjalankan frontend

```powershell
cd web
npm install
npm run dev
```

Buka <http://localhost:3000>. Pemeriksaan lokal:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

## Mode data

Mode default adalah **mock**. Data simulasi disimpan di `sessionStorage` dan
diinisialisasi dari `src/repositories/mock/initial-data.ts`.

Untuk memakai API Backend:

```env
NEXT_PUBLIC_USE_API=true
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Jika `NEXT_PUBLIC_USE_API` tidak bernilai `true`, semua repository memakai mock.
Jangan menambahkan fallback endpoint di komponen; ubah adapter atau kontrak
secara eksplisit setelah spesifikasi Backend disepakati.

## Struktur modul

- `src/app/`: routing halaman Admin dan Mentor.
- `src/components/`: UI page section, form, table, modal, dan state feedback.
- `src/services/`: aturan penggunaan data dan workflow UI.
- `src/repositories/`: kontrak repository serta implementasi mock/API.
- `src/repositories/mock/`: seed data dan penyimpanan simulasi sesi browser.
- `src/repositories/api/`: adapter HTTP; tidak mengimplementasikan server.
- `src/types/`: bentuk data domain yang dipakai UI dan adapter.
- `src/config/`: mode data dan identitas mock yang dapat diganti saat integrasi.

## Kontrak API yang perlu disepakati

Daftar di bawah mengikuti endpoint yang sudah dirujuk oleh API adapter. Ini
adalah kebutuhan frontend, bukan klaim bahwa endpoint tersebut sudah tersedia.

| Domain | Method dan path | Kebutuhan respons |
| --- | --- | --- |
| Siswa | `GET /students` | `Student[]` |
| Siswa | `GET /students/:id` | `Student` atau `404` |
| Siswa | `GET /mentors/:mentorId/students` | `Student[]` |
| Siswa | `POST /students` | `Student` |
| Siswa | `PUT /students/:id` | `Student` |
| Siswa | `DELETE /students/:id` | status sukses tanpa payload wajib |
| Mentor | `GET/POST /mentors`, `GET/PUT/DELETE /mentors/:id` | `Mentor` atau `Mentor[]` |
| Mentor | `PATCH /mentors/:id/permissions` | `Mentor` |
| Materi | `GET/POST /materials`, `GET/PUT/DELETE /materials/:id` | `LearningMaterial` |
| Materi | `GET /materials?authorId=:id` | `LearningMaterial[]` |
| Materi | `PATCH /materials/:id/status` | `LearningMaterial` |
| Soal | `GET/POST /questions`, `GET/PUT/DELETE /questions/:id` | `QuestionBankItem` |
| Soal | `GET /questions?authorId=:id` | `QuestionBankItem[]` |
| Soal | `PATCH /questions/:id/status` | `QuestionBankItem` |
| Tryout | `GET/POST /tryouts`, `GET/PUT/DELETE /tryouts/:id` | `TryoutPackage` |
| Tryout | `GET /tryouts?authorId=:id` | `TryoutPackage[]` |
| Tryout | `PATCH /tryouts/:id/status` | `TryoutPackage` |
| Tryout | `POST /tryouts/:id/request-withdrawal` | `TryoutPackage` |
| Jadwal | `GET/POST /schedules`, `GET/PUT/DELETE /schedules/:id` | `ScheduleItem` |
| Jadwal | `GET /mentors/:mentorId/schedules` | `ScheduleItem[]` |
| Jadwal | `GET /schedules/check-conflicts?...` | `ScheduleItem[]` |
| Pengaturan | `GET/PUT /settings` | `AdminSettings` |
| Profil mentor | `GET/PUT /mentors/:mentorId/profile` | `MentorProfile` |
| Audit | `GET/POST /audit-logs` | `AuditLog` atau `AuditLog[]` |

Sebelum integrasi, tim perlu menyepakati:

1. format error JSON minimal (`message`, `code`, dan optional `details`);
2. autentikasi browser, credential policy, dan status `401/403`;
3. pagination, filter, sorting, dan bentuk response list;
4. aturan soft delete/status serta transition workflow konten;
5. format tanggal/waktu dan timezone;
6. aturan ownership mentor terhadap siswa dan konten;
7. idempotency dan validasi duplicate untuk operasi `POST`;
8. CORS, base URL per environment, dan batas timeout/retry.
