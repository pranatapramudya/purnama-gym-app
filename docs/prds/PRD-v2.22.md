# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.22  
**Status:** Phase 2.22 - Next.js 16 Compatibility & Turbopack Resolution  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Prisma, Neon DB, Clerk, `@serwist/next`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Penyelesaian Bug Konfigurasi Next.js 16 (Fokus Saat Ini)

**A. Resolusi Konflik Turbopack vs Webpack (Serwist PWA):**
- **Masalah:** Next.js 16 menggunakan Turbopack secara *default*, namun `@serwist/next` menyuntikkan konfigurasi Webpack. Adanya properti `turbopack` di dalam objek `experimental` pada `next.config.mjs` juga memicu *invalid key error*.
- **Solusi Wajib:**
  1. Buka file `next.config.mjs` atau `next.config.ts`.
  2. HAPUS pengaturan `turbopack` dari dalam blok `experimental`. (Hapus blok `experimental` secara keseluruhan jika tidak ada properti lain di dalamnya).
  3. Sesuai anjuran pesan *error* Next.js, tambahkan objek kosong `turbopack: {}` di tingkat paling atas ( *root* ) dari objek `nextConfig` untuk membungkam peringatan transisi *compiler*, **ATAU**
  4. Buka `package.json`, dan ubah *script* untuk `dev` menjadi `"dev": "next dev --webpack"` untuk secara eksplisit menggunakan Webpack yang selaras dengan Serwist PWA saat pengembangan lokal. (Terapkan salah satu atau kedua langkah pengamanan ini).

**B. Migrasi File Middleware ke Proxy:**
- **Masalah:** Muncul peringatan *deprecation*: `The "middleware" file convention is deprecated. Please use "proxy" instead.`
- **Solusi Wajib:**
  1. Cari file `middleware.ts` (atau `middleware.js`) di tingkat *root* proyek atau di dalam folder `src/`.
  2. *Rename* (Ubah nama) file tersebut menjadi `proxy.ts`.
  3. Pastikan kode konfigurasi `clerkMiddleware()` di dalamnya tetap utuh, hanya nama filenya saja yang wajib mengikuti konvensi Next.js 16 terbaru.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.20:** UI Static, Routing, Custom Icons, *Anti-Scroll*, dan *Flexbox Alignment*.
- [x] **Phase 2.21:** Konversi ke *Progressive Web App* (PWA) dengan manifest *standalone*.
- [x] **Phase 2.22 (Fokus Saat Ini):** Memperbaiki *crash* saat `npm run dev` dengan menyelesaikan konflik konfigurasi Turbopack di `next.config.mjs` dan mengubah nama konvensi file `middleware.ts` menjadi `proxy.ts` sesuai standar Next.js 16.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.19:** Pembuatan *Greeting Gradient Card* dan perbaikan *bug cutoff* iOS.
* **v2.20:** Refaktorisasi *Flexbox* (penghapusan `justify-between`) untuk layar tinggi.
* **v2.21:** Integrasi PWA (WebAPK Android & iOS Standalone).
* **v2.22 (Current):** Adaptasi *Next.js 16 Compiler Environment* (Turbopack Bypass) & Pembaruan File *Middleware* menjadi *Proxy*.