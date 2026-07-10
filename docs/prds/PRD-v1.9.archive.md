# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.9  
**Status:** Updated Specification (Layout Precision & Separated CTA)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines tetap sama dengan v1.8. Strict Mobile Wrapper wajib diterapkan tanpa ada elemen yang overflow.*

---

## 8. Alur Frontend Saat Ini (Fokus Member)
**A. Alur Pembelian Paket (Separated CTA):**
1. `app/member/dashboard` -> User dihadapkan pada 2 tombol spesifik:
   - **VIP Membership:** Mengarahkan user ke `/packages` (katalog 1, 3, 6, 12 Bulan).
   - **Visit Harian:** Mengarahkan user langsung ke proses *checkout* harian.
2. `app/member/payment` -> Layar konfirmasi tagihan dan info transfer/pembayaran di kasir.

**B. Alur QR Masuk (Check-in):**
Halaman difokuskan untuk merender QR Code murni di dalam *Mobile Wrapper* tanpa merusak batasan lebar (`max-w-md`).

---

## 9. Frontend Implementation Tracker
- [x] **Setup & Routing Utama:** Autentikasi Clerk dan proteksi Middleware.
- [x] **UI Komponen Statis:** Halaman Beranda, Panduan, Profil.
- [x] **UI Precision Refinement:** Memisahkan CTA di Beranda, mengecilkan skala UI `/packages` ala iOS, dan memperbaiki *overflow* hitam pada `/qr`.
- [ ] **`app/member/payment`:** Membuat halaman konfirmasi tagihan (Bill Payment).
- [ ] **`app/member/booking` & `/schedule`:** UI Katalog kelas dan Jadwal Pribadi.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.6:** Pemisahan logika Katalog Booking dan Jadwal Pribadi.
* **v1.7:** Instalasi *library* QR Code.
* **v1.8:** Penyederhanaan paket menjadi VIP & Visit Harian.
* **v1.9 (Current):** Pemisahan tombol CTA (VIP & Harian) di Beranda dan perbaikan *bug overflow/oversized layout* agar lebih presisi menyesuaikan layar *mobile*.