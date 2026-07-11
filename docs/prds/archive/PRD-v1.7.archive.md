# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.7  
**Status:** Updated Specification (Daily Pass & QR Code Implementation)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines (Mobile Wrapper) tetap sama.*

---

## 8. Alur Frontend Saat Ini (Fokus Member)
**A. Alur QR Masuk (Check-in):**
1. `app/member/dashboard` -> User klik tombol 'QR Masuk'.
2. Sistem me-render komponen `<QRCode />` yang berisi data unik (User ID dari Clerk). Halaman ini dirancang terang (kecerahan layar maksimal) agar mudah di-scan oleh *scanner* kasir.

**B. Alur Pembelian Paket:**
1. `app/member/dashboard` -> User klik tombol 'Beli / Perpanjang Paket'.
2. `app/member/packages` -> User memilih paket. Terdapat 3 kategori utama: **VIP Membership**, **Regular Membership**, dan **Daily Pass (Harian)**.
3. `app/member/payment` -> Layar konfirmasi *Bill Payment*.

---

## 9. Frontend Implementation Tracker
- [x] **Setup & Routing Utama:** Autentikasi Clerk dan proteksi Middleware.
- [x] **UI Komponen Statis:** Halaman Beranda, Panduan, Profil.
- [x] **`app/member/packages`:** UI daftar harga langganan VIP dan Regular.
- [x] **Eksekusi Daily Pass:** Menambahkan kartu 'Paket Harian' di halaman Packages.
- [x] **Eksekusi QR Code:** Instalasi `react-qr-code` dan merender QR Code aktif berbasis data *user* yang sedang login.
- [x] **`app/member/payment`:** Membuat halaman konfirmasi tagihan (Bill Payment).
- [x] **`app/member/booking` & `/schedule`:** UI Katalog kelas dan Jadwal Pribadi.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.5:** Penambahan inisiasi tombol beli paket dan booking kelas.
* **v1.6:** Pemisahan logika Katalog Booking dan Jadwal Pribadi.
* **v1.7 (Current):** Penambahan opsi Daily Pass di dalam aplikasi dan implementasi *library* pembuat QR Code.