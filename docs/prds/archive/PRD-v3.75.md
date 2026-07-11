# PRD-v3.75.md
**Status:** Phase 3.75 - Transaction Flow Simplification (DRY) & Auto-fill Logic
**TUGAS ANDA:** Menghapus redundansi form pendaftaran walk-in pada modal transaksi, menghubungkan Jenis Paket dengan Master Database secara dinamis, dan membuat field Keterangan terisi otomatis berdasarkan inputan lainnya.

---

## 1. Sentralisasi Logika Pendaftaran (Hapus Redundansi)
**Lokasi:** Modal "Input Transaksi Kasir" di `app/admin/transactions/TransactionsClient.tsx`.
**Instruksi Eksekusi UI:**
- Hapus seluruh field input manual untuk Data Member (Nama Lengkap, No. HP, Email) yang sebelumnya dirancang untuk Walk-in.
- Kembalikan input Data Member menjadi sebuah **Dropdown Pencarian Member Terdaftar** (Cari berdasarkan nama/nomor HP). 
- *(Catatan Logika: Pendaftaran member baru kini dikembalikan secara eksklusif ke menu "Member". Modal Transaksi murni hanya untuk mencatat transaksi member yang sudah ada di database).*

## 2. Dynamic Fetching: Master Jenis Paket
**Lokasi:** Dropdown "Jenis Paket" pada Modal Transaksi.
**Instruksi Eksekusi:**
- Hapus *hardcoded options* (Harian, Bulanan Regular, dll).
- Tarik (fetch) data langsung dari tabel Master Paket yang dikelola oleh Super User (misal: tabel `VIPPackage` atau entitas master serupa di database).
- Tampilkan nama paket hasil *fetch* tersebut sebagai opsi di dropdown.
- *(Note: Pastikan harga yang tertera di form "Nominal Pembayaran" juga otomatis mengikuti harga dari paket yang dipilih, terformat dalam Rupiah).*

## 3. Otomatisasi Field "Keterangan"
**Lokasi:** Field "Keterangan" pada Modal Transaksi.
**Instruksi Eksekusi UI & Logika:**
- Hubungkan *state* dari dropdown "Jenis Paket" dan dropdown "Metode".
- Buat agar value pada input "Keterangan" terisi secara otomatis (*auto-generated string*) setiap kali Kasir mengubah Paket atau Metode Pembayaran.
- **Format String:** `Pembayaran [Nama Paket] via [Metode]` (Contoh: `Pembayaran Paket Zumba via Transfer Bank` atau `Pembayaran Bulanan VIP via Tunai`).
- Jadikan field Keterangan ini bersifat `readOnly` atau `disabled` agar Kasir tidak perlu mengetik manual dan format laporan keuangan tetap seragam.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Bersihkan file UI dari kode redundan, dan pastikan *Server Actions* untuk menyimpan transaksi disesuaikan karena kini hanya menerima `memberId` dari member yang sudah terdaftar.