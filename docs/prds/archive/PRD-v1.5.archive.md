# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.5  
**Status:** Updated Specification (Membership Purchase Flow & Booking)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+ (PgAdapter), Neon DB, Clerk Authentication, Lucide React.

---

## 1-2. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Ringkasan produk dan peran pengguna tetap mengacu pada spesifikasi v1.4. Semua member (Reguler & VIP) menggunakan aplikasi yang sama, hanya dibedakan berdasarkan hak akses antarmuka (Role-based UI).*

---

## 3. Fitur Utama & Kebutuhan Frontend (Core Features Matrix)

### Halaman Frontend Pengguna (Member View)
1.  **Katalog & Pembelian Paket (Baru):**
    *   Terdapat opsi pembelian paket membership: Regular & VIP.
    *   Durasi yang tersedia: 1 Bulan, 3 Bulan, 6 Bulan, 12 Bulan.
    *   **Logika Tiket Harian:** Untuk paket harian (Insidental), sistem mengarahkan member untuk "Bayar di Kasir" secara manual guna menghindari potongan *fee payment gateway* untuk nominal kecil.
2.  **Beranda Member (Dashboard):**
    *   Menampilkan Kartu Keanggotaan Digital.
    *   Memiliki menu cepat: 'QR Masuk', 'Booking Kelas' (Aktif), dan tombol baru **'Beli / Perpanjang Paket'**.
3.  **Halaman Benefit & Booking Kelas:**
    *   Menampilkan jadwal kelas.
    *   Tombol *Booking* diaktifkan. Jika user adalah `MEMBER_REGULAR`, muncul peringatan *Upgrade to VIP*. Jika `MEMBER_VIP`, kuota booking akan berkurang.

*(Fitur QR Check-in dan Modul Admin POS tetap sama seperti spesifikasi v1.4)*

---

## 7. Design System & UI/UX Guidelines
*   **Constraint Layout (Mobile-First):** Aplikasi wajib dibungkus dalam *container* maksimal sebesar layar ponsel standar (`max-w-md mx-auto`) di seluruh halaman Member.

---

## 8. Alur Frontend Saat Ini (Fokus Member)
1.  **Member Dashboard & Fitur:** 
    *   Beranda (`/dashboard`): Kartu digital, menu QR, menu Booking, dan CTA Pembelian Paket.
    *   Jadwal (`/classes`): Katalog kelas & booking.
    *   Katalog Paket (`/packages`): Menampilkan pilihan durasi berlangganan 1, 3, 6, 12 bulan.

---

## 9. Frontend Implementation Tracker
- [x] **Setup & Routing Utama:** Autentikasi Clerk dan proteksi Middleware selesai.
- [x] **UI Komponen Statis:** Halaman Beranda, Jadwal, Panduan, Profil, dan Mobile Wrapper.
- [x] **Interaktivitas UI:** Menyambungkan *routing* antar menu `<BottomNav/>` dan mengaktifkan tombol klik (Booking & Beli Paket).
- [ ] **`app/member/packages` (Katalog):** Membuat UI daftar harga untuk langganan Regular dan VIP.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.3:** Transisi ke Light Mode UI dan penambahan fitur *Guide*.
* **v1.4:** Penegasan *Mobile Wrapper Constraints*.
* **v1.5 (Current):** Penambahan alur pembelian paket (durasi 1-12 bulan), perlakuan manual untuk paket harian di kasir, dan pengaktifan tombol interaksi Booking Kelas.