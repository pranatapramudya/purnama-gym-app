# PRD-v3.72.md
**Status:** Phase 3.72 - Modern Form Controls, Booking State Persistence, & Advanced Excel Export
**TUGAS ANDA:** Mengganti elemen input bawaan browser dengan UI modern, memperbaiki logika persistensi state booking berdasarkan tanggal, dan merombak fitur ekspor CSV menjadi file Excel (.xlsx) dengan format Enterprise.

---

## 1. UI/UX Overhaul: Modernisasi Input Hari & Jam (Admin)
**Lokasi:** Form Kelola Slot Jadwal PT di Portal Admin.
**Masalah:** Native `<input type="time">` dan `<select>` terlihat kuno dan tidak konsisten antar browser.
**Instruksi Eksekusi UI:**
- **Pemilihan Hari:** Hapus dropdown native. Ganti dengan komponen **"Pill / Toggle Button Group"**. Tampilkan 7 tombol melingkar/kotak berdampingan (Senin - Minggu). Saat salah satu hari diklik, tombol tersebut berubah warna (Active State: `bg-emerald-500 text-white`).
- **Pemilihan Jam (Mulai & Selesai):** Jangan gunakan native `type="time"`. Gunakan *Custom Dropdown* (Select) bergaya Tailwind modern yang berisi opsi interval per 30 menit atau 1 jam (misal: "08:00", "09:00", dst.). Beri ikon jam (*Clock icon*) di sebelah kiri teks.

## 2. Bug Fix: Persistensi State Booking Frontend (Grey Out)
**Lokasi:** Server Action yang mengambil data ketersediaan slot (untuk Frontend).
**Masalah:** Saat di-*refresh*, slot yang sudah dibooking kembali menjadi hijau karena query tidak mengunci parameter tanggal hari ini.
**Instruksi Perbaikan Logika:**
- Saat Frontend mengambil data jadwal (fetch), Server Action WAJIB mengevaluasi berdasarkan **Tanggal Spesifik (Hari Ini / Tanggal Terpilih)**.
- **Logika Validasi:** Query tabel `PTSession` yang memiliki slot waktu tersebut DAN kolom tanggalnya (atau `createdAt`/`schedule`) jatuh pada **hari yang sama**. 
- Jika transaksi ditemukan pada tanggal tersebut, kembalikan `isBooked: true`. 
- Pastikan saat kalender berpindah ke hari esok (H+1), query otomatis tidak menemukan transaksi (karena belum ada yang booking untuk besok), sehingga UI secara dinamis merender ulang kotak menjadi hijau (Tersedia).

## 3. FinOps Reporting: Migrasi CSV ke Excel (.xlsx)
**Lokasi:** Tombol "Unduh Laporan" di Dashboard (Admin & Superadmin).
**Instruksi Eksekusi:**
- Hapus logika export CSV standar.
- Instalasi library ekspor Excel yang solid (rekomendasi: `xlsx` / SheetJS atau `exceljs`). *(Lakukan `npm install` secara otomatis jika memungkinkan, atau beri tahu via komentar jika butuh manual install).*
- **Format Kerapian (Wajib):**
  - Buat Header tabel dengan tulisan tebal (Bold).
  - Kolom nominal uang HARUS diformat sebagai Currency (Rp), bukan sekadar angka biasa.
  - Sesuaikan lebar kolom (Auto-width) agar tulisan nama, email, dan nominal tidak terpotong saat file dibuka di Microsoft Excel.
  - Pisahkan rekap transaksi (Pemasukan Member vs Pembayaran PT) agar rekonsiliasi kasir menjadi sangat mudah.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Fokus perbaiki komponen visual di frontend untuk menghilangkan kesan "jadul", perketat logika filter tanggal (Date querying) di Prisma, dan pastikan laporan yang di-download benar-benar berformat `.xlsx` yang siap pakai oleh bagian keuangan.