# PRD-v3.90.md (Revisi)
**Status:** Phase 3.90 - Unified PT Management Page & Tab-Level RBAC
**TUGAS ANDA:** Menghapus halaman jadwal redundan yang sebelumnya dibuat, mengarahkan role `TRAINER` ke halaman Manajemen Sesi PT yang sudah ada (`/admin/personal-trainer`), dan menerapkan pembatasan akses tingkat komponen (Tab-Level RBAC) di dalam halaman tersebut.

---

## 1. Cleanup Halaman Redundan & Perbaikan Middleware
**Lokasi:** Direktori proyek & `middleware.ts`.
**Instruksi Eksekusi:**
- Hapus secara permanen folder/halaman `/app/admin/my-schedule` yang salah dibuat pada iterasi sebelumnya.
- Ubah logika *redirect* di Middleware (atau fungsi login): Saat `TRAINER` berhasil login, arahkan mereka langsung ke `/admin/personal-trainer`.

## 2. Navigasi Sidebar (Strict RBAC)
**Lokasi:** `components/admin/AdminSidebar.tsx`.
**Instruksi Eksekusi UI:**
- **Role `TRAINER`:** Tampilkan menu "Personal Trainer" dan "Scanner QR". Sembunyikan sisa menu lainnya (Dashboard, Member, Transaksi, dll).
- **Role `ADMIN` (Kasir):** SEMBUNYIKAN menu "Personal Trainer". Kasir hanya fokus pada Dashboard, Member, Transaksi, dan Scanner.
- **Role `SUPERADMIN`:** Tampilkan SELURUH menu tanpa terkecuali.

## 3. Tab-Level RBAC & Data Filtering (Halaman Personal Trainer)
**Lokasi:** Halaman `app/admin/personal-trainer/page.tsx` (atau Client Component-nya).
**Instruksi Eksekusi UI/UX & Logika:**
- **Sembunyikan Tab Master:** Deteksi role *user* yang sedang login. Jika role adalah `TRAINER`, HILANGKAN/SEMBUNYIKAN tab **"Master Jadwal & Harga"**. `TRAINER` hanya boleh melihat tab **"Monitoring Sesi"** (Sesi Aktif, Sesi Hari Ini, Booking Baru).
- **Filter Data Spesifik (Penting):** Pada tab "Monitoring Sesi", pastikan data *booking* dan jadwal yang di-fetch dari database difilter HANYA untuk sesi yang `trainerId`-nya cocok dengan ID `TRAINER` yang sedang login. (Jangan sampai PT A melihat jadwal PT B).
- *Catatan:* Jika yang login adalah `SUPERADMIN`, tampilkan seluruh tab dan seluruh data sesi PT tanpa filter spesifik.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan pembatasan visibilitas Tab ini menggunakan *conditional rendering* (React State/Props). Pastikan keamanan *fetching* data di sisi Server Action agar PT benar-benar hanya bisa menarik data jadwalnya sendiri.