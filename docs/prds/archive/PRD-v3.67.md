# 📋 PRD: Purnama Gym - V3.67 (UI/UX Fleksibel Super Admin & Sinkronisasi Frontend)

## 1. Ringkasan Eksekutif & Latar Belakang
Dokumen ini merupakan lanjutan dari `PRD-v3.66.md`. Setelah berhasil memperbaiki *Hydration Error* pada sistem, fokus saat ini adalah menyempurnakan **User Experience (UX) Super Admin** dalam mengatur Personal Trainer (PT) agar lebih fleksibel, serta memastikan **Data Flow** dari halaman Admin ke halaman Frontend Member berjalan sempurna (ketersediaan jadwal, harga, dan nama PT).

## 2. Bug & Masalah Saat Ini (Target Perbaikan)
Berdasarkan hasil pengujian UI terkini, ditemukan 3 masalah kritis pada alur Master Ketersediaan & Harga PT:

1. **Masalah UI Input Harga:** Pada form "Pengaturan Master Ketersediaan & Harga PT", input harga menggunakan `type="number"` standar yang memunculkan *scroll bar/panah naik-turun* (spinner). Ini mengganggu UX dan tidak profesional.
2. **Masalah Fleksibilitas Nama PT:** Pada input "Pilih Personal Trainer", Super Admin saat ini terpaksa harus memilih nama dari *dropdown* yang sudah terdaftar di sistem. Padahal Super Admin perlu kebebasan untuk mengetik nama PT secara manual (misal: PT tamu, PT freelance baru, atau nama kesatuan).
3. **Masalah Data Flow ke Frontend:** Halaman "Jadwal PT" di App Member (`/member/schedule`) menampilkan pesan **"Belum ada jadwal PT yang tersedia untuk kategori ini"**, padahal di backend Admin sudah melakukan konfigurasi jam operasional, harga, dan slot jadwal. Data dari `PTScheduleSlot` dan `PTSetting` belum terkirim atau gagal dirender di Frontend.

## 3. Spesifikasi Perubahan (Instruksi untuk Agent)

### A. Perbaikan Input Harga Per Sesi (Hilangkan Scroll Bar & Format IDR)
Agent diminta untuk mengubah komponen input harga pada halaman Super Admin.
- **Tindakan UI:** Ganti `input type="number"` menjadi `input type="text"` (atau pertahankan number tapi hilangkan spinner).
- **CSS Wajib:** Tambahkan class CSS `appearance-none` (atau pseudo-element `::-webkit-inner-spin-button` dengan `display: none`) untuk menyembunyikan tombol panah naik/turun agar terlihat bersih.
- **Fitur Format Rupiah Otomatis:** Tambahkan logika *prepend* "Rp" di depan kolom (bisa menggunakan *prefix* UI atau div absolute). Agent diminta untuk mengimplementasikan fungsi *onChange* atau *onBlur* yang otomatis menambahkan pemisah ribuan (titik) saat Super Admin mengetik angka (contoh: 100000 otomatis berubah jadi 100.000). **Data yang disimpan ke database tetaplah angka integer (100000)**, bukan string.

### B. Implementasi Input Nama PT Secara Bebas (Bebas Ketik Manual)
Agent diminta untuk mengubah logika dan UI pemilihan Personal Trainer.
- **Skenario Saat Ini:** `<select>` atau `Dropdown` yang terikat dengan database User role `PT` dan `trainerId`.
- **Perubahan UI:** Ubah komponen dropdown menjadi **Combobox / Input Text dengan fitur Search & Type (bebas input)**. Jika Super Admin mengetik nama yang tidak ada di database, nama tersebut *tetap* harus bisa disimpan.
- **Konsekuensi Database:**
  - Jika nama PT yang diketik **ada** di database (`User` role PT), sistem boleh mengikat ke `trainerId`.
  - Jika nama PT yang diketik **tidak ada**, sistem harus **mengabaikan `trainerId`** dan menyimpannya sebagai string teks biasa ke dalam kolom baru bernama **`trainerName`**.
  - *Instruksi ke Agent:* Agent diminta untuk menambahkan kolom `trainerName` (String) di skema Prisma pada model `PTScheduleSlot`, menyesuaikan logika `upsert`/`create`, serta mengubah validasi form agar bisa menerima nama PT apa pun yang diketik oleh Super Admin.

### C. Perbaikan Data Flow & Frontend Display (Jadwal PT Member)
Agent diminta untuk memperbaiki halaman `/member/schedule` agar menampilkan data yang telah diinput Super Admin.
- **API / Server Action Fix:** Pastikan fungsi `getAvailablePTSlots` (atau Server Action yang memuat jadwal untuk member) dipanggil dengan benar. Fungsi ini wajib mengembalikan objek data lengkap yang mencakup: `startTime`, `endTime`, `price` (dari master harga), dan `trainerName` (yang sudah disimpan, baik dari ID atau teks bebas).
- **UI Rendering:**
  - Halaman `/member/schedule` harus merender list kartu jadwal yang berisi informasi detail, contoh tampilan: **"08:00 - 09:00 | Nama PT: Prnata Pramudya | Harga: Rp 100.000"**.
  - Pastikan logika *greyed out* (slot tidak tersedia) tetap berjalan jika slot sudah dibooking member lain.
- **Perbaikan Pesan Kosong:** Hapus pesan statis "Belum ada jadwal PT yang tersedia...". Agent diminta untuk menggantinya dengan *Conditional Rendering* yang dinamis:
  - Jika ada data jadwal -> Tampilkan daftar kartu.
  - Jika data jadwal kosong -> Tampilkan pesan "Belum ada jadwal yang disediakan oleh Admin saat ini.".

## 4. Panduan Testing (Untuk Validasi Agent)
Setelah agent menyelesaikan tugas di atas, lakukan pengujian ini:
1. **Tes Harga:** Buka halaman Super Admin. Ketik "100000". Pastikan tampil "Rp 100.000" di input, dan tidak ada icon panah atas/bawah di sebelahnya.
2. **Tes Input PT:** Ketik nama PT yang **belum ada** di database (misal: "Trainer Tamu"). Simpan. Cek database Prisma Studio, pastikan kolom `trainerName` berisi "Trainer Tamu" dan `trainerId` bernilai `null`.
3. **Tes Frontend:** Buka aplikasi Member di HP/Emulator (refresh halaman). Pastikan jadwal yang baru saja disimpan muncul dengan benar, menampilkan nama PT dan harganya sesuai input Super Admin.

---
**Instruksi Akhir untuk AI Agent:**
Silakan implementasikan ketiga perubahan di atas. Prioritaskan perbaikan CSS untuk input harga dan perubahan ke skema database (`trainerName`) terlebih dahulu, baru kemudian sambungkan datanya ke Frontend Member. Jangan ubah struktur layout utama atau arsitektur autentikasi yang sudah ada.