# PRD-v3.65.md
**Status:** Phase 3.65 - Fix Server Action Authorization & Trainer Assignment
**TUGAS ANDA:** Memperbaiki validasi role (Role-Based Access Control) yang kaku pada Server Actions, dan menambahkan fitur pemilihan Personal Trainer (dropdown) pada saat pembuatan Jadwal/Slot PT.

---

## 1. Patch Validasi Role di Server Actions
**Lokasi:** `app/actions/admin.ts` (pada fungsi `verifyAdmin` atau sejenisnya)
**Analisis:** Terjadi error `Forbidden: Admins only` karena fungsi hanya mengecek `user.role !== "ADMIN"` secara case-sensitive. Padahal saat ini User (Owner) menggunakan role `superadmin` atau `admin` (lowercase).
**Instruksi Eksekusi:**
- Ubah logika validasi agar menerima berbagai variasi penulisan. 
- Contoh logika yang diharapkan: Izinkan akses JIKA `role` adalah 'admin' ATAU 'superadmin' ATAU 'ADMIN' ATAU 'SUPERADMIN'.
- Terapkan perbaikan ini tidak hanya di `createPTScheduleSlot`, tapi di seluruh Server Actions yang menggunakan fungsi `verifyAdmin`.

## 2. Fitur Assignment Trainer pada Modal CRUD Jadwal
**Lokasi UI:** Komponen Modal Pembuatan Jadwal di halaman Personal Trainer.
**Lokasi Server:** `app/actions/admin.ts` (fungsi fetch data & `createPTScheduleSlot`).
**Instruksi Eksekusi:**
- **Fetch Data:** Buat/modifikasi pemanggilan data agar mengambil daftar `User` yang bisa ditugaskan sebagai trainer (misalnya user dengan role `trainer` atau admin operasional). Lempar data ini ke *Client Component*.
- **Modifikasi UI:** Di dalam form tambah jadwal, tambahkan elemen `<select>` (Dropdown) berlabel "Pilih Personal Trainer". 
- **Modifikasi Database Action:** Pastikan parameter `trainerId` (berupa String ID) dikirimkan dari form UI dan disimpan ke tabel `PTScheduleSlot` melalui Prisma di fungsi `createPTScheduleSlot`.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Langsung perbaiki file `app/actions/admin.ts` dan integrasikan UI-nya agar User tidak lagi menemui error `Forbidden` saat menekan tombol submit.