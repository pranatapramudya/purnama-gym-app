# PRD-v3.60.md
**Status:** Phase 3.60 - Revert CSV Access for Cashier Reconciliation
**TUGAS ANDA:** Mengembalikan akses tombol "Unduh Laporan (CSV)" di Dashboard agar dapat diakses oleh role `admin` (Kasir) untuk keperluan rekonsiliasi keuangan harian (tutup buku).

---

## 1. Pembukaan Akses Tombol Unduh Laporan (CSV)
**Lokasi:** `app/admin/(dashboard)/page.tsx` (atau komponen `DashboardClient.tsx` yang memuat tombol CSV).
**Instruksi:**
- Cari elemen tombol "Unduh Laporan (CSV)" yang sebelumnya dikunci hanya untuk `superadmin`.
- Hapus pembatasan *Conditional Rendering* yang ketat tersebut.
- Pastikan tombol CSV sekarang HANYA dibatasi dari pengguna biasa, artinya pengguna dengan `role === 'admin'` DAN `role === 'superadmin'` harus bisa melihat dan mengklik tombol ini.
- Pastikan logika pemuatan data (data fetching) saat tombol diklik tetap berfungsi normal agar staf kasir dapat mengunduh data transaksi hari ini.

**ATURAN KETAT:**
DILARANG memberikan blok kode dalam balasan Anda! HANYA kerjakan modifikasi logika UI ini secara langsung di dalam proyek. Fokus buka kembali gembok tombol tersebut dengan rapi.