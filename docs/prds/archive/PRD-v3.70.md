# PRD-v3.70.md
**Status:** Phase 3.70 - Admin Slot UI Refinement & Frontend Cinema-Style Integration
**TUGAS ANDA:** Menyederhanakan input nama Trainer menjadi teks bebas, merapikan daftar slot yang berulang di Admin, dan mengimplementasikan UI Booking PT di sisi Frontend Member secara penuh.

---

## 1. Simplifikasi Input Nama PT (Admin UI)
**Lokasi:** Modal/Form "Kelola Slot Jadwal PT" di `app/admin/personal-trainer/page.tsx` (atau Client Component-nya).
**Instruksi:**
- Hapus elemen `<select>` (Dropdown) untuk pemilihan nama Personal Trainer.
- Ganti dengan elemen `<input type="text" />` biasa agar Admin dapat mengetik nama PT secara manual dengan bebas (Free text). 
- Pastikan nilai teks ini tersimpan ke kolom `trainerName` (atau sejenisnya) di database saat slot dibuat.

## 2. Merapikan Daftar Slot (Admin UI)
**Masalah:** Saat ini daftar slot yang sudah dibuat di bawah form render-nya terpisah-pisah dan judul harinya berulang jika ada hari yang sama.
**Instruksi:**
- Ubah tampilan "List Slot yang sudah dibuat" menjadi bentuk **Tabel Sederhana** atau **List Grouped** yang rapi.
- Kolom yang wajib ada: Hari, Jam Mulai - Selesai, Nama PT, dan Aksi (Tombol Hapus).
- Pastikan UI tidak terlihat berantakan atau bertumpuk.

## 3. Eksekusi Halaman Frontend Booking PT (Member UI)
**Lokasi:** Halaman Booking Frontend, misalnya `app/(member)/jadwal/page.tsx`.
**Instruksi Eksekusi:**
- **Fetch Master Data:** Ambil data `PTSetting` (untuk menampilkan Harga Per Sesi di bagian atas halaman).
- **Fetch Slot Data:** Ambil seluruh data `PTScheduleSlot`.
- **Render UI (Cinema Style Grid):**
  - Buat grid responsif (`grid-cols-2` atau `grid-cols-3` untuk mobile).
  - Looping data slot yang tersedia menjadi kotak-kotak (*Cards/Buttons*).
  - Tampilkan informasi: **Hari, Jam, dan Nama PT** di dalam kotak tersebut.
  - Terapkan logika pengecekan transaksi (isBooked).
  - **Tersedia:** Kotak berwarna hijau/cerah, bisa diklik, mengarah ke konfirmasi/pembayaran.
  - **Penuh/Booked:** Kotak berwarna abu-abu (Greyed out), teks "Sudah Dibooking", `disabled`, dan kursor tidak bisa diklik.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan modifikasi langsung di proyek. Pastikan UI Frontend Member terlihat elegan, minimalis, dan sangat mudah digunakan layaknya aplikasi pemesanan tiket pada umumnya.