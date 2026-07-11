# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.3  
**Status:** Updated Specification (Light Mode UI + Frontend Tracker)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+ (PgAdapter), Neon DB (Serverless PostgreSQL), Clerk Authentication, Lucide React.

---

## 1. Ringkasan Produk (Product Overview)
Purnama Gym adalah sebuah aplikasi manajemen fitness center berbasis web responsif yang dirancang khusus untuk operasional gym wanita-only di Sumedang. Aplikasi ini memfasilitasi kebutuhan dua sisi pengguna utama: **Staf Gym (Admin/Kasir)** untuk memantau kehadiran, transaksi keuangan, dan keanggotaan; serta **Pelanggan (Member Regular & VIP)** untuk memiliki kartu digital, melakukan check-in mandiri lewat QR Code, serta melihat status langganan[cite: 3].

### Latar Belakang & Masalah
* Operasional manual rawan kebocoran kasir dan pencatatan member kedaluwarsa yang tidak akurat[cite: 3].
* Pemilik (Owner) berada di luar kota (Bangka) sehingga memerlukan sistem terpusat berbasis cloud untuk memantau bisnis dari jarak jauh[cite: 3].
* Privasi tinggi diperlukan karena gym ini bersifat *women-only*, sehingga proses pendaftaran dan akses masuk memerlukan verifikasi yang ketat[cite: 3].

---

## 2. Struktur Peran Pengguna (User Roles & Permissions)
*(Sama seperti Versi sebelumnya, meliputi Member Regular, VIP, dan Admin/Kasir)*[cite: 3]

---

## 3. Fitur Utama & Kebutuhan Frontend (Core Features Matrix)
*(Sama seperti Versi sebelumnya, mencakup Dashboard Member, QR Code JWT, Booking Kelas, dan Modul POS Kasir)*[cite: 3]

---

## 4. Rancangan Struktur Database (Prisma Schema Reference)
Skema database dirancang relasional menggunakan PostgreSQL untuk menjamin performa transaksi kasir yang solid:
Terdapat tabel `User`, `Transaction`, `CheckIn`, `GymClass`, dan `ClassBooking`[cite: 3].

---

## 5. Alur Validasi & Integrasi Clerk
* **Pendaftaran via Clerk:** User mendaftar melalui komponen Clerk[cite: 3].
* **Webhook Sync (user.created):** Saat user mendaftar, Clerk mengirimkan event Webhook ke endpoint Next.js `/api/webhooks/clerk`. Backend memvalidasi payload dan membuat data `User` di database PostgreSQL[cite: 3].

---

## 6. Kriteria Keberhasilan (Success Criteria)
* **Akses Keamanan:** Pengguna non-login tidak dapat menembus halaman dashboard. QR Code dilindungi validasi JWT sehingga aman dari penyalahgunaan[cite: 3].
* **Kecepatan Kasir:** Proses transaksi perpanjangan lewat admin POS selesai di bawah 2 detik[cite: 3].
* **Visibilitas Jarak Jauh:** Seluruh data transaksi tercatat rapi secara real-time untuk pemantauan Owner dari luar kota[cite: 3].

---

## 7. Design System & UI/UX Guidelines
*   **Tema Utama:** "Clean & Elegant Light Mode" (Premium Women-Only).
*   **Palet Warna:** 
    *   Background Utama: Putih Bersih (`bg-white` atau `bg-slate-50`) untuk kesan segar, luas, dan ramah.
    *   Aksen/Kartu Member: Pink / Rose Gold yang menonjol dan elegan.
    *   Teks: Gelap (`text-slate-900`) untuk kontras keterbacaan yang maksimal.
*   **Landing Page (Halaman Utama):**
    *   Hero Section: Nama "Purnama Gym" dengan tagline "Ruang Kebugaran Eksklusif Khusus Wanita di Sumedang".
    *   Tombol Call-to-Action (CTA): "Masuk / Daftar Sekarang".
*   **Responsivitas:** Wajib *mobile-first*. Menggunakan navigasi bawah (Bottom Navigation) bergaya aplikasi native.

---

## 8. Alur Frontend Saat Ini (Fokus Member)
1.  **Landing Page (`app/page.tsx`):** Halaman penyambutan publik. **Wajib melakukan bypass/redirect ke `/member/dashboard` jika user sudah terautentikasi.**
2.  **Auth (Clerk):** Halaman login/register.
3.  **Member Dashboard (`app/member/dashboard/page.tsx`):**
    *   Dialihkan otomatis ke sini setelah login jika role-nya `MEMBER_REGULAR` atau `MEMBER_VIP`[cite: 3].
    *   Menampilkan sapaan nama user[cite: 3].
    *   Menampilkan Kartu Keanggotaan Digital[cite: 3].

---

## 9. Frontend Implementation Tracker
Daftar checklist progres pengerjaan UI Halaman Member agar tidak tumpang tindih:

- [x] **Setup & Routing Utama:** Autentikasi Clerk dan proteksi Middleware selesai.
- [x] **`app/member/dashboard` (Beranda):** Kartu Member Digital dan tombol QR Code selesai.
- [x] **Bottom Navigation (`<BottomNav/>`):** Ditempatkan di layout utama mencakup 4 menu (Beranda, Jadwal, Panduan, Profil).
- [x] **`app/member/classes` (Jadwal):** UI Daftar kelas (Zumba/Yoga) dengan status kuota dan tombol booking.
- [x] **`app/member/guide` (Panduan):** UI Katalog tutorial alat gym dan program latihan (Fitur khusus untuk mengatasi kebingungan member wanita pemula).
- [x] **`app/member/profile` (Profil & Riwayat):** UI Informasi akun, sisa masa aktif, dan menu untuk melihat riwayat check-in/pembayaran.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v1.0:** Inisiasi PRD dan rancangan arsitektur database.
* **v1.1:** Setup Clerk Webhook untuk sinkronisasi otomatis user ke Neon DB.
* **v1.2:** Pembersihan sisa *template boilerplate* lama (LumeStack/Gumroad).
* **v1.3 (Current):** Transisi ke Light Mode UI, perbaikan alur *bypass* Landing Page setelah login, dan penambahan fitur *Guide* (Panduan Alat Gym) untuk Member.