# 🏗️ Arsitektur Sistem Purnama Gym (Dokumen Komprehensif)

Dokumen ini merangkum secara profesional seluruh struktur tingkat tinggi, logika bisnis, arsitektur *database*, dan alur kerja aplikasi **Purnama Gym**. Sistem ini didesain untuk skalabilitas SaaS (Software as a Service) dan performa operasional tingkat Enterprise.

---

## 💻 1. Teknologi Utama (Tech Stack Induk)
Aplikasi dibangun menggunakan pondasi modern web development yang mengedepankan keamanan dan kecepatan:
- **Framework:** Next.js 15+ (mengandalkan kekuatan *App Router* dan *React Server Components* / RSC untuk performa hibrida).
- **Styling:** Tailwind CSS (dengan integrasi komponen modular, menggunakan tema *Emerald* untuk UX yang menenangkan).
- **Authentication & Identity:** Clerk (menangani *Single Sign-On*, registrasi instan, sesi, dan otorisasi *edge-level*).
- **Database & ORM:** PostgreSQL serverless (Neon DB) yang dikelola dengan presisi dan *type-safe* melalui Prisma ORM.

---

## 🗄️ 2. Arsitektur Database & Relasi (Prisma Schema)
Sistem memiliki beberapa entitas/model utama untuk mendukung seluruh alur operasional gym:
- **`User`:** Entitas utama. Menyimpan `clerkUserId` (untuk pemetaan IAM), `role` (hak akses), `phoneNumber`, `address`, dan `endDate` (masa aktif membership VIP/Reguler).
- **`GymClass`:** Menyimpan informasi jadwal kelas kebugaran (Zumba, Pilates, dll.) lengkap dengan tanggal pelaksanaan (`schedule`) dan kuota maksimal (`capacity`).
- **`ClassBooking`:** Tabel pivot/relasi yang mencatat partisipasi pengguna (Member) ke dalam sebuah Kelas tertentu.
- **`Transaction`:** Pencatatan riwayat pembayaran paket atau kunjungan harian (*Visit*) secara manual. Memiliki kolom `amount`, `status` (PENDING/SUCCESS).
- **`MembershipPackage`:** *Master data* statis yang menyimpan daftar harga dan durasi langganan (VIP/Reguler).
- **`GuideVideo`:** Tabel untuk manajemen video panduan olahraga (tautan YouTube).
- **`CheckIn`:** Tabel rekam jejak historis kehadiran member yang dipicu melalui *Scan* QR Code.

---

## 🔐 3. Alur Autentikasi, Otorisasi, & Sinkronisasi Data
Sistem autentikasi didesain untuk meminimalisasi *friction* sekaligus menjaga keutuhan data (Data Integrity) secara kokoh.

### A. Alur Pendaftaran (Auth Flow)
1. **Sign Up (Clerk):** Pengguna mendaftar instan menggunakan akun Google/Email melalui UI Clerk.
2. **Global Redirect Interception:** Pasca-login, sistem *middleware* Next.js memblokir akses ke *Landing Page* dan memaksa navigasi langsung ke area `/member/dashboard`.
3. **Custom Onboarding Flow (Bypass Clerk Pro):** Sistem *Nested Layout* (`app/member/layout.tsx`) akan mencegat pengguna baru jika data wajib (Nomor HP & Alamat) masih kosong. Pengguna akan dialihkan ke `/onboarding` untuk mengisi data secara mandiri ke *database* kita, menghemat biaya verifikasi OTP SMS bawaan *Auth Provider*.

### B. Robust Data Sync (Sinkronisasi Database)
- **Sinkronisasi Webhook vs Upsert Atomic:** Meskipun ada *Webhook* (`/api/webhooks/clerk`) untuk memantau pengguna baru secara asinkron, aplikasi ini juga menerapkan logika **`prisma.user.upsert`** yang reaktif di dalam *layout* utama.
- **Kekebalan Data:** Logika *upsert* atomik ini bertumpu pada `email` utama pengguna, sehingga secara elegan mengeliminasi resiko eror *fatal* (`Unique constraint failed`) yang biasa terjadi jika pengguna menghapus dan mendaftarkan ulang akunnya di *provider*. Nama pengguna (`fullName`) diinjeksi secara otomatis ke sistem internal.

---

## 🏛️ 4. Akses Berbasis Peran & Pemisahan Layout (RBAC)
Aplikasi secara arsitektural membelah diri menjadi dua ekosistem dengan UI/UX dan logika keamanan yang sangat berbeda berdasarkan nilai `role` pengguna.

### Area Anggota (`/member/...`) untuk `MEMBER_REGULAR` & `MEMBER_VIP`
- **Antarmuka:** Diselimuti oleh *Mobile-First Bottom Navigation Layout* bergaya *app-like* untuk mempermudah operasional via *smartphone*.
- **Akses:** Memuat interaksi kasual seperti Dasbor, Profil Read-Only/Edit, *Booking* PT, dan QR E-Card dinamis (Kartu Emas "Black Card" eksklusif untuk VIP).
- **Proteksi Anti-Looping:** Transaksi pembelian VIP dijaga ketat agar tombol pendaftaran mati (*disabled*) selama masa aktif VIP masih berlaku.

### Dasbor Admin B2B (`/admin/...`) untuk `ADMIN`
- **Antarmuka:** Diselimuti oleh *Desktop-First Sidebar Layout* kelas premium (SaaS UI). Pada perangkat *mobile*, tabel data raksasa diubah secara dinamis menjadi Kartu Informasi bertumpuk (*Table-to-Card adaptive pattern*) guna mencegah *horizontal scroll* yang merusak UX.
- **Hidden Trigger Entrance:** Karena portal administrasi bersifat rahasia, akses Login Admin tidak diekspos secara publik. Admin harus menekan sebuah tuas tersembunyi (*Hidden Trigger*) di *Footer Landing Page* untuk memunculkan portal login khusus *Split-Screen*.
- **Gatekeeper Middleware:** Upaya akses ke `/admin` akan divalidasi langsung ke *database*. Akun biasa akan segera ditendang (*kicked out*).

---

## 🔄 5. Alur Bisnis Operasional (Business Workflows)

### 1. Alur Pembayaran Kasir (Offline-First)
Sistem memprioritaskan alur pembayaran manual (QRIS/Tunai) di meja Kasir untuk memotong biaya *Payment Gateway*:
1. Member memilih paket dan mencetak transaksi (*Checkout*), sistem mencatat di tabel `Transaction` dengan status `PENDING`.
2. Member menunjukkan layar ke Kasir di lokasi fisik.
3. Admin masuk ke `/admin/transactions`, menerima dana, lalu menekan "Setujui".
4. *Server Action* memproses penyetujuan, mengubah status menjadi `SUCCESS`, dan menetapkan `endDate` (masa aktif) member secara absolut ketat (tepat 1 bulan ke depan untuk VIP).

### 2. Alur Booking Kelas (Validasi Kuota & Anti Double-Booking)
1. Member mendaftar ke kelas yang tersedia melalui Dasbor Member.
2. *Server Action* memvalidasi dua lapis keamanan:
   - **Kapasitas:** Mencegah pendaftaran jika jumlah partisipan di `ClassBooking` sudah melampaui `capacity`.
   - **Double-Booking:** Mencegah satu pengguna mendaftar ke kelas yang sama berulang kali.

### 3. Alur QR Code Check-in Kehadiran
Setiap member memiliki "Kartu Digital" bertenaga QR Code yang unik. Admin di meja depan (*Front Desk*) menggunakan menu `/admin/scanner` dengan kamera web bawaan untuk memindai QR Code tersebut. Setelah terpindai sukses, *check-in* dicatat ke dalam rekam jejak kehadiran secara permanen.
