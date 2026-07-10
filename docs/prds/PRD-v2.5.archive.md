# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.5  
**Status:** Phase 2.5 - Hero Minimalism & Uniform Grid UI  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti dan database sudah terkunci.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
- **Grid Menu Beranda (2x2):**
  1. QR Masuk (`/member/qr`)
  2. Booking Kelas (`/member/booking`)
  3. VIP Membership (`/member/packages`)
  4. Visit Harian (`/member/payment?type=daily`)
- **Navigasi Bawah (BottomNav):** Beranda, Jadwal, Panduan, Profil.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1:** UI Static & Layouting.
- [x] **Phase 2.1 - 2.3:** Routing, Cleanup, & Dashboard Refinement.
- [x] **Phase 2.4:** Aggressive Compact Sizing.
- [x] **Phase 2.5 (Fokus Saat Ini):** Merombak tata letak menu utama menjadi *Uniform Grid 2x2* agar seragam secara visual, serta menghapus elemen sapaan yang berlebihan di area *Hero Section* untuk memaksimalkan ruang layar.
- [ ] **Phase 3:** Backend & Database Sync (Mengubah data statis ke PostgreSQL).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.2:** Penyempurnaan Beranda (Sinkronisasi nama Clerk).
* **v2.3:** Optimalisasi ruang vertikal UI Beranda tahap 1.
* **v2.4:** Eksekusi *Aggressive Compact Sizing* pada font dan padding.
* **v2.5 (Current):** Refaktorisasi menu Beranda menjadi Grid 2x2 yang seragam dan penerapan minimalisme pada *Hero Section*.