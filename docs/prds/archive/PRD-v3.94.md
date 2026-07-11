# PRD-v3.94.md
**Status:** Phase 3.94 - UI Polish & Dashboard Metric Segmentation
**TUGAS ANDA:** Menghapus elemen panah (spin button) pada input kuota PT untuk UI yang lebih bersih, dan memisahkan metrik "Total Member" di Dashboard menjadi "Member Aktif" dan "Non-Member" menggunakan data nyata dari Prisma.

---

## 1. UI Polish: Menghapus Spin Button pada Input Number
**Lokasi:** Komponen UI "Kelola Slot Jadwal PT" (Input "Maksimal Member").
**Instruksi Eksekusi UI:**
- Input `type="number"` secara default memunculkan panah atas/bawah (spin buttons) pada browser Webkit. Hilangkan elemen ini agar terlihat seperti text input biasa yang estetik.
- **Implementasi CSS/Tailwind:** Tambahkan class utilitas Tailwind kustom atau modifikasi file `globals.css` untuk menerapkan properti `appearance: none;` dan menyembunyikan `::-webkit-inner-spin-button` serta `::-webkit-outer-spin-button`.
- Pastikan input tetap hanya bisa menerima angka dan fungsi validasi (min/max) tetap berjalan normal di latar belakang.

## 2. Segmentasi Metrik Dashboard (Real Data, NO DUMMY)
**Lokasi:** Halaman Dashboard Admin (`app/admin/dashboard/page.tsx` dan Server Action terkait).
**Instruksi Eksekusi Logika & Database (Prisma):**
- Modifikasi query Prisma yang sebelumnya hanya menghitung keseluruhan total tabel `User` (atau `Member`).
- Pisahkan menjadi dua query penghitungan (count) yang spesifik:
  1. **Hitung Member Aktif:** Query pengguna dengan kriteria yang menandakan mereka adalah member aktif (misal: memiliki `status` keanggotaan aktif, paket VIP/Bulanan yang belum *expired*, atau rule yang setara di skema Anda).
  2. **Hitung Non-Member:** Query pengguna dengan status harian (Guest/Walk-in), akun yang sudah *expired*, atau akun yang mendaftar tanpa berlangganan paket.
- *Catatan:* Sesuaikan kondisi `where` pada Prisma persis dengan bagaimana status keanggotaan (Active vs Non-Member) didefinisikan di dalam `schema.prisma` Anda.

## 3. Pembaruan UI Card Dashboard
**Instruksi Eksekusi UI:**
- Rombak Card pertama di Dashboard yang sebelumnya menampilkan "Total Member".
- **Opsi Desain:**
  - *Split Card:* Pecah informasi tersebut di dalam satu Card (misal: Angka besar untuk "Member Aktif", lalu di bawahnya terdapat badge/teks kecil berwarna abu-abu yang menampilkan jumlah "Non-Member").
  - *Atau Grid Tambahan:* Jadikan 2 Card terpisah jika layout grid memungkinkan tanpa merusak estetika (misal membuat deretan Card menjadi 5 kolom atau memadatkan ukurannya).
- Pastikan label berbunyi jelas: **"Member Aktif"** dan **"Non-Member"**.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan trik CSS ini langsung di environment proyek. Untuk metrik dashboard, pastikan logika *Server Action* mem-fetch data *count* secara *real-time* dari tabel Prisma yang relevan.