# PRD-v3.78.md
**Status:** Phase 3.78 - Dynamic Package Integration & Conditional Daily Rate (Harian)
**TUGAS ANDA:** Mengintegrasikan form Registrasi Member dengan Master Data "Paket VIP" secara dinamis, serta mengimplementasikan opsi khusus "Harian" yang memungkinkan Kasir menginput nominal harga secara manual.

---

## 1. Dynamic Fetching: Master Paket VIP
**Lokasi:** Dropdown "Pilih Paket Membership" di Modal Registrasi Member.
**Instruksi Eksekusi UI & Fetching:**
- Ambil (fetch) seluruh data paket yang aktif dari tabel Master Paket (berdasarkan gambar referensi, tabel ini memiliki field `Nama Paket`, `Durasi`, `Harga Normal`, `Diskon`).
- Mapping data tersebut ke dalam opsi dropdown. Tampilkan menggunakan format nama paket dari database (Contoh: "VIP 1 Bulan").

## 2. Implementasi Opsi Khusus "Harian" & Kondisional Harga
**Lokasi:** Form Registrasi (Bagian Paket & Nominal Pembayaran).
**Instruksi Eksekusi Logika (State Management):**
- Tambahkan satu opsi statis / *hardcoded* di dalam dropdown paket tersebut bernama: **"Harian (Manual)"**.
- **Logika Harga VIP (Otomatis):** Jika Kasir memilih salah satu dari "Paket VIP" hasil fetch database, field "Nominal Pembayaran" otomatis terisi dengan harga akhir paket tersebut (sudah dikalkulasi dengan diskon jika ada), diformat dalam Rupiah, dan field bersifat **`readOnly` / `disabled`**.
- **Logika Harga Harian (Manual):** Jika Kasir memilih "Harian (Manual)", kosongkan field "Nominal Pembayaran" dan **buka akses ketiknya (hilangkan atribut `readOnly`)** agar Kasir dapat mengetik nominal secara bebas (namun tetap terformat Rupiah secara *real-time* saat diketik).

## 3. Penyesuaian Server Action (Database Logic)
**Lokasi:** Server action pengolahan submit Registrasi & Transaksi.
**Instruksi Eksekusi Backend:**
Pastikan backend mengenali perbedaan antara paket VIP dan Harian untuk menentukan Role dan Masa Aktif (Expired Date) pengguna:
- **Jika Paket = Harian:** 
  - Set `role` member menjadi `REGULAR` (atau role standar non-VIP).
  - Set `endDate` (Masa aktif) menjadi hari ini + 1 Hari (atau cukup catat sebagai transaksi *Visit* Harian tanpa masa aktif panjang).
- **Jika Paket = Paket VIP (dari DB):** 
  - Set `role` member menjadi `VIP` (atau role khusus sesuai ketentuan paket).
  - Kalkulasi `endDate` secara presisi: `Tanggal Hari Ini` + `Durasi (Bulan)` dari Master Paket.
- Pastikan nominal pembayaran (baik yang ditarik dari paket maupun yang diketik manual untuk Harian) tersimpan akurat di tabel Transaksi/Cashflow.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan logika state (*conditional rendering* & *readonly toggle*) secara langsung pada Client Component menggunakan React state. Pastikan perhitungan durasi masa aktif berjalan akurat di sisi server.