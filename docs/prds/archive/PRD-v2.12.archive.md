# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.12  
**Status:** Phase 2.12 - Real Pricing, Package Grid Layout & Dynamic Back Routing  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
**A. Perombakan Logika Tombol Kembali (Back Button) di `/member/payment`:**
- Tombol navigasi kembali (`<-`) di *header* halaman Pembayaran harus membaca parameter URL atau *state*.
- Jika `type=daily` (Visit Harian): Arahkan kembali ke `/member/dashboard` (Beranda).
- Jika paket VIP (1-12 Bulan): Arahkan kembali ke `/member/packages`.

**B. Refaktorisasi Halaman Katalog VIP (`/member/packages`):**
1. **Harga Riil & Benefit:**
   - Sesuaikan harga dasar VIP menjadi **Rp 150.000 / Bulan**. (Hitung proporsional untuk 3, 6, dan 12 bulan).
   - Hapus teks *benefit*: "Locker & Handuk Gratis" dan "Konsultasi PT 3x" dari semua opsi paket.
2. **Compact 2x2 Grid Layout:**
   - Hapus *Hero Section* kartu paket yang memanjang ke bawah dan berukuran terlalu besar.
   - Ubah tata letak daftar paket (1 Bulan, 3 Bulan, 6 Bulan, 12 Bulan) menjadi **Grid 2x2** (`grid grid-cols-2 gap-3`).
   - Buat desain kartu per paketnya menjadi sangat *compact* (seperti kotak kecil yang hanya menampilkan Durasi, Harga, dan tombol "Pilih").

**C. Pembaruan Harga Visit Harian:**
- Pastikan harga untuk Visit Harian (Daily Pass) di- *update* menjadi **Rp 20.000 / Hari** pada halaman *checkout* atau *payment*.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.10:** UI Static, Routing, Hero Redesign, Dropdown Booking, Stateful Buttons.
- [x] **Phase 2.11:** Modernisasi *Alert Confirmation* & perampingan *Grid* Beranda.
- [x] **Phase 2.12 (Fokus Saat Ini):** Memperbaiki *bug routing* pada tombol kembali di halaman pembayaran, mengintegrasikan harga riil (VIP 150rb, Harian 20rb), membersihkan deskripsi *benefit*, dan merombak tata letak paket VIP menjadi Grid 2x2 yang *compact* agar tidak *oversized*.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.9:** Refaktorisasi filter kelas dan implementasi *Alert/Toast*.
* **v2.10:** Penggantian `<select>` HTML dengan *Custom Dropdown* modern.
* **v2.11:** Sentralisasi tombol perpanjangan di Beranda dan *Modern Modal Dialog* pembatalan.
* **v2.12 (Current):** Penyesuaian tata letak paket menjadi Grid 2x2, perbaikan alur tombol kembali (Back Navigation) berbasis jenis paket, dan pembaruan harga sesuai data nyata (Purnama Gym Sumedang).