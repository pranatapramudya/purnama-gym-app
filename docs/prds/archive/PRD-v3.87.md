# PRD-v3.87.md
**Status:** Phase 3.87 - Clerk Auth Payload Fix & Trainer RBAC Implementation
**TUGAS ANDA:** Memperbaiki *payload* pengiriman data ke Clerk API agar memenuhi syarat (requirements) *Last Name* dan *Username*, serta menerapkan pembatasan hak akses (Role-Based Access Control) pada antarmuka untuk role `TRAINER`.

---

## 1. Hotfix: Clerk Payload Data (Server Action)
**Lokasi:** Fungsi `createStaffAccount` di `app/actions/superadmin.ts`.
**Masalah:** Clerk menolak pembuatan *user* karena `lastName` dan `username` kosong/tidak terkirim.
**Instruksi Eksekusi Logika:**
- Saat memproses input `Nama Lengkap`, buat logika pemisah string (split).
  - `firstName` = Kata pertama dari `Nama Lengkap`.
  - `lastName` = Sisa kata berikutnya. (Jika nama hanya 1 kata, isi `lastName` dengan default string fallback, misal: `Purnama`).
- Generate `username` unik secara otomatis (Contoh: gabungan `firstName` huruf kecil + angka random, misal `budi_8821`).
- Tambahkan `firstName`, `lastName`, dan `username` ke dalam *payload* `clerkClient().users.createUser({...})`.

## 2. RBAC: Pembatasan Akses Role `TRAINER` (Sidebar)
**Lokasi:** `components/admin/AdminSidebar.tsx` (atau file navigasi sejenis).
**Instruksi Eksekusi UI/UX:**
- Tambahkan logika filter menu berdasarkan `role` Karyawan yang sedang login.
- **Jika role === 'TRAINER':**
  - Sembunyikan menu: **Dashboard (Laporan), Transaksi, Master Paket VIP, dan Manajemen Karyawan**.
  - Tampilkan hanya menu: **Jadwal PT / Sesi Saya** dan **Scanner QR** (agar PT bisa memverifikasi kehadiran kliennya sendiri).
- **Jika role === 'ADMIN':**
  - Tampilkan menu operasional (Transaksi, Scanner, Member). Sembunyikan Manajemen Karyawan.

## 3. Route Protection (Keamanan Lanjutan)
**Lokasi:** Middleware atau Layout Admin (`app/admin/layout.tsx`).
**Instruksi Eksekusi Logika:**
- Pastikan jika seorang *Trainer* mencoba iseng mengetik URL `/admin/transactions` secara manual di *browser*, sistem akan me- *redirect* mereka kembali ke halaman utama mereka (misal `/admin/schedule` atau `/admin/scanner`) dengan menampilkan *toast error*: "Akses Ditolak. Anda tidak memiliki izin ke halaman ini."

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan perbaikan *payload* Clerk ini dengan aman agar *error validation* tidak muncul lagi. Pastikan UI Sidebar langsung merespons perubahan menu saat login menggunakan akun Trainer.