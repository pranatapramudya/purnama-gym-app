# 🏗️ Arsitektur Sistem Purnama Gym (Dokumen Komprehensif)

Dokumen ini merangkum secara profesional seluruh struktur tingkat tinggi, logika bisnis, arsitektur *database*, dan alur kerja aplikasi **Purnama Gym**. Sistem ini didesain untuk skalabilitas SaaS (Software as a Service) dan performa operasional tingkat Enterprise.

---

## 💻 1. Teknologi Utama (Tech Stack Induk)
Aplikasi dibangun menggunakan pondasi modern web development yang mengedepankan keamanan dan kecepatan:
- **Framework:** Next.js 15+ (mengandalkan kekuatan *App Router* dan *React Server Components* / RSC untuk performa hibrida).
- **Styling:** Tailwind CSS (dengan integrasi komponen modular, menggunakan tema *Emerald* untuk UX yang menenangkan).
- **Authentication & Identity:** Clerk (menangani *Single Sign-On*, registrasi instan, sesi, dan otorisasi *edge-level*).
- **Database & ORM:** PostgreSQL serverless (Neon DB) yang dikelola dengan presisi dan *type-safe* melalui Prisma ORM.

### 📱 1.1 Responsive Layout Strategy (Table-to-Card)
Untuk mencegah masalah UX *horizontal scrolling* pada perangkat genggam, sistem menerapkan pola transformasi DOM tingkat lanjut tanpa melakukan duplikasi elemen (`display: none` trik ganda). 
- **Struktur Adaptif:** Elemen `<table>` utama diberikan kelas adaptif (contoh: `block md:table`), memaksa tabel menjadi tumpukan balok pada *mobile*, lalu kembali ke struktur *grid* tabel murni di *desktop*.
- **Penyembunyian Header:** Komponen `<thead>` dihilangkan pada *mobile* melalui `hidden md:table-header-group`.
- **Ekspansi Baris & Sel:** Setiap `<tr>` berubah menjadi kartu (`block md:table-row`), dan setiap `<td>` berubah menjadi baris *flexbox* berlabel (`block md:table-cell`). Kombinasi ini memberikan ilusi kartu aplikasi murni di telepon seluler tanpa menambah beban *Virtual DOM*.

### 🧩 1.2 Component & Hook Architecture
Aplikasi mengadopsi pendekatan *custom hooks* untuk abstraksi logika kompleks yang berulang, menjamin kode komponen klien tetap bersih dan terfokus pada presentasi UI.
- **`useResponsivePagination` Hook:** Hook utama penggerak fitur *Global Responsive Pagination*. Hook ini mendengarkan perubahan *viewport* (`window.innerWidth`) secara aman-SSR (terisolasi dalam `useEffect`). Jika lebar layar < 768px, batas data dipotong menjadi 5 item (mencegah *scroll fatigue*), sebaliknya 10 item pada *desktop*. Hook langsung mengeksekusi logika *slicing* pada memori tanpa membebani panggilan *database* berulang untuk *dataset* skala menengah.
- **State Management Strategy (URL-Based State):** Filter periode laporan (misal: "Bulan Ini" pada Scanner/PT) diikat secara ketat pada parameter URL (`?period=month`) ketimbang *local state*. Pola ini, yang dikombinasikan dengan `React.useTransition` dan `useRouter()`, menjamin navigasi *seamless*, *non-blocking UI update*, serta memungkinkan administrator untuk membagikan tautan URL laporan yang spesifik.

### 🕰️ 1.3 Timezone Handling Strategy (WIB Enforcement)
Seluruh logika waktu (`Date` parsing, kadaluwarsa sesi, `Auto-Selesai` jadwal PT, hingga batas kueri pelaporan) tidak pernah bergantung pada zona waktu perangkat pengguna lokal atau bawaan *server*. Semua perhitungan *server-side* (seperti `startOfDay`, `startOfWeek`, `startOfMonth`) secara dinamis di-kalkulasi dan dikalibrasi ketat ke zona waktu **Asia/Jakarta (WIB / UTC+7)** menggunakan manipulasi *offset* eksplisit. Hal ini menjamin resiliensi absolut terhadap anomali perbedaan zona waktu global, mencegah fenomena *data-bleeding*, dan melindungi pelaporan dari *bug offset* kronis yang lumrah terjadi pada *UTC-default serverless environments* (seperti Vercel).

----

## 🗄️ 2. Arsitektur Database & Relasi (Prisma Schema)
Sistem memiliki beberapa entitas/model utama untuk mendukung seluruh alur operasional gym:
- **`User`:** Entitas utama. Menyimpan `clerkUserId` (untuk pemetaan IAM), `shortId` (ID pendek unik untuk integrasi Universal QR Code), `role` (hak akses), `phoneNumber`, `address`, dan `endDate` (masa aktif membership VIP/Reguler).
- **`GymClass`:** Menyimpan informasi jadwal kelas kebugaran (Zumba, Pilates, dll.) lengkap dengan tanggal pelaksanaan (`schedule`) dan kuota maksimal (`capacity`).
- **`ClassBooking`:** Tabel pivot/relasi yang mencatat partisipasi pengguna (Member) ke dalam sebuah Kelas tertentu.
- **`Transaction`:** Pencatatan riwayat pembayaran paket atau kunjungan harian (*Visit*) secara manual. Memiliki kolom `amount`, `status` (PENDING/SUCCESS).
- **`MembershipPackage`:** *Master data* statis yang menyimpan daftar harga dan durasi langganan (VIP/Reguler).
- **`GuideVideo`:** Tabel untuk manajemen video panduan olahraga (tautan YouTube).
- **`CheckIn`:** Tabel rekam jejak historis kehadiran member yang dipicu melalui *Scan* QR Code (mencatat `checkOutTime` otomatis).
- **`PTSession` & `PTScheduleSlot` & `PTSetting`:** Trio model yang mengatur alur bisnis Personal Trainer. Terintegrasi dengan fitur *Capacity Management*, model `PTScheduleSlot` kini mendukung atribut `maxCapacity` untuk membatasi kuota peserta.

---

## 🔐 3. Alur Autentikasi, Otorisasi, & Sinkronisasi Data
Sistem autentikasi didesain untuk meminimalisasi *friction* sekaligus menjaga keutuhan data (Data Integrity) secara kokoh.

### A. Alur Pendaftaran (Auth Flow)
1. **Sign Up (Clerk):** Pengguna mendaftar instan menggunakan akun Google/Email melalui UI Clerk.
2. **Global Redirect Interception:** Pasca-login, sistem *middleware* Next.js memblokir akses ke *Landing Page* dan memaksa navigasi langsung ke area `/member/dashboard`.
3. **Custom Onboarding Flow & Karyawan Bypass (Bypass Clerk Pro):** Sistem *Nested Layout* (`app/member/layout.tsx`) akan mencegat pengguna baru jika data wajib (Nomor HP & Alamat) masih kosong. Pengguna akan dialihkan ke `/onboarding` untuk mengisi data secara mandiri ke *database* kita. Di sisi lain, sistem menerapkan **logika *Bypass Verification*** bagi akun berstatus `ADMIN` atau `SUPERADMIN`, memungkinkan mereka *skip* onboarding dan langsung masuk ke Dasbor agar lebih efisien (Modul Karyawan Otomatis).

### B. Robust Data Sync (Sinkronisasi Database)
- **Sinkronisasi Webhook vs Upsert Atomic:** Meskipun ada *Webhook* (`/api/webhooks/clerk`) untuk memantau pengguna baru secara asinkron, aplikasi ini juga menerapkan logika **`prisma.user.upsert`** yang reaktif di dalam *layout* utama.
- **Kekebalan Data:** Logika *upsert* atomik ini bertumpu pada `email` utama pengguna, sehingga secara elegan mengeliminasi resiko eror *fatal* (`Unique constraint failed`) yang biasa terjadi jika pengguna menghapus dan mendaftarkan ulang akunnya di *provider*. Nama pengguna (`fullName`) diinjeksi secara otomatis ke sistem internal.

---

## 🏛️ 4. Sistem Multi-Tenant & Akses Berbasis Peran (RBAC)
Aplikasi secara arsitektural membelah diri menjadi ekosistem *Multi-Tenant* dengan UI/UX dan logika keamanan yang sangat berbeda berdasarkan nilai `role` pengguna (Member, Admin, Super User, Trainer).

### Area Anggota (`/member/...`) untuk `MEMBER_REGULAR` & `MEMBER_VIP`
- **Antarmuka:** Diselimuti oleh *Mobile-First Bottom Navigation Layout* bergaya *app-like* untuk mempermudah operasional via *smartphone*.
- **Akses:** Memuat interaksi kasual seperti Dasbor, Profil Read-Only/Edit, *Booking* PT, dan QR E-Card dinamis (Kartu Emas "Black Card" eksklusif untuk VIP).
- **Proteksi Anti-Looping:** Transaksi pembelian VIP dijaga ketat agar tombol pendaftaran mati (*disabled*) selama masa aktif VIP masih berlaku.

### Dasbor Admin B2B (`/admin/...`) untuk `ADMIN` & `SUPERADMIN`
- **Antarmuka:** Diselimuti oleh *Desktop-First Sidebar Layout* kelas premium (SaaS UI). Pada perangkat *mobile*, tabel data raksasa diubah secara dinamis menjadi Kartu Informasi bertumpuk (*Table-to-Card adaptive pattern*) guna mencegah *horizontal scroll* yang merusak UX.
- **Hidden Trigger Entrance:** Karena portal administrasi bersifat rahasia, akses Login Admin tidak diekspos secara publik. Admin harus menekan sebuah tuas tersembunyi (*Hidden Trigger*) di *Footer Landing Page* untuk memunculkan portal login khusus *Split-Screen*.
- **Gatekeeper Middleware:** Upaya akses ke `/admin` akan divalidasi langsung ke *database*. Akun biasa akan segera ditendang (*kicked out*).

### Area Navigasi Khusus `TRAINER` (Sub-Admin)
- **Antarmuka (RBAC Lanjutan):** Mewarisi tata letak *Admin B2B*, namun menu yang ditampilkan (Navigasi Sidebar) **dipangkas secara cerdas**. Trainer tidak akan bisa melihat atau mengakses modul *QR Scanner* atau *Keuangan*, dan hanya terfokus pada Jadwal Kelas & Sesi O2O.

---

## 🪪 5. Sistem Short ID & Universal QR Code
Sistem tidak lagi menggunakan UID panjang untuk QR Code. Setiap Member kini diberikan sebuah **`shortId`** unik yang disematkan ke dalam *QR Code E-Card*. Validasi kode dapat dilakukan melalui kamera bawaan (iOS/Android) yang secara otomatis akan membuka *Universal QR Code Endpoint* publik, ataupun dipindai lewat halaman `/admin/scanner` internal.

---

## 🔄 6. Alur Bisnis Operasional (Business Workflows)

### 1. Alur Pembayaran Kasir (Offline-First / POS)
Sistem memprioritaskan alur pembayaran manual (QRIS/Tunai) di meja Kasir untuk memotong biaya *Payment Gateway*:
1. Member memilih paket dan mencetak transaksi (*Checkout*), sistem mencatat di tabel `Transaction` dengan status `PENDING`.
2. Member menunjukkan layar ke Kasir di lokasi fisik.
3. Kasir masuk ke menu POS (`/admin/transactions`), menerima dana, atau mencatat transaksi baru secara manual.
4. *Server Action* memproses penyetujuan, mengubah status menjadi `SUCCESS`, dan menetapkan `endDate` (masa aktif) member secara absolut ketat atau mengaktifkan status O2O sesi PT.

### 2. Alur Booking Kelas (Validasi Kuota & Anti Double-Booking)
1. Member mendaftar ke kelas yang tersedia melalui Dasbor Member.
2. *Server Action* memvalidasi dua lapis keamanan:
   - **Kapasitas:** Mencegah pendaftaran jika jumlah partisipan di `ClassBooking` sudah melampaui `capacity`.
   - **Double-Booking:** Mencegah satu pengguna mendaftar ke kelas yang sama berulang kali.

### 3. Alur QR Code Check-in & Deteksi Pintar Kehadiran
Setiap member memiliki "Kartu Digital" bertenaga QR Code yang unik. Admin di meja depan (*Front Desk*) menggunakan menu `/admin/scanner` dengan kamera web bawaan untuk memindai QR Code tersebut. Setelah terpindai sukses, *check-in* dicatat ke dalam rekam jejak kehadiran secara permanen. Modul ini secara cerdas mendeteksi *Check-in* dan *Check-out* di hari yang sama, memberikan Peringatan (Red Alert) jika masa keanggotaan kadaluarsa, dan menampilkan notifikasi sesi PT jika member memiliki jadwal pada hari tersebut.

### 4. Alur Manajemen Sesi Personal Trainer (O2O) & Harga Dinamis (Snapshot Pricing)
1. Superadmin (Owner) membuat Slot Waktu yang sangat dinamis menggunakan mekanisme **Snapshot Slot Pricing**. Setiap slot memiliki variabel Harga (`price`) dan Diskon (`discountPercentage`) independen yang tertanam langsung pada slot tersebut, meninggalkan pola usang *Global Master Pricing*.
2. Member melihat ketersediaan slot melalui UI bergaya *Pro Horizontal Card*. Slot yang sudah melampaui kuota maksimum (`maxCapacity`) akan dinonaktifkan / *greyed-out*.
3. Setelah Member mem-*booking*, status PT Session adalah `PENDING` (menunggu pembayaran disetujui).
4. Saat pembayaran diverifikasi oleh Kasir, status menjadi `CONFIRMED`.
5. Di hari pelaksanaan, Trainer memulai kelas (`ONGOING`), dan menyelesaikannya (`COMPLETED`), mencatat `actualStartTime` dan `actualEndTime` ke database untuk *payroll* atau evaluasi di masa depan.

### 5. Mesin Verifikasi Inti (Core Verification Engine)
- **Alur QR -> URL -> Scanner -> Biodata Lookup:** Setiap E-Card VIP dan Regular mem-bypass ID bawaan sistem dengan `shortId` atau ID buatan (misal `M-RGAO`).
- Payload QR Code dikemas dalam format URL (`https://[HOST]/verify/M-RGAO`) sehingga dapat dipindai oleh pemindai eksternal (mengarahkan ke *browser*) ATAU pemindai internal Admin (`/admin/scanner`).
- Pemindai Internal secara otomatis mengekstraksi kode ID dari URL, melakukan kueri ke *database* (`endsWith` *fallback* untuk toleransi ketiadaan `shortId`), dan menahan pemindai untuk menampilkan **Kartu Biodata Modal** secara penuh, sebelum dilanjutkan ke pemindaian berikutnya.

---

## ⚙️ 7. Keputusan Arsitektur Teknis Kritis (Critical Architectural Decisions)
Aplikasi berevolusi dengan kecepatan tinggi yang mengharuskan beberapa keputusan teknis fundamental untuk menjaga integritas dan performa sistem:

### 🛡️ 7.1 Fault-Tolerant Deletions & Foreign Key Protection (Soft Delete)
Menghapus akun staf (Admin/Trainer) secara permanen (`.delete()`) melalui Prisma akan menyebabkan pelanggaran `RESTRICT` pada *foreign key* karena staf tersebut mungkin terikat pada rekam jejak finansial (sebagai Kasir pada tabel Transaksi) atau historikal (sebagai instruktur di tabel PT Session). Alih-alih melakukan *hard delete*, sistem dengan aman mencegat proses penghapusan dari *Auth Provider* (Clerk), mencabut akses masuknya, lalu melakukan **Prisma Role Downgrade** (mengubah `role` menjadi `MEMBER`). Mekanisme *Soft Delete* ini secara brilian memutus akses sistem tanpa mengorbankan integritas data historis maupun finansial.

### 🔢 7.2 Pagination-Aware Indexing
Sistem menerapkan kalkulasi matematis global di seluruh tabel operasional (Transaksi, Buku Kas, Sesi PT) untuk menjaga penomoran sekuensial yang sempurna. Formula `(currentPage - 1) * itemsPerPage + index + 1` digunakan sehingga saat pengguna menavigasi ke halaman ke-2 atau ke-3, nomor urut tidak me-reset kembali ke angka 1 (misal: tetap berlanjut ke 11, 12, 13), memastikan konsistensi visual laporan *Enterprise*.

### 📅 7.3 Daily Visit Data Modeling (Visit Harian)
Alih-alih melakukan migrasi skema Prisma yang kompleks dan berisiko untuk mengakomodasi model langganan "Visit Harian" (1-Hari), sistem memanfaatkan bendera logika fungsional `durationMonths === 0`. Jika sebuah entitas `MembershipPackage` memiliki nilai durasi 0 bulan, aplikasi secara cerdas akan mengkategorikannya sebagai paket *Visit Harian* dan secara otomatis mengklasifikasikan transaksi tersebut menjadi `HARIAN`. Pendekatan ini menghemat kompleksitas *schema* selagi mempertahankan kapabilitas modul CRM terpadu yang memadukan member VIP dan pelanggan Harian di satu pintu Kasir yang sama.
