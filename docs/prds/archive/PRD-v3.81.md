# PRD-v3.81.md
**Status:** Phase 3.81 - Dynamic Time Filtering & Contextual Excel Export
**TUGAS ANDA:** Mengubah indikator waktu statis di Dashboard menjadi Filter Waktu dinamis (Dropdown), serta memastikan logika tombol "Unduh Laporan (Excel)" mengekspor data sesuai dengan rentang waktu yang sedang dipilih oleh user di filter tersebut.

---

## 1. UI/UX: Modifikasi Indikator Waktu Dashboard
**Lokasi:** Header Dashboard Admin (`app/admin/dashboard/page.tsx` atau komponen Header).
**Instruksi Eksekusi UI:**
- Ubah elemen visual (Badge) yang saat ini bertuliskan statis "Hari Ini" menjadi sebuah **Dropdown Select** yang modern.
- Isi opsi dropdown tersebut minimal dengan:
  - "Hari Ini" (Default)
  - "Bulan Ini"
  - "Bulan Lalu"
  - "Tahun Ini" (Opsional untuk Superadmin)
- Simpan nilai pilihan ini ke dalam React State (jika Client Component) atau jadikan URL Query Parameter (misal: `?filter=this_month`) agar state-nya persisten saat direfresh.

## 2. Dynamic Fetching Data Dashboard
**Instruksi Eksekusi Logika:**
- Hubungkan *state* / query parameter filter waktu tersebut ke seluruh *Card* ringkasan di bawahnya (Sesi PT, Check-in, dll). 
- Jika User memilih "Bulan Ini", pastikan angka yang muncul di Dashboard otomatis ter-update menampilkan total data selama bulan berjalan.

## 3. Integrasi Filter Waktu dengan Ekspor Excel (.xlsx)
**Lokasi:** Tombol "Unduh Laporan (Excel)" dan Server Action ekspor.
**Instruksi Eksekusi Logika:**
- Modifikasi fungsi pemicu ekspor Excel (misal: `exportToExcel()`) agar menerima parameter waktu yang sedang aktif di Dropdown.
- Lempar parameter ini ke *Server Action/API* Prisma.
- **Logika Prisma:** Terapkan modifikator `where` pada query database (seperti `createdAt: { gte: startDate, lte: endDate }`) berdasarkan parameter yang dikirim.
- Dengan begini, jika Admin memilih "Bulan Ini" di dropdown lalu menekan tombol Unduh Excel, file `.xlsx` yang ter- *generate* akan berisi seluruh transaksi bulanan, bukan hanya harian.

## 4. RBAC (Opsional - Sesuai Kebijakan Owner)
- Jika kebijakan bisnis mengharuskan Admin biasa HANYA boleh mengunduh data harian, terapkan logika *disable* pada dropdown waktu atau sembunyikan opsi "Bulan Ini" HANYA JIKA `role !== 'superadmin'`.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan logika parameter waktu ini langsung pada komponen dan query Prisma di dalam proyek. Pastikan file Excel yang diunduh menyesuaikan dengan filter yang dipilih.