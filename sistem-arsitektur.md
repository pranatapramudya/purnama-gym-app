# Dokumentasi Sistem dan Arsitektur: Purnama Gym

Dokumen ini merangkum seluruh logika bisnis, struktur *database*, dan arsitektur teknologi yang membentuk sistem informasi manajemen Purnama Gym.

## A. Teknologi Utama (Tech Stack)
Aplikasi Purnama Gym dibangun di atas teknologi *modern web development*:
- **Next.js 15+ (App Router):** Sebagai fondasi utama *framework full-stack* untuk merender halaman secara hibrida (Server dan Client) dan menangani *Server Actions*.
- **Tailwind CSS:** *Framework CSS utility-first* untuk mendesain antarmuka secara responsif, modern, dan elegan (tema hijau *emerald* dan merah muda *rose* khusus wanita).
- **Clerk Authentication:** Layanan *Identity and Access Management* (IAM) siap pakai untuk menangani pendaftaran, *login*, sesi, dan keamanan akun.
- **Neon DB (Serverless PostgreSQL):** Layanan basis data *serverless* berbasis PostgreSQL yang sangat ringan dan mudah diskalakan.
- **Prisma ORM:** *Object-Relational Mapping* tipe aman (*type-safe*) yang menghubungkan aplikasi dengan *database* Neon.

## B. Arsitektur Database & Relasi (Prisma Schema)
Sistem memiliki beberapa model utama untuk mendukung alur operasional gym:
- **`User`:** Entitas utama member/admin. Menyimpan informasi seperti `clerkUserId` (untuk pemetaan IAM), `role` (hak akses), dan `endDate` (masa aktif membership VIP/Reguler).
- **`GymClass`:** Menyimpan informasi jadwal kelas kebugaran (Zumba, Pilates, dll.) lengkap dengan tanggal pelaksanaan (`schedule`) dan kuota maksimal (`capacity`).
- **`ClassBooking` (Booking):** Tabel pivot/relasi yang mencatat partisipasi pengguna (Member) ke dalam sebuah Kelas tertentu.
- **`Transaction`:** Tabel pencatatan riwayat pembayaran paket atau kunjungan harian (*Visit*) secara manual. Memiliki kolom `amount`, `status` (PENDING/SUCCESS), dan dicatat secara lokal.
- **`MembershipPackage`:** *Master data* statis yang menyimpan daftar harga dan durasi langganan (VIP/Reguler).
- **`GuideVideo`:** Tabel untuk manajemen video panduan olahraga (berupa tautan YouTube) untuk pengguna.

## C. Sistem Autentikasi & Otorisasi
### Sinkronisasi Clerk - Database (Webhook)
Aplikasi mengandalkan titik akhir Webhook Clerk (`/api/webhooks/clerk`) yang memantau *event* `user.created` dan `user.updated`. Saat ada pengguna baru yang mendaftar melalui antarmuka Clerk, Webhook secara *real-time* menyuntikkan data tersebut ke dalam tabel `User` di Prisma, memastikan data pengguna terpusat.

### Role-Based Access Control (RBAC)
Pengguna dibedakan berdasarkan status yang tersimpan pada atribut `role` di tabel pengguna:
- **ADMIN:** Memiliki hak akses khusus ke `/admin/...`. Bertanggung jawab untuk menyetujui transaksi (Kasir), mengatur jadwal kelas, mengelola paket, dan memindai QR Code masuk member.
- **MEMBER (Reguler/VIP):** Memiliki akses ke ruang `/member/...` untuk melakukan pendaftaran kelas (*booking*), pembelian harian, menampilkan QR Code profil, dan melihat riwayat transaksinya.

## D. Alur Bisnis Utama (Business Workflows)
### 1. Alur Pembayaran Kasir (QRIS/Tunai Manual)
Sistem memprioritaskan alur pembayaran tatap muka (*offline*) di meja Kasir, tanpa mengandalkan *Payment Gateway* pihak ketiga:
1. Member menekan tombol konfirmasi pembuatan pesanan (pada layar detail paket/visit).
2. Sistem mencatat di tabel `Transaction` dengan status `PENDING`.
3. Member menunjukkan instruksi QRIS/Tunai di layar kepada Admin di lokasi fisik (gym).
4. Admin masuk ke Dasbor Admin (`/admin/transactions`), menerima dana dari pengguna, lalu menekan "Verifikasi" yang mengubah status pesanan menjadi `SUCCESS` dan sekaligus memperbarui `endDate` (masa aktif) member secara matematis.

### 2. Alur Booking Kelas
1. Member dapat melihat kelas-kelas *upcoming* yang ditarik secara dinamis dari tabel `GymClass`.
2. Saat tombol "Daftar" ditekan, *Server Action* memvalidasi dua aspek krusial:
   - **Kapasitas (Slot):** Mencegah pendaftaran jika jumlah relasi `ClassBooking` sudah setara dengan batas maksimum `capacity`.
   - **Double-Booking:** Mencegah satu `userId` yang sama mendaftar ke `classId` yang sama berulang kali. Sistem akan memunculkan *Toast Error* sebagai *feedback* instan ke pengguna.

### 3. Alur QR Code Check-in (Kehadiran)
Setiap member memiliki "Kartu Digital" yang merender ID Unik mereka sebagai QR Code. 
Admin mengakses fitur `/admin/scanner` dan menggunakan kamera perangkat lunaknya untuk membaca QR Code tersebut. Setelah terpindai, sistem mencatatkan entri ke dalam tabel `CheckIn` yang menyimpan rekam jejak historis kehadiran member di fasilitas kebugaran.

## E. Struktur Antarmuka & UX
Sistem memisahkan struktur komponen dengan sangat tegas antara lingkungan klien (*Client Components* menggunakan indikator `"use client"`) untuk menangani *state* interaksi tombol, formulir, dan modal, sedangkan *Server Components* dan *Server Actions* digunakan untuk mengakses Prisma secara aman tanpa mengekspos *database* ke sisi peramban pengguna.
Dari sisi *User Experience* (UX), aplikasi memprioritaskan gaya tata letak Navigasi Bawah (*Bottom Navigation Bar*) bergaya *app-like* untuk mempermudah operasional melalui telepon genggam (*mobile-first*). Sentuhan warna modern disesuaikan menggunakan varian *Emerald* dan *Rose* untuk memberikan nuansa premium eksklusif.
