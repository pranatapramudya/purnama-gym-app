# PRD-v3.58.md
**Status:** Phase 3.58 - Strict Dashboard UI De-cluttering (Zero Financial Proxies)
**TUGAS ANDA:** Menyembunyikan widget metrik tidak langsung (Total Member), menghilangkan sepenuhnya kontainer grafik, dan mengunci filter waktu hanya pada "Hari Ini" khusus untuk role `admin`.

---

## 1. Penghapusan Total Kontainer Grafik & Widget Member
**Lokasi:** `app/admin/(dashboard)/page.tsx` (atau `DashboardClient.tsx`)
**Instruksi:**
- **Widget Total Member:** Terapkan *Conditional Rendering* agar widget ini HANYA muncul jika `role === 'superadmin'`. Jika role adalah `admin`, sembunyikan (jangan render) widget ini sama sekali.
- **Kontainer Grafik Pendapatan:** Hapus logika *placeholder* "Akses Dibatasi". Jika role adalah `admin`, JANGAN RENDER keseluruhan kontainer "Grafik Pendapatan".
- *Layouting:* Pastikan saat elemen-elemen di atas hilang, layout *grid* atau *flex*-nya menyesuaikan dengan rapi (misal: widget Sesi PT dan Check-in melebar mengisi ruang, atau daftar "Check-in Terkini" mendominasi layar bawah).

## 2. Penguncian Filter Waktu (Date Range)
**Analisis:** Admin operasional (kasir) hanya perlu mengurus dan melihat data hari ini (Sesi PT & Check-in harian). Rekap mingguan/bulanan adalah wewenang manajemen.
**Instruksi:**
- Temukan komponen *Dropdown Filter* rentang waktu ("Hari Ini", "Minggu Ini", "Bulan Ini") yang ada di sudut kanan atas Dashboard.
- **Logika Role:**
  - Jika `role === 'superadmin'`: Biarkan berfungsi normal seperti biasa.
  - Jika `role === 'admin'`: Kunci *state* data HANYA untuk "Hari Ini". SEMBUNYIKAN elemen tombol *dropdown* tersebut dari layar (atau jadikan teks statis "Hari Ini" tanpa fungsi klik), agar Admin tidak bisa mengubah filter tanggal.

**ATURAN KETAT:**
DILARANG memberikan blok kode dalam balasan Anda! HANYA kerjakan modifikasi logika UI/UX ini secara langsung di dalam proyek. Pastikan tidak ada celah bagi Admin untuk melihat metrik akumulatif.