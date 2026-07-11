# PRD-v3.62.md
**Status:** Phase 3.62 - End-to-End PT Booking Lifecycle (Admin & Database Prep)
**TUGAS ANDA:** Memperbarui skema database untuk siklus hidup pemesanan Personal Trainer (PT) dan mengimplementasikan antarmuka Admin untuk menerima, memvalidasi, serta mengeksekusi sesi PT berdasarkan alur kerja (flowchart) terbaru.

---

## 1. Pembaruan Skema Database (Prisma)
**Lokasi:** `prisma/schema.prisma`
**Instruksi:** 
Perbarui model yang menangani Jadwal PT / Kelas Gym (misal: `GymClass` atau `PTSession`) untuk mendukung alur *booking* O2O:
- Pastikan ada relasi ke pengguna/member yang mem-booking (`memberId`).
- Pastikan ada relasi ke trainer (`trainerId`) yang nantinya bisa difilter untuk 'PT Wanita'.
- **Ubah/Tambah Kolom Status:** Field `status` harus bisa mengakomodasi 4 siklus ini (gunakan `String` atau `Enum`):
  1. `PENDING` (Member sudah booking via aplikasi, butuh konfirmasi).
  2. `CONFIRMED` (Admin sudah ACC, menunggu hari H).
  3. `ONGOING` (Member sudah Check-In dan sesi sedang berjalan).
  4. `COMPLETED` (Sesi selesai).
- Tambahkan kolom pencatat waktu presisi: `actualStartTime` (DateTime, nullable) dan `actualEndTime` (DateTime, nullable) untuk merekam durasi riil sesi PT (± 1 Jam).

## 2. Modifikasi UI Manajemen PT (Admin Dashboard)
**Lokasi:** `app/admin/personal-trainer/page.tsx` (atau Client Component-nya)
**Instruksi Eksekusi UI:**
Rancang tampilan tabel atau daftar (List) agar terbagi menjadi siklus yang jelas bagi Kasir:
- **Bagian 1: "Booking Baru (Menunggu Konfirmasi)"**
  - Tampilkan daftar sesi yang berstatus `PENDING`.
  - Sediakan tombol aksi **"Verifikasi & Konfirmasi"** yang akan mengubah status menjadi `CONFIRMED`.
- **Bagian 2: "Sesi Hari Ini"**
  - Tampilkan sesi `CONFIRMED` khusus tanggal hari ini.
  - Sediakan tombol aksi **"Mulai Sesi PT"**. Jika diklik, ubah status menjadi `ONGOING` dan catat waktu saat ini ke `actualStartTime`.
- **Bagian 3: "Sesi Aktif" (Sedang Berjalan)**
  - Tampilkan sesi berstatus `ONGOING`.
  - Opsional: Tampilkan indikator visual (misal: teks "Sedang Berjalan") agar Admin sadar ada sesi yang belum ditutup.
  - Sediakan tombol **"Akhiri Sesi"**. Jika diklik, ubah status menjadi `COMPLETED`, catat waktu ke `actualEndTime`, dan picu fungsi pembuatan riwayat/billing (terintegrasi dengan modul Transaksi/CashFlow).

## 3. Integrasi Trigger Scanner & PT (Otomatisasi)
**Instruksi:**
- Pastikan ketika Admin melakukan *scan* QR Check-In member (pada modul Scanner), Admin dapat dengan mudah melihat apakah member tersebut memiliki jadwal PT `CONFIRMED` hari ini, sehingga Admin bisa langsung bersiap menekan tombol "Mulai Sesi PT".

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan pembaruan pada `schema.prisma` terlebih dahulu dan informasikan jika memerlukan `npx prisma db push`. Terapkan logika UI di atas menggunakan state dan server actions yang solid untuk mencegah bentrok data.