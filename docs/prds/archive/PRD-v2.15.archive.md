# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.15  
**Status:** Phase 2.15 - Absolute One-Page Layout & Micro-UI Scaling  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Perbaikan Bug & UX Refinement (Fokus Saat Ini)

**A. Eksekusi Ekstrem Layout One-Page (Anti-Scroll) di Beranda:**
- **Masalah:** Halaman Beranda masih *oversized*, terlihat sesak, dan bisa di- *scroll* (melewati batas *Bottom Navigation*).
- **Solusi Wajib (Layouting):**
  1. Kunci pembungkus utama halaman Beranda (`dashboard/page.tsx`). Gunakan *class* `h-full flex flex-col overflow-hidden`. Ini akan memaksa halaman berhenti tepat di atas *Bottom Navigation* dan mematikan fungsi *scroll* secara paksa.
  2. Gunakan `justify-between` atau `gap-2` (jangan lebih besar dari `gap-3`) antar komponen utama agar jaraknya proporsional tapi rapat.

**B. Micro-UI Scaling (Pengecilan Komponen):**
- **Teks Sapaan:** Turunkan ukuran *font* sapaan ("Siap untuk jadwal...") menjadi `text-base` atau maksimal `text-lg` dengan `leading-tight`.
- **Kartu Member (Merah Muda):** Kurangi *padding* internal secara drastis (gunakan `p-3` atau `px-4 py-3`). Kecilkan teks "Regular Member" menjadi `text-lg`.
- **Grid 2x2 (QR, Booking, VIP, Harian):** Ini adalah penyebab utama *layout* membesar. 
  - Kurangi *gap* antar kolom/baris menjadi `gap-2`.
  - Kurangi *padding* di dalam tombol kotak menjadi `p-2`.
  - Perkecil ikon (gunakan `w-5 h-5` atau `w-6 h-6`).
  - Perkecil teks di dalam kotak menjadi `text-xs` (atau `text-[11px]`).
- **Tombol Perpanjang:** Buat lebih tipis. Gunakan tinggi `h-10` atau `py-2`.
- **Info Penting:** Kurangi *padding* menjadi `p-2`. Gunakan *font* berukuran `text-[10px]` atau `text-xs` dengan jarak baris (`leading`) yang rapat.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.13:** UI Static, Routing, Pricing, Grid Modernization, Stateful Buttons, & Bug Fixes.
- [x] **Phase 2.14:** Pemolesan UX *Custom Modal* dan perbaikan siklus *State*.
- [x] **Phase 2.15 (Fokus Saat Ini):** Memaksa struktur Beranda menjadi *Absolute One-Page* (mengunci *overflow*), dan menerapkan *Micro-UI Scaling* dengan memangkas *padding*, *margin*, dan *font-size* secara drastis agar tidak ada elemen yang terpotong.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.12:** Penyesuaian tata letak paket menjadi Grid 2x2.
* **v2.13:** Perbaikan *Runtime Error* React (`Suspense`) dan modernisasi visual Grid VIP.
* **v2.14:** Pemolesan UX *Custom Modal* pembatalan kelas dan penghapusan redundansi Profil.
* **v2.15 (Current):** Pemangkasan ukuran komponen (Micro-UI) dan penerapan `overflow-hidden` untuk menjamin Beranda tampil sempurna dalam satu layar *mobile* tanpa fungsi gulir ( *scroll* ).