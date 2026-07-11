# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.20  
**Status:** Phase 2.20 - Desktop/Tall Screen Flexbox Alignment Fix  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, `next/image`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Perbaikan Bug & Layout Alignment (Fokus Saat Ini)

**A. Perbaikan Jarak "Info Penting" di Layar Tinggi (Desktop/Tablet):**
- **Masalah:** Saat diakses melalui layar desktop yang tinggi, komponen "Info Penting" terlempar terlalu jauh ke bawah. Ini disebabkan oleh penggunaan *flexbox* `justify-between` atau `mt-auto` yang mendistribusikan sisa ruang kosong ke tengah tata letak.
- **Solusi Wajib (Stacking Alignment):**
  1. Buka file Beranda (`app/member/dashboard/page.tsx`).
  2. Pada pembungkus utama (`container`) halaman Beranda, HAPUS *class* `justify-between`.
  3. Ganti dengan *class* `justify-start` dan berikan jarak vertikal yang konsisten, misalnya `gap-3` atau `gap-4` (`flex flex-col justify-start gap-4`).
  4. Pastikan pada komponen "Info Penting" TIDAK ADA *class* `mt-auto`. Biarkan komponen tersebut mengikuti urutan ( *stacking* ) secara natural di bawah tombol "Perpanjang Membership" dengan jarak yang sudah diatur oleh `gap` dari *parent*-nya.
  5. Dengan begini, pada layar *mobile* tampilannya akan tetap padat dan tidak terpotong (karena ukuran Micro-UI sudah diterapkan sebelumnya), dan pada layar *desktop* elemen tidak akan terpisah jauh.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.18:** UI Static, Routing, Custom Icons, Constraint Anti-Scroll, Background White Fix.
- [x] **Phase 2.19:** Pembuatan *Greeting Gradient Card* dan kompresi vertikal ekstrem untuk perbaikan *cutoff* di iOS.
- [x] **Phase 2.20 (Fokus Saat Ini):** Memperbaiki perilaku *flexbox* pada layar tinggi (Desktop) dengan mengganti `justify-between` menjadi `justify-start` yang dipadukan dengan `gap` statis agar komponen "Info Penting" tidak terpisah jauh dari elemen di atasnya.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.17:** Penggunaan gambar kustom (`/icons/...`) pada menu Grid.
* **v2.18:** Perbaikan tombol Grid dan standarisasi warna latar belakang putih.
* **v2.19:** Pembuatan *Greeting Gradient Card* dan perbaikan *bug cutoff* iOS.
* **v2.20 (Current):** Refaktorisasi *Flexbox Alignment* pada Beranda untuk mencegah *gap* (jarak) yang berlebihan saat aplikasi dijalankan di *viewport* desktop yang tinggi.