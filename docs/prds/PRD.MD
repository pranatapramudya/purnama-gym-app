# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 1.2  
**Status:** Updated Specification (Post-Audit + UI/UX)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+ (PgAdapter), Neon DB (Serverless PostgreSQL), Clerk Authentication, Lucide React.

---

## 1. Ringkasan Produk (Product Overview)
Purnama Gym adalah sebuah aplikasi manajemen fitness center berbasis web responsif yang dirancang khusus untuk operasional gym wanita-only di Sumedang. Aplikasi ini memfasilitasi kebutuhan dua sisi pengguna utama: **Staf Gym (Admin/Kasir)** untuk memantau kehadiran, transaksi keuangan, dan keanggotaan; serta **Pelanggan (Member Regular & VIP)** untuk memiliki kartu digital, melakukan check-in mandiri lewat QR Code, serta melihat status langganan.

### Latar Belakang & Masalah
* Operasional manual rawan kebocoran kasir dan pencatatan member kedaluwarsa yang tidak akurat.
* Pemilik (Owner) berada di luar kota (Bangka) sehingga memerlukan sistem terpusat berbasis cloud untuk memantau bisnis dari jarak jauh.
* Privasi tinggi diperlukan karena gym ini bersifat *women-only*, sehingga proses pendaftaran dan akses masuk memerlukan verifikasi yang ketat.

---

## 2. Struktur Peran Pengguna (User Roles & Permissions)

Sistem membagi pengguna ke dalam tiga tingkatan hak akses utama:

### A. Member Regular (Biasa)
* Mengakses halaman beranda personal khusus member.
* Melihat kartu keanggotaan digital (Nama, Status Aktif, Tanggal Berakhir).
* Mempunyai QR Code Dinamis berbasis JWT (berbatas waktu) untuk scan kedatangan di resepsionis.
* Melihat katalog kelas umum (misal: area kardio & angkat beban standar).
* Melihat riwayat transaksi dan check-in mandiri.

### B. Member VIP
* Memiliki semua hak akses Member Regular.
* Mendapatkan indikator visual premium (*Badge VIP*) di profil dan kartu digital mereka.
* Mengakses halaman booking kelas eksklusif (misal: Zumba, Pilates, Yoga) yang memiliki kuota terbatas.
* Melihat keuntungan tambahan (misal: fasilitas loker privat atau konsultasi insting fitnes gratis).

### C. Admin / Kasir (Staf Lokasi) & Owner
* Mengakses dashboard analitik utama (Metrik pendapatan harian/bulanan, grafik kunjungan member harian).
* Mengoperasikan modul Point of Sale (POS) Kasir untuk mendaftarkan member baru, memperpanjang paket, atau menjual tiket harian secara tunai/transfer.
* Melihat tabel data seluruh pelanggan beserta status filter (Aktif, Kedaluwarsa, VIP).
* Melakukan verifikasi pendaftaran member baru untuk menjaga privasi lingkungan gym wanita.

---

## 3. Fitur Utama & Kebutuhan Frontend (Core Features Matrix)

### Halaman Frontend Pengguna (Member View)
1.  **Halaman Autentikasi (Sign In / Sign Up):** Dihandle secara penuh menggunakan Clerk.
2.  **Beranda Member (Dashboard):**
    * Sapaan dinamis (e.g., "Halo, Kak Sisca!").
    * Komponen *Membership Card* digital dengan animasi transisi rapi. Jika VIP, kartu berwarna gelap elegan dengan kilau emas/silver. Jika Regular, warna segar bernuansa ramah wanita.
    * **[Fitur Baru] Peringatan Kedaluwarsa (Expiring Warning):** Banner kuning pengingat masa aktif muncul jika masa keanggotaan tersisa ≤ 7 hari.
3.  **Halaman QR Code Check-In:**
    * Menampilkan QR Code dinamis dan aman (terenkripsi JWT yang hanya valid 60 detik) untuk mencegah kecurangan *screenshot*.
    * Teks instruksi: "Tunjukkan QR Code ini ke kasir untuk masuk".
4.  **Halaman Benefit & Booking Kelas (Khusus VIP):**
    * Menampilkan daftar kelas khusus lengkap dengan sisa slot kuota.
    * Tombol *Booking* terintegrasi langsung dengan Server Actions Prisma.
    * **[Fitur Baru] Pembatalan Kelas:** Fitur Cancel Booking (maksimal 2 jam sebelum kelas mulai) agar kuota bisa kembali tersedia.

### Halaman Frontend Staf (Admin & Kasir View)
1.  **Dashboard Utama Staf:**
    * Metrik kartu: Total Pendapatan, Total Member Aktif, Jumlah Kehadiran Hari Ini.
2.  **Modul Kasir POS:**
    * Form pencarian member atau tambah member baru.
    * Dropdown pilihan paket: Harian, Bulanan, VIP, Paket Zumba.
    * **[Perbaikan Logika] Perhitungan endDate:** Saat perpanjangan, jika member masih aktif, endDate ditambah dari sisa hari. Jika sudah kedaluwarsa, endDate dihitung +30 hari dari tanggal transaksi berjalan.
3.  **Tabel Monitor Kehadiran:**
    * Daftar *live feed* hasil pemindaian QR Code di resepsionis.
    * **[Perbaikan Logika] Validasi Check-In:** Cegah Check-In berulang (Anti-Spam jeda 2-3 jam). Jika member kedaluwarsa, sistem otomatis menolak Check-In dan menampilkan layar merah untuk mengarahkan member melakukan pembayaran perpanjangan.

---

## 4. Rancangan Struktur Database (Prisma Schema Reference)

Skema database dirancang relasional menggunakan PostgreSQL untuk menjamin performa transaksi kasir yang solid:
Terdapat tabel `User`, `Transaction`, `CheckIn`, `GymClass`, dan `ClassBooking`.

---

## 5. Alur Validasi & Integrasi Clerk

* **Pendaftaran via Clerk:** User mendaftar melalui komponen Clerk.
* **[Perbaikan Alur] Webhook Sync (user.created):** Saat user mendaftar, Clerk mengirimkan event Webhook ke endpoint Next.js `/api/webhooks/clerk`. Backend akan memvalidasi payload dan langsung membuat data `User` di database PostgreSQL. Mekanisme ini menjamin tidak ada *race condition* atau data user yang gagal tersimpan ke DB.
* Jika admin mengubah akun menjadi VIP di Dashboard, nilai role berganti jadi `MEMBER_VIP` secara sekuensial.

---

## 6. Kriteria Keberhasilan (Success Criteria)
* **Akses Keamanan:** Pengguna non-login tidak dapat menembus halaman dashboard. QR Code dilindungi validasi JWT sehingga aman dari penyalahgunaan.
* **Kecepatan Kasir:** Proses transaksi perpanjangan lewat admin POS selesai di bawah 2 detik.
* **Visibilitas Jarak Jauh:** Seluruh data transaksi tercatat rapi secara real-time untuk pemantauan Owner dari luar kota.

---

## 7. Design System & UI/UX Guidelines
*   **Tema Utama:** "Elegant Lunar" (Premium Women-Only).
*   **Palet Warna:** 
    *   Background Utama: Midnight Purple/Dark Navy (elegan, menenangkan).
    *   Aksen/Tombol: Rose Gold atau Soft Violet (feminin, berenergi, eksklusif).
    *   Teks: Putih cerah atau abu-abu terang untuk kontras yang baik.
*   **Landing Page (Halaman Utama):**
    *   Hero Section: Menampilkan nama "Purnama Gym" dengan tagline "Ruang Kebugaran Eksklusif Khusus Wanita di Sumedang".
    *   Hapus semua tautan/tombol yang mengarah ke penjualan template (Gumroad/Pricing SaaS).
    *   Tombol Call-to-Action (CTA) hanya ada satu: "Masuk / Daftar" yang terhubung langsung ke Clerk Auth.
*   **Responsivitas:** Wajib *mobile-first*. Mengingat sebagian besar member akan membuka aplikasi via HP Android/iOS untuk keperluan scan QR Code.

---

## 8. Alur Frontend Saat Ini (Fokus Member)
1.  **Landing Page (`app/page.tsx`):** Halaman penyambutan publik.
2.  **Auth (Clerk):** Halaman login/register.
3.  **Member Dashboard (`app/member/dashboard/page.tsx`):**
    *   Dialihkan otomatis ke sini setelah login jika role-nya `MEMBER_REGULAR` atau `MEMBER_VIP`.
    *   Menampilkan sapaan nama user.
    *   Menampilkan Kartu Keanggotaan Digital (Desain terinspirasi dari kartu member premium).
    *   Terdapat navigasi mudah menuju halaman QR Code untuk Check-in.