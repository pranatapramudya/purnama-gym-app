# PRD-v3.45.md
**Status:** Phase 3.45 - Dynamic QR E-Card & VIP Expiration Logic
**TUGAS ANDA:** Memperbaiki halaman QR Code agar menampilkan Nama asli pengguna secara dinamis (bukan teks statis "Member") dan menerapkan logika status keanggotaan yang ketat (VIP vs Non Member).

---

## 1. Analisis Alur Kerja (Workflow)
**Masalah saat ini:** Halaman E-Card QR menampilkan teks statis "Member" dan status statis "REGULER".
**Target Logika Bisnis:**
- Saat akun dibuat (selesai Onboarding No HP & Alamat), E-Card harus langsung menarik Nama Lengkap dari sesi Clerk / Database.
- Status bawaan (*default*) untuk pengguna baru adalah **"NON MEMBER"** (Bukan "Reguler").
- Jika pengguna membeli paket VIP, status berubah menjadi **"VIP MEMBER"**.
- SANGAT PENTING: Harus ada pengecekan waktu (Expiration Check). Jika masa aktif VIP habis, status harus otomatis turun kembali menjadi **"NON MEMBER"**.

## 2. Instruksi Eksekusi Logika Data (Tanpa merusak UI)
Pindai file halaman QR Code Anda (`app/member/qr/page.tsx` atau komponen yang relevan) dan terapkan logika ini di sisi Server/Client:

**A. Penarikan Nama Dinamis:**
- Ambil data `firstName` dan `lastName` dari Clerk (atau dari tabel User di Prisma).
- Ganti teks *hardcoded* `<h1>Member</h1>` menjadi variabel dinamis `{user.fullName}` atau `{namaDariDatabase}`.

**B. Logika Status Keanggotaan (VIP Expiration):**
- Tarik data `isVip` (boolean) dan `vipExpiryDate` (DateTime) dari Prisma.
- Buat logika kondisional:
  Jika `isVip` adalah `true` DAN `vipExpiryDate` > waktu saat ini (`new Date()`):
  Maka tampilkan badge: **VIP MEMBER** (gunakan warna emas/hijau).
  Jika tidak (belum VIP atau masa aktif sudah lewat):
  Maka tampilkan badge: **NON MEMBER** (gunakan warna abu-abu).

**C. Sinkronisasi Payload QR Code:**
- Pastikan nilai (value) yang di- *generate* di dalam gambar QR Code memuat JSON atau String ID yang sesuai dengan ID Member di *database*. (Persiapan untuk fitur Scanner Admin di masa depan).

**ATURAN KETAT:**
Tugas Anda HANYA memodifikasi logika pemanggilan data dan mengubah teks statis menjadi dinamis. DILARANG merusak tata letak (layout) kartu E-Card yang sudah rapi. Kerjakan kodenya sekarang!