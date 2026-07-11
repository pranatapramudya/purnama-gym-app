# PRD-v3.61.md
**Status:** Phase 3.61 - Admin Workflow Implementation (Flowchart Synchronization)
**TUGAS ANDA:** Menyelaraskan seluruh logika antarmuka dan interaksi database di Portal Admin agar sesuai dengan arsitektur Alur Pengguna (User Flow) yang baru saja disahkan.

---

## 1. Modul Scanner QR (Gerbang Utama)
**Lokasi:** `app/admin/scanner-qr/page.tsx`
**Instruksi:**
- Pastikan logika pemindaian mencakup **Check-In** dan **Check-Out** (mencatat `waktuMasuk` dan `waktuKeluar` di database).
- **Logika Validasi (Conditional State):**
  - Jika status Member **Aktif**: Tampilkan pesan sukses hijau dan langsung catat waktu di database.
  - Jika status Member **Tidak Aktif / Kadaluarsa**: Tampilkan *Alert* merah yang berisi peringatan HANYA. 
  - Di dalam *Alert* merah tersebut, wajib tambahkan tombol pintasan (CTA) bertuliskan **"Lakukan Perpanjangan"** yang jika diklik akan mengarahkan (redirect) Admin langsung ke halaman `/admin/transaksi` dengan membawa parameter ID atau Email member tersebut.

## 2. Modul Manajemen Member
**Lokasi:** `app/admin/member/page.tsx`
**Instruksi:**
- Pastikan halaman ini memiliki dua kapabilitas utama bagi Admin:
  1. Tombol untuk membuka form **"Registrasi Member Baru"**.
  2. Aksi/Tombol untuk **"Update Data"** (Edit profil) pada tabel list member.
- Batasi aksi agar Admin tidak memiliki opsi untuk melakukan "Hard Delete" (hapus permanen) pada data member.

## 3. Modul Personal Trainer (Manajemen Jadwal)
**Lokasi:** `app/admin/personal-trainer/page.tsx`
**Instruksi:**
- Filter tampilan default tabel jadwal agar secara spesifik memprioritaskan **"List Booking PT Hari Ini"**.
- Tambahkan sebuah aksi tombol dinamis bernama **"Akhiri"** atau "Selesai" di setiap baris jadwal yang sedang aktif.
- Jika tombol **"Akhiri"** ditekan, perbarui status sesi tersebut di database menjadi selesai/selesai dikerjakan.

## 4. Modul Transaksi (Kasir & Top Up)
**Lokasi:** `app/admin/transaksi/page.tsx`
**Instruksi:**
- Rancang antarmuka kasir (POS/Point of Sale) yang difokuskan pada penginputan aliran dana.
- Sediakan form atau modal khusus untuk **"Input Penjualan / Pembayaran"** (meliputi perpanjangan paket VIP, pembayaran kunjungan harian, dan top-up/pembelian lainnya).
- Pastikan data transaksi ini tersimpan dengan baik dan nantinya dapat di-export melalui tombol CSV di Dashboard.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan pengecekan, penyesuaian UI, dan perbaikan logika *routing* secara langsung di *environment* proyek berdasarkan instruksi *workflow* di atas. Pastikan transisi antar halaman berjalan cepat tanpa *reload*.