# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.8  
**Status:** Updated Specification (UI Scaling & Package Streamlining)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines tetap sama dengan v1.7. Penekanan pada Constraint Layout: TIDAK BOLEH ADA elemen (terutama SVG QR Code) yang melewati batas `max-w-md`.*

---

## 8. Alur Frontend Saat Ini (Fokus Member)
**A. Alur Pembelian Paket (Streamlined):**
1. `app/member/dashboard` -> User klik tombol 'Beli / Perpanjang Paket'.
2. `app/member/packages` -> User disajikan 2 kategori utama:
   - **VIP Membership:** Akses bulanan (1, 3, 6, 12 Bulan) dengan *benefit* lengkap (termasuk kelas, loker, PT).
   - **Visit Harian (Daily Pass):** Akses 1 hari tanpa kelas.
3. `app/member/payment` -> Layar konfirmasi tagihan dan info transfer.

**B. Alur QR Masuk (Check-in):**
Menggunakan komponen terkurung (*constrained*) agar proporsional di layar *mobile* dan tidak merusak *wrapper* utama.

---

## 9. Frontend Implementation Tracker
- [x] **Setup & Routing Utama:** Autentikasi Clerk dan proteksi Middleware.
- [x] **UI Komponen Statis:** Halaman Beranda, Panduan, Profil.
- [x] **Eksekusi QR Code & Daily Pass:** Fitur aktif namun membutuhkan perbaikan skala UI (UI Scaling).
- [x] **UI Scaling Refinement:** Memperbaiki ukuran teks, padding `/packages`, dan mencegah overflow pada QR Code.
- [ ] **`app/member/payment`:** Membuat halaman konfirmasi tagihan (Bill Payment).
- [ ] **`app/member/booking` & `/schedule`:** UI Katalog kelas dan Jadwal Pribadi.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.5 & 1.6:** Alur pembelian paket dan pemisahan logika Booking vs Jadwal.
* **v1.7:** Instalasi *library* QR Code dan penambahan Daily Pass.
* **v1.8 (Current):** Perbaikan *Mobile UI Scaling*, pencegahan *layout overflow* pada QR Code, dan penyederhanaan paket menjadi VIP & Visit Harian.