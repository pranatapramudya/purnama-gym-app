# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.2  
**Status:** Phase 2.2 - Dashboard Refinement & Auth Sync  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines (Strict Mobile Wrapper) sudah final.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
**A. Navigasi Utama (BottomNav)**
- Beranda (`/member/dashboard`)
- Jadwal (`/member/schedule`)
- Panduan (`/member/guide`)
- Profil (`/member/profile`)

**B. Rute Fungsional & Alur Checkout**
- **Katalog VIP (`/member/packages`):** Opsi keanggotaan bulanan (1, 3, 6, 12 Bulan).
- **Checkout Harian (`/member/payment?type=daily`):** Diakses langsung dari Beranda.
- **Tampilkan QR (`/member/qr`):** Untuk *check-in* di kasir.
- **Katalog Kelas (`/member/booking`):** Pemesanan kelas senam/yoga.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1: UI Static & Layouting:** Selesai.
- [x] **Phase 2.1: Routing System:** Menyambungkan tautan antar halaman.
- [x] **Phase 2.2: UI Cleanup (Packages):** Menghapus redundansi kartu Harian di halaman paket VIP.
- [ ] **Phase 2.3: Dashboard Refinement (Fokus Saat Ini):** Menyinkronkan sapaan dengan data nama dari Clerk, menata ulang tata letak (memindahkan Info Penting), membersihkan *clutter* (menghapus logo P), dan meratakan teks (center) pada tombol CTA modern.
- [ ] **Phase 3: Backend & Database Sync:** Mengubah *dummy data* menjadi data dinamis dari PostgreSQL.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.0:** Transisi dari UI statis ke aplikasi interaktif (*routing* & *links*).
* **v2.1:** Pembersihan antarmuka (UI Cleanup) pada halaman Katalog VIP.
* **v2.2 (Current):** Penyempurnaan halaman Beranda (Dashboard) mencakup integrasi nama akun dari Clerk, pembuatan tata letak *Hero Section* premium, dan modernisasi tombol CTA.