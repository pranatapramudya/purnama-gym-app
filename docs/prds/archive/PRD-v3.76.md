# PRD-v3.76.md
**Status:** Phase 3.76 - Relokasi Tombol Input POS ke Modul Member (CRM-First Flow)
**TUGAS ANDA:** Memindahkan tombol utama "+ Input Penjualan / Pembayaran" beserta seluruh komponen Modal form kasirnya dari halaman Manajemen Transaksi ke halaman Manajemen Member.

---

## 1. Hapus Tombol dari Halaman Transaksi
**Lokasi:** `app/admin/transactions/TransactionsClient.tsx` (atau komponen header terkait).
**Instruksi Eksekusi:**
- Hapus tombol "+ Input Penjualan / Pembayaran" yang berada di pojok kanan atas.
- Hapus juga komponen `<TransactionModal />` (atau nama fungsi modal kasir yang serupa) dari file ini karena sudah tidak akan dipicu dari halaman Transaksi.
- Halaman Transaksi kini 100% hanya berfungsi sebagai *View/Read-only* dan Verifikasi tabel riwayat saja.

## 2. Relokasi dan Pemasangan di Halaman Member
**Lokasi:** `app/admin/members/MembersClient.tsx` (atau file header dari menu Member).
**Instruksi Eksekusi:**
- *Import* dan pasang komponen Modal Input Kasir (beserta fungsi state pembukanya) ke dalam file ini.
- Tambahkan tombol "+ Input Penjualan / Pembayaran" di bagian atas halaman Member.
- Posisikan tombol tersebut bersebelahan dengan tombol "+ Registrasi Member Baru" secara rapi (Gunakan `flex gap-4` agar sejajar dan estetis).

## 3. Penyesuaian Import & State
**Instruksi Eksekusi:**
- Pastikan tidak ada *error import* (seperti Zod schema, Server Actions `createManualTransaction`, atau data *fetching* paket VIP) saat komponen ini dipindahkan antar halaman.
- Pastikan logika pada PRD sebelumnya (Dropdown pilihan Member Terdaftar, Fetch Master Paket otomatis, dan Auto-fill Keterangan) tetap berjalan normal meski dijalankan dari dalam halaman Member.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan pemindahan komponen ini (Refactoring) langsung di dalam proyek. Pastikan UI di halaman Member tidak berantakan setelah penambahan tombol baru ini.