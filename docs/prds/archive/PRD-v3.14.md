# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.14  
**Status:** Phase 3.14 - Final Documentation & Architecture Mapping  

---

## 1. Objektif Utama
Memperbarui file `README.md` bawaan boilerplate menjadi identitas resmi "Purnama Gym", serta membuat file dokumentasi baru bernama `sistem-arsitektur.md` yang merangkum seluruh logika bisnis, struktur database, dan arsitektur teknologi yang telah kita bangun hingga saat ini.

---

## 2. Pembaruan File `README.md`
Tugas Agen: Edit file `README.md` di *root directory*.
- Ganti judul dari "LumeStack - Premium SaaS Boilerplate 2026"[cite: 1] menjadi **"Purnama Gym - Sistem Manajemen Keanggotaan & Kasir"**.
- Sesuaikan deskripsi menjadi: "Sistem informasi manajemen gym modern khusus wanita di Sumedang, dilengkapi dengan fitur booking kelas, membership VIP, dan pemindai QR Code."
- Tetap pertahankan bagian teknis yang krusial seperti panduan instalasi dependensi (`npm install`)[cite: 1], pengaturan Environment Variables (Clerk & Neon DB)[cite: 1], serta langkah-langkah *Database Sync* (`npx prisma generate`, dll)[cite: 1].
- Pertahankan instruksi penting mengenai "Clerk Webhook Setup"[cite: 1] karena ini krusial untuk sinkronisasi data *user*.
- Ubah bagian *footer* (Built with...)[cite: 1] agar lebih sesuai dengan proyek Purnama Gym.

---

## 3. Pembuatan File Baru: `sistem-arsitektur.md`
Tugas Agen: Buat file baru bernama `sistem-arsitektur.md` di *root directory*. Tulis dengan format Markdown yang sangat rapi dan profesional. File ini HARUS mencakup bab-bab berikut:

**A. Teknologi Utama (Tech Stack)**
- Jelaskan penggunaan Next.js 15+ (App Router), Tailwind CSS, Clerk Authentication, Neon DB (Serverless PostgreSQL), dan Prisma ORM[cite: 1].

**B. Arsitektur Database & Relasi (Prisma Schema)**
- Buat daftar model utama yang kita gunakan beserta fungsinya: `User` (menyimpan role dan status keanggotaan), `GymClass` (jadwal kelas), `Booking` (relasi member dan kelas), `Transaction` (pencatatan pembayaran manual), `MembershipPackage` (daftar harga paket), dan `GuideVideo`.

**C. Sistem Autentikasi & Otorisasi**
- Jelaskan penggunaan Clerk Webhook (`user.created`, `user.updated`) untuk menyinkronkan data profil dari Clerk ke tabel `User` di Prisma[cite: 1].
- Jelaskan pemisahan peran (*Role-Based Access Control*):
  - **ADMIN:** Mengakses `/admin/...`, mengelola kelas, memverifikasi transaksi, dan menggunakan QR Scanner.
  - **MEMBER:** Mengakses `/member/...`, mendaftar kelas, dan melihat riwayat.

**D. Alur Bisnis Utama (Business Workflows)**
- **1. Alur Pembayaran Kasir (QRIS/Tunai Manual):** Jelaskan bahwa sistem tidak menggunakan *Payment Gateway* pihak ketiga. Transaksi dari member berstatus `PENDING`, dan Admin bertugas mengubahnya menjadi `SUCCESS` di Dasbor Admin, yang secara otomatis memperbarui `endDate` (masa aktif) member tersebut.
- **2. Alur Booking Kelas:** Jelaskan mekanisme pencegahan *Double-Booking* dan pengurangan slot kuota.
- **3. Alur QR Code Check-in:** Jelaskan bagaimana Admin menggunakan `/admin/scanner` untuk memindai ID Member dan mencatat kehadiran.

**E. Struktur Antarmuka & UX**
- Jelaskan pemisahan layout antara *Client Components* (UI interaktif) dan *Server Components* / *Server Actions* (Mutasi data yang aman).
- Sebutkan penggunaan gaya UI modern (Tema hijau gradasi, *Bottom Navigation* untuk mobile admin, dan integrasi komponen *toast/alerts*).

---

## 4. Standar Eksekusi
- Gunakan Bahasa Indonesia yang baku, profesional, dan mudah dipahami oleh *Software Engineer* lain.
- Pastikan tidak ada referensi bawaan *boilerplate* SaaS lama yang tersisa di dalam `sistem-arsitektur.md`. Eksekusi pembuatan dan pembaruan dokumen ini sekarang!