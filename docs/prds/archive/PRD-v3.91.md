# PRD-v3.91.md
**Status:** Phase 3.91 - UI/UX Refinement: Hide QR Scanner from Trainer Role
**TUGAS ANDA:** Memperbarui logika Role-Based Access Control (RBAC) pada Sidebar Navigasi agar menu "Scanner QR" disembunyikan secara permanen dari pengguna dengan role `TRAINER`.

---

## 1. Sidebar RBAC Update
**Lokasi:** `components/admin/AdminSidebar.tsx` (Atau komponen yang mengatur *rendering* menu navigasi kiri).
**Instruksi Eksekusi Logika UI:**
- Temukan bagian kode yang merender *item* menu **"Scanner QR"**.
- Perbarui kondisional *rendering*-nya. Saat ini mungkin diatur agar tampil untuk Admin dan Trainer.
- **Ubah Aturan:** Menu "Scanner QR" HANYA BOLEH dirender jika pengguna yang sedang login memiliki role `ADMIN` atau `SUPERADMIN`. 
- Jika pengguna memiliki role `TRAINER`, pastikan menu tersebut HILANG (tidak di-render ke DOM).
- Hasil akhir untuk role `TRAINER`: Sidebar JIKA DIBUKA hanya akan menampilkan **1 menu tunggal**, yaitu "Personal Trainer" (atau "Manajemen Sesi PT").

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan logika penyembunyian ini menggunakan kondisi (misal: `role !== 'TRAINER'`) langsung di dalam komponen Sidebar Anda.