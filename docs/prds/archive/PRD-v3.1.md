# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.1  
**Status:** Phase 3.1 - Admin Dashboard Planning & Minor UI Fixes  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Prisma ORM, Neon DB (PostgreSQL), Clerk Auth.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Fase 1 (UI) dan Fase 2 (Frontend/PWA) dikunci. Kita sekarang berfokus pada ekosistem Admin dan Backend.*

---

## 8. Perbaikan Frontend (Minor Fix)
**Halaman Panduan (`app/member/guide/page.tsx`):**
- Aktifkan tombol "Mulai Program Pemula". 
- Tambahkan interaksi `onClick` yang memunculkan *Modern Toast* (warna hijau/pink) bertuliskan: "Mempersiapkan program pemula Anda..." (Sebagai *placeholder* sebelum fitur video aktif).

## 9. Arsitektur Admin Dashboard (SaaS Standard)
Kita akan membangun portal khusus Admin (`/admin`) dengan tata letak *Sidebar Navigation* dan *Main Content Area* bergaya SaaS modern.

**A. Kebutuhan Layout & Security (`app/admin/layout.tsx`):**
- **Proteksi Rute:** Gunakan `auth().protect()` dari Clerk. Hanya *user* dengan `role === 'ADMIN'` di *database* atau yang memiliki *metadata admin* di Clerk yang bisa mengakses halaman ini.
- **Sidebar Menu:** Dashboard, Member, Kelas, Transaksi, Scanner QR.

**B. Fitur Utama Admin (CRUD & Prisma Integration):**
1. **Dashboard Analytics (`/admin/dashboard`):** Menampilkan kartu ringkasan (Total Member, Pendapatan, Kelas Hari Ini).
2. **QR Scanner (`/admin/scanner`):** Antarmuka integrasi kamera (menggunakan pustaka seperti `html5-qrcode` atau `react-qr-reader`) untuk memindai QR Member yang melakukan *Visit Harian* atau hadir ke Kelas.
3. **Manajemen Member (`/admin/members`):** - Menampilkan tabel dari model `User` (Prisma).
   - Fitur pencarian nama/email.
   - Tombol aksi (Modern Dropdown/Modal) untuk mengedit status keanggotaan secara manual.
4. **Manajemen Kelas (`/admin/classes`):**
   - Menampilkan tabel dari model `ClassSession`.
   - Tombol "Tambah Kelas Baru" yang membuka *Slide-over* atau *Modal Dialog* modern.
   - Fitur penghapusan jadwal kelas menggunakan *Confirmation Alert* yang elegan.
5. **Manajemen Transaksi (`/admin/transactions`):**
   - Menampilkan riwayat pembayaran dari model `Transaction`.
   - Tombol verifikasi pembayaran untuk mengubah status `PENDING` menjadi `SUCCESS`.

**C. Standar UI/UX Admin:**
- Gunakan komponen *Data Table* yang bersih (border tipis, efek *hover* pada baris).
- Semua aksi *mutate* data (Create/Update/Delete) WAJIB menggunakan Server Actions (Next.js 16) yang dihubungkan dengan Prisma.
- Setiap operasi yang berhasil/gagal WAJIB memicu *Modern Toast/Alert*.

---

## 10. Full-Stack Implementation Tracker
- [x] **Phase 1 & 2:** UI/UX, Routing, PWA, dan State Management.
- [x] **Phase 3.0:** Inisiasi Prisma Schema & Neon DB.
- [x] **Phase 3.1 (Fokus Saat Ini):** Memperbaiki tombol minor di menu Panduan, serta membuat kerangka (Layouting) portal Admin yang terproteksi dan menyiapkan halaman komponen untuk setiap entitas *database*.
- [ ] **Phase 3.2:** Implementasi *Server Actions* untuk operasional CRUD di Admin Dashboard.

---

## 11. Riwayat Catatan Pengerjaan (Changelog)
* **v2.22:** Adaptasi Next.js 16 (Turbopack) & *Proxy*.
* **v2.23:** Perbaikan *bug* visibilitas instalasi PWA.
* **v3.0:** Pembuatan *Database Schema* menggunakan Prisma.
* **v3.1 (Current):** Perencanaan fitur portal Admin (CRM, Jadwal, QR Scanner, Keuangan) dan perbaikan fungsionalitas tombol Panduan.