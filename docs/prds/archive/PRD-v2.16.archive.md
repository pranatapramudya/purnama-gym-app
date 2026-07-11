# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.16  
**Status:** Phase 2.16 - Strict Viewport Lock (100dvh Anti-Scroll)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Perbaikan Bug Ekstrem: Anti-Scroll Mobile Layout

**A. Kunci Mati Mobile Wrapper (`app/member/layout.tsx`):**
- **Masalah:** Halaman masih bisa di-*scroll* (bocor) karena pembungkus utama (*wrapper*) menggunakan `min-h-screen` yang memungkinkannya memanjang ke bawah.
- **Solusi Wajib:** 1. Ubah *class* pembungkus utama mobile dari `min-h-screen` menjadi `h-[100dvh] max-h-[100dvh] overflow-hidden`.
  2. Pastikan struktur flexbox-nya adalah: `flex flex-col h-[100dvh]`.
  3. Bagian konten utama (tempat `<main>` atau `children` di- *render*) harus memiliki *class* `flex-1 overflow-y-auto` (agar halaman lain seperti panduan tetap bisa di-*scroll*), **KECUALI** untuk Beranda yang akan ditangani di poin B.

**B. Kunci Mati Halaman Beranda (`app/member/dashboard/page.tsx`):**
- **Masalah:** Beranda masih memiliki sisa ruang ( *whitespace* ) atau elemen terdorong ke bawah.
- **Solusi Wajib:**
  1. Berikan *class* pada pembungkus terluar halaman Beranda: `h-full w-full flex flex-col justify-between overflow-hidden`. (Hapus `overflow-y-auto` jika ada).
  2. Pastikan elemen di dalamnya (dari Sapaan hingga Info Penting) mengisi ruang dengan pas tanpa *margin-bottom* atau *padding-bottom* berlebih yang menembus batas bawah layar.
  3. Gunakan `justify-between` agar ruang kosong didistribusikan secara otomatis dan proporsional di antara blok elemen, sehingga Info Penting menempel tepat di atas Bottom Nav tanpa perlu di-*scroll*.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.14:** UI Static, Routing, Pricing, Grid Modernization, Stateful Buttons, Modal, & UI Compact Sizing.
- [x] **Phase 2.15:** Pemangkasan ukuran komponen (Micro-UI).
- [x] **Phase 2.16 (Fokus Saat Ini):** Mengatasi *bug layout bocor* (*scrollable*) dengan mengunci tinggi *Mobile Wrapper* menggunakan `h-[100dvh]` dan memperbaiki mekanisme flexbox `justify-between` di Beranda.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.13:** Perbaikan *Runtime Error* React (`Suspense`) dan modernisasi visual Grid VIP.
* **v2.14:** Pemolesan UX *Custom Modal* pembatalan kelas dan penghapusan redundansi Profil.
* **v2.15:** Pemangkasan ukuran komponen (Micro-UI) untuk Beranda.
* **v2.16 (Current):** Implementasi *Strict Viewport Lock* pada Layout utama dan Beranda untuk mematikan perilaku *scroll* secara absolut di perangkat mobile/desktop.