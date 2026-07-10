# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.6  
**Status:** Updated Specification (Bill Payment & Booking Flow Logic)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+ (PgAdapter), Neon DB, Clerk Authentication, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Fokus pembaruan ada di alur Frontend. Spesifikasi inti, database, Clerk, dan UI Guidelines (Mobile Wrapper) tetap sama.*

---

## 8. Alur Frontend Saat Ini (Fokus Member)
**A. Alur Pembelian Paket (Membership Flow):**
1. `app/member/dashboard` -> User klik tombol 'Beli / Perpanjang Paket'.
2. `app/member/packages` -> User memilih durasi paket (1, 3, 6, 12 Bulan).
3. `app/member/payment` -> Layar *Bill Payment* (Invoice & Pilihan Metode Pembayaran).

**B. Alur Booking Kelas (Class Flow):**
1. `app/member/dashboard` -> User klik tombol 'Booking Kelas'.
2. `app/member/booking` -> Katalog Kelas. User memilih kategori (Zumba/Yoga) dan menekan tombol "Daftar".
3. `app/member/schedule` -> Jadwal Pribadi. Diakses dari Bottom Navigation menu 'Jadwal'. Menampilkan daftar kelas yang valid dan sudah di-booking oleh user.

---

## 9. Frontend Implementation Tracker
- [x] **Setup & Routing Utama:** Autentikasi Clerk dan proteksi Middleware selesai.
- [x] **UI Komponen Statis:** Halaman Beranda, Panduan, Profil, dan Mobile Wrapper.
- [x] **`app/member/packages` & `/payment`:** Membuat UI daftar harga langganan dan halaman konfirmasi tagihan (Bill Payment).
- [x] **`app/member/booking`:** UI Katalog kategori kelas untuk mendaftar.
- [x] **`app/member/schedule`:** UI Jadwal Kelas Pribadi (terintegrasi dengan Bottom Nav).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.4:** Penegasan *Mobile Wrapper Constraints*.
* **v1.5:** Penambahan inisiasi tombol beli paket dan booking kelas.
* **v1.6 (Current):** Pemisahan logika antara Katalog Booking (`/booking`) dengan Jadwal Pribadi (`/schedule`), serta penambahan alur *Bill Payment* (`/payment`).