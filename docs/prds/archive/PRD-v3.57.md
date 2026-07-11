# PRD-v3.57.md
**Status:** Phase 3.57 - Sidebar Navigation RBAC (Admin UI Simplification)
**TUGAS ANDA:** Menyederhanakan tampilan navigasi (Sidebar) untuk pengguna dengan role `admin` dengan cara menyembunyikan menu pengaturan global yang hanya boleh diakses oleh `superadmin`.

---

## 1. Analisis Kebutuhan Akses Sidebar
**Masalah:** Saat ini role `admin` (Kasir/CS) melihat terlalu banyak menu di Sidebar, termasuk menu yang berpotensi mengubah harga atau pengaturan sistem (seperti Paket VIP).
**Solusi:** Terapkan *Conditional Rendering* pada daftar menu di komponen Sidebar berdasarkan `role` yang dilempar dari `layout.tsx` (Prisma Source of Truth).

## 2. Instruksi Refactoring Sidebar Admin
**Lokasi:** Komponen Navigasi/Sidebar Anda (misalnya `app/admin/_components/Sidebar.tsx` atau langsung di dalam `layout.tsx`).
**Instruksi Eksekusi:**
- Tangkap data `role` dari *user* yang sedang *login* (diteruskan dari Server Component ke Client Component Sidebar).
- **Pertahankan (Render untuk Semua Role):**
  - Dashboard
  - Member
  - Personal Trainer
  - Transaksi
  - Scanner QR
- **Sembunyikan (Render HANYA untuk `superadmin`):**
  - **Paket VIP** (Pengaturan harga dan paket)
  - **Panduan Pemula** (Dokumentasi sistem)
- Bungkus tag `<Link>` atau objek *array* menu untuk "Paket VIP" dan "Panduan Pemula" dengan kondisi: `if (role === 'superadmin') { ...render link... }`.

**ATURAN KETAT:**
DILARANG memberikan blok kode dalam balasan Anda! HANYA kerjakan modifikasi logika rendering ini langsung di komponen Sidebar proyek. Pastikan transisi UI berjalan mulus tanpa merusak *layout* responsif yang sudah ada.