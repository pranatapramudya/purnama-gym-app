# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.9  
**Status:** Phase 2.9 - Booking Interactivity & Dropdown Integration  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper dan UI Guidelines dikunci.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
**Logika Booking Kelas (Mockup State):**
- **Filter Kelas:** Menggunakan komponen *Dropdown* tunggal yang rapi, menggantikan tombol *horizontal scroll* yang memakan tempat.
- **Aksi Daftar:** Memerlukan validasi status VIP (Simulasi saat ini menampilkan *Toast Success* pendaftaran).
- **Aksi Batal:** Wajib memiliki langkah konfirmasi (*Confirmation Alert*) sebelum menghapus data jadwal.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.7:** UI Static, Routing, Dynamic Data Clerk, & UI Resizing.
- [x] **Phase 2.8:** Greeting Text Gradient Refinement.
- [x] **Phase 2.9 (Fokus Saat Ini):** Menghidupkan fitur Booking. Mengganti filter dengan Dropdown modern, dan menambahkan *Toast/Alert* responsif pada tombol "Daftar" dan "Batal Booking" agar interaksi *user* terasa nyata (UX Feedback).
- [ ] **Phase 3:** Backend & Database Sync.

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.6:** Sinkronisasi data identitas Clerk.
* **v2.7:** Penegasan logika URL *redirect*.
* **v2.8:** Revisi tata letak sapaan dengan *Gradient Text*.
* **v2.9 (Current):** Refaktorisasi UI Katalog Kelas (penerapan *Dropdown Filter*) dan penambahan sistem *Alert/Toast* untuk status sukses daftar maupun batal kelas.