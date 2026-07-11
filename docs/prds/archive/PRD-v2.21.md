# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.21  
**Status:** Phase 2.21 - True PWA Integration (WebAPK & iOS Standalone)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, PWA (`@serwist/next` atau `next-pwa`).

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Implementasi Progressive Web App (Fokus Saat Ini)

**A. Instalasi & Konfigurasi Service Worker:**
- **Masalah:** Aplikasi belum bisa diinstal sebagai "True PWA" (menghasilkan *shortcut* berlogo browser alih-alih aplikasi *native/WebAPK*).
- **Solusi Wajib:** 
  1. Integrasikan *library* PWA yang kompatibel dengan Next.js 15 (direkomendasikan menggunakan `@serwist/next` yang merupakan standar modern, atau varian `next-pwa` yang didukung).
  2. Bungkus konfigurasi di `next.config.ts` atau `next.config.js` agar menghasilkan Service Worker saat proses *build*.

**B. Manifest & Metadata (Syarat Mutlak WebAPK & iOS Standalone):**
- **Solusi Wajib:**
  1. Buat file `app/manifest.ts` (App Router native) atau `public/manifest.json`.
  2. Pastikan properti wajib ini ada:
     - `name`: "Purnama Gym"
     - `short_name`: "Purnama"
     - `display`: "standalone" (PENTING untuk menghilangkan UI Browser).
     - `start_url`: "/member/dashboard"
     - `background_color` dan `theme_color`: "#ffffff"
  3. **Konfigurasi Ikon (Anti-Browser Badge):** Definisikan ikon dengan ukuran tepat `192x192` dan `512x512`. Wajib tambahkan properti `purpose: "any maskable"` agar Android dapat membentuk ikon secara *native* tanpa menyisipkan logo Chrome.
  4. **Konfigurasi iOS (`app/layout.tsx`):** Tambahkan ekspor `metadata` dan `viewport` khusus Apple:
     - `appleWebApp: { capable: true, title: "Purnama Gym", statusBarStyle: "default" }`
     - Pastikan terdapat relasi ke `apple-touch-icon`.

**C. Kebutuhan Aset Manual (Catatan untuk Developer):**
- Siapkan aset logo PWA dan letakkan di folder `/public`:
  - `icon-192x192.png`
  - `icon-512x512.png`
  - `apple-touch-icon.png`

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.19:** UI Static, Routing, Custom Icons, iOS Bug Fixes.
- [x] **Phase 2.20:** Perbaikan *Flexbox Alignment* (`justify-start`) untuk *desktop*.
- [x] **Phase 2.21 (Fokus Saat Ini):** Mengonversi sistem Next.js menjadi **True PWA** agar lolos kriteria *WebAPK* Android dan *Standalone* iOS. Tujuannya agar aplikasi dapat diinstal di *Home Screen* pengguna tanpa menampilkan "Browser Badge" (logo Chrome/Safari) pada ikon aplikasi.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.18:** Perbaikan tombol Grid dan standarisasi warna latar belakang putih.
* **v2.19:** Pembuatan *Greeting Gradient Card* dan perbaikan *bug cutoff* iOS.
* **v2.20:** Refaktorisasi *Flexbox* (penghapusan `justify-between`) untuk layar tinggi.
* **v2.21 (Current):** Integrasi *Progressive Web App* (PWA) dengan *Service Worker*, *Manifest*, dan *iOS Metadata* untuk instalasi *native-like* tanpa emblem browser.