# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.23  
**Status:** Phase 2.23 - PWA Installability Debugging & Verification  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, `@serwist/next`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Debugging PWA Installability (Fokus Saat Ini)

**A. Verifikasi Relasi Manifest (`app/layout.tsx`):**
- **Masalah:** Browser berbasis Chromium (Chrome/Brave) tidak memunculkan *prompt/icon* instalasi PWA di *address bar*. Ini biasanya terjadi karena file *manifest* tidak terhubung ke dalam dokumen HTML.
- **Solusi Wajib:**
  1. Buka `app/layout.tsx`.
  2. Pastikan di dalam `export const metadata: Metadata = { ... }` terdapat definisi manifest. Tambahkan baris ini jika belum ada: `manifest: "/manifest.json"` (jika menggunakan file json di public) ATAU biarkan Next.js yang menangani otomatis JIKA file bernama persis `manifest.ts` berada di dalam folder `app/`.
  3. Pastikan ekstensi metadata untuk Apple juga lengkap di dalam `metadata`:
     ```typescript
     appleWebApp: {
       capable: true,
       statusBarStyle: "default",
       title: "Purnama Gym",
     },
     ```

**B. Pengaturan Serwist/PWA untuk Mode Development (Opsional/Sementara):**
- **Masalah:** *Service Worker* tidak aktif saat menjalankan `npm run dev`.
- **Solusi Wajib:** 
  1. Buka `next.config.mjs`.
  2. Cari konfigurasi PWA (misal `withSerwistInit`). Pastikan terdapat opsi untuk menyalakan *Service Worker* di lingkungan pengembangan untuk tujuan *testing*. 
  3. Tambahkan konfigurasi: `disable: false` atau `devOptions: { enabled: true }` (sesuaikan dengan API Serwist yang digunakan) agar mesin PWA tetap menyala saat pengujian lokal.

**C. Verifikasi Aset di Folder Public:**
- Agen WAJIB memastikan secara logika bahwa file `icon-192x192.png` dan `icon-512x512.png` benar-benar dirujuk dengan path URL yang tepat di dalam file manifest (contoh: `src: "/icon-192x192.png"`). Jangan gunakan *relative path* tanpa *slash* di depannya.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.21:** UI Static, Routing, Strict Constraints, WebAPK Manifest Setup.
- [x] **Phase 2.22:** Turbopack Bypass & Proxy Middleware Fix.
- [x] **Phase 2.23 (Fokus Saat Ini):** Menyelesaikan *bug* PWA yang tidak memicu *install prompt* dengan memastikan relasi *manifest* di `layout.tsx` terbaca oleh peramban, memverifikasi URL aset ikon, dan mengaktifkan sementara *Service Worker* di mode pengembang lokal.
- [ ] **Phase 3:** Backend & Database Sync.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.20:** Refaktorisasi *Flexbox Alignment* pada desktop.
* **v2.21:** Setup dasar *Progressive Web App* (PWA).
* **v2.22:** Adaptasi Next.js 16 (Turbopack) & *Proxy*.
* **v2.23 (Current):** *Troubleshooting* dan perbaikan konfigurasi *Manifest Linking* agar aplikasi 100% terdeteksi sebagai aplikasi yang dapat diinstal (Installable PWA) oleh Chrome/Brave/Safari.