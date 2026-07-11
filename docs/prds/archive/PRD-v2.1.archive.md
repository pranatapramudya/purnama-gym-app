# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.1  
**Status:** Phase 2 - UI Cleanup & Routing Polish  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines (Strict Mobile Wrapper) sudah final dan terkunci.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
**A. Navigasi Utama (BottomNav)**
- Beranda (`/member/dashboard`)
- Jadwal (`/member/schedule`)
- Panduan (`/member/guide`)
- Profil (`/member/profile`)

**B. Rute Fungsional & Alur Checkout**
- **Katalog VIP (`/member/packages`):** HANYA berisi opsi keanggotaan bulanan (1, 3, 6, 12 Bulan). Tidak boleh ada opsi paket harian di sini.
- **Checkout Harian (`/member/payment?type=daily`):** Diakses langsung dari tombol 'Visit Harian' di Beranda.
- Tampilkan QR (`/member/qr`).
- Katalog Kelas (`/member/booking`).

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1: UI Static & Layouting:** Selesai.
- [x] **Phase 2.1: Routing System:** Menyambungkan tautan antar halaman.
- [ ] **Phase 2.2: UI Cleanup (Fokus Saat Ini):** Menghapus redundansi UI (menghapus kartu Daily Pass dari `/packages`) agar logika navigasi konsisten.
- [ ] **Phase 3: Backend & Database Sync:** Mengubah *dummy data* menjadi data dinamis dari PostgreSQL.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.9:** Pemisahan tombol CTA (VIP & Harian) di Beranda dan perbaikan *bug overflow*.
* **v2.0:** Transisi dari UI statis ke aplikasi interaktif (*routing* & *links*).
* **v2.1 (Current):** Pembersihan antarmuka (UI Cleanup) pada halaman Katalog VIP untuk menghapus redundansi opsi paket Harian.