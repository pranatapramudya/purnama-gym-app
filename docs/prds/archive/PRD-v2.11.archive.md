# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.11  
**Status:** Phase 2.11 - Modern Alerts, Profile Refactoring & Micro-Grid Sizing  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
**A. Perombakan Hierarki Beranda (`/member/dashboard`):**
1. Greeting Text (Gradient).
2. Kartu Keanggotaan (Pink).
3. **Grid 2x2 Diperkecil:** Ukuran kartu kotak di- *press* lebih kecil (kurangi *padding* menjadi `p-2` atau `p-3`, perkecil ukuran ikon dan teks).
4. **[BARU] Tombol Perpanjang Membership:** Tombol *full-width* berwarna solid diletakkan tepat di bawah Grid 2x2.
5. Info Penting (Paling Bawah).

**B. Refaktorisasi Profil (`/member/profile`):**
- Hapus komponen "Masa Aktif Berakhir" dan tombol "Perpanjang Membership". Halaman profil difokuskan murni untuk manajemen akun (Riwayat, Notifikasi, Logout).

**C. Logika Jadwal Pribadi (`/member/schedule`):**
- Aktifkan interaktivitas penuh.
- Ganti *native alert/confirm* browser yang usang menjadi **Modern Custom Modal/Dialog**. Saat klik "Batal Booking", munculkan *overlay* elegan berlatar gelap dengan kotak konfirmasi di tengah layar.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.9:** UI Static, Routing, Hero Redesign, Dropdown Booking.
- [x] **Phase 2.10:** *Stateful Buttons* pada fitur kelas.
- [x] **Phase 2.11 (Fokus Saat Ini):** Mengecilkan *Grid 2x2* Beranda secara agresif, memindahkan fitur Perpanjangan Membership dari Profil ke Beranda, dan mengganti *alert* pembatalan usang menjadi *Modern Modal Dialog* di halaman Jadwal.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.8:** Revisi tata letak sapaan dengan *Gradient Text*.
* **v2.9:** Refaktorisasi filter kelas dan implementasi *Alert/Toast*.
* **v2.10:** Penggantian `<select>` HTML dengan *Custom Dropdown* modern.
* **v2.11 (Current):** Modernisasi *Alert Confirmation* pembatalan kelas, penghapusan redundansi data *expired* di Profil, sentralisasi tombol perpanjangan di Beranda, dan perampingan ekstrem ukuran *Grid* menu.