# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.3  
**Status:** Phase 2.3 - UI Vertical Optimization (Above the Fold)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines sudah final.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
**A. Navigasi Utama (BottomNav)**
- Beranda (`/member/dashboard`)
- Jadwal (`/member/schedule`)
- Panduan (`/member/guide`)
- Profil (`/member/profile`)

**B. Rute Fungsional**
- Katalog VIP (`/member/packages`)
- Checkout Harian (`/member/payment?type=daily`)
- Tampilkan QR (`/member/qr`)
- Katalog Kelas (`/member/booking`)

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1: UI Static & Layouting:** Selesai.
- [x] **Phase 2.1 & 2.2: Routing & Cleanup:** Selesai.
- [x] **Phase 2.3: Dashboard Refinement:** Integrasi nama Clerk dan penyesuaian UI CTA.
- [ ] **Phase 2.4: Vertical Space Optimization (Fokus Saat Ini):** Merampingkan *Hero Section* dan merapatkan jarak (margin/padding) antar elemen di Beranda agar seluruh fungsi utama (terutama tombol paket) terlihat seketika (*above the fold*) tanpa *scroll*.
- [ ] **Phase 3: Backend & Database Sync:** Mengubah data statis ke PostgreSQL.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.0:** Transisi dari UI statis ke aplikasi interaktif (*routing*).
* **v2.1:** Pembersihan antarmuka Katalog VIP.
* **v2.2:** Penyempurnaan Beranda (Sinkronisasi nama Clerk, penyatuan Hero Section, dan tata letak CTA).
* **v2.3 (Current):** Optimalisasi ruang vertikal UI Beranda agar mematuhi prinsip desain *Above the Fold* untuk kemudahan akses tombol *membership*.