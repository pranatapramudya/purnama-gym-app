# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.4  
**Status:** Phase 2.4 - Aggressive Compact Sizing (Micro-UI)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti dan database sudah terkunci.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
*(Tetap mengacu pada struktur Routing di v2.3)*
- Navigasi Utama: Beranda, Jadwal, Panduan, Profil.
- Rute Fungsional: Katalog VIP, Checkout Harian, QR Modal, Katalog Booking.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1: UI Static & Layouting:** Selesai.
- [x] **Phase 2.1 & 2.2: Routing & Cleanup:** Selesai.
- [x] **Phase 2.3: Dashboard Refinement:** Selesai.
- [x] **Phase 2.4 (Fokus Saat Ini):** Menerapkan *Aggressive Compact Sizing* pada `dashboard`. Mengecilkan ukuran font (*headings* ke `text-xl`), *padding* komponen, dan *gap* agar aplikasi terasa seperti *native mobile app* yang presisi dan tidak *oversized*.
- [ ] **Phase 3: Backend & Database Sync:** Mengubah data statis ke PostgreSQL.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.1:** Pembersihan antarmuka Katalog VIP.
* **v2.2:** Penyempurnaan Beranda (Sinkronisasi nama Clerk).
* **v2.3:** Optimalisasi ruang vertikal UI Beranda tahap 1.
* **v2.4 (Current):** Eksekusi *Aggressive Compact Sizing* pada font, padding, dan dimensi tombol untuk mencapai standar presisi layar *mobile*.