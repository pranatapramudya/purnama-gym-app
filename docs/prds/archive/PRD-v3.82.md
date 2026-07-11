# PRD-v3.82.md
**Status:** Phase 3.82 - Critical Hotfix: Restore Revenue Chart (Regression Fix)
**TUGAS ANDA:** Mengembalikan komponen Grafik Pendapatan (Revenue Chart) yang tidak sengaja terhapus/hilang dari Dashboard Super User saat implementasi Filter Waktu sebelumnya.

---

## 1. Kembalikan Komponen Grafik
**Lokasi:** `app/admin/dashboard/page.tsx` (atau komponen utama Dashboard).
**Instruksi Eksekusi UI:**
- Cek kembali kode Anda sebelumnya. Temukan komponen grafik (seperti `<RevenueChart />` atau implementasi Recharts/Chart.js) yang sebelumnya sudah pernah dibuat untuk menampilkan tren pendapatan.
- Letakkan kembali komponen tersebut di bawah deretan *Card* ringkasan (Sesi PT, Check-in, dll).
- Pastikan grafik ini HANYA TAMPIL jika *user* yang login adalah `superadmin`. (Bungkus dengan *conditional rendering* jika diperlukan).

## 2. Integrasi Data Grafik (Aman)
**Instruksi Eksekusi Logika:**
- Grafik ini harus kembali menampilkan data tren pendapatan. 
- Jika memungkinkan, hubungkan query data grafik ini dengan parameter *Dropdown Filter Waktu* (misal: jika dipilih "Tahun Ini", grafik menampilkan data per bulan; jika "Bulan Ini", grafik menampilkan data per minggu/hari).
- JIKA integrasi dengan filter waktu terlalu kompleks dan berisiko memunculkan error, **JANGAN DIPAKSAKAN**. Cukup kembalikan grafik dengan logika default-nya yang sudah berfungsi kemarin (misal: menampilkan tren 6 bulan terakhir secara statis).

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Jangan menghapus fitur dropdown filter waktu yang baru saja dibuat. Tugas Anda HANYA menyisipkan (append) kembali komponen grafik yang hilang ke dalam layout yang sekarang.