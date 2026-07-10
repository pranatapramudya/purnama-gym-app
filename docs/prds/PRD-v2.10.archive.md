# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.10  
**Status:** Phase 2.10 - Custom Dropdown & Advanced Booking State  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
**Logika Booking Kelas (Mockup State Terkini):**
- **Filter Kelas:** Menggunakan *Custom Dropdown* (bukan *native HTML select*) untuk menjaga konsistensi UI/UX modern.
- **State Tombol Kelas:**
  - *Available:* Tombol "Daftar".
  - *Booked:* Berubah menjadi tombol "✓ Terdaftar" disandingkan dengan tombol "Batal".
  - *Full:* Tombol "Kelas Penuh" (Disabled).

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.8:** UI Static, Routing, Data Clerk, Hero Redesign.
- [x] **Phase 2.9:** Implementasi *Toast Alert* sukses daftar.
- [x] **Phase 2.10 (Fokus Saat Ini):** Mendesain ulang filter dengan *Custom Dropdown Component* dan mengimplementasikan perubahan wujud tombol (*Stateful Button*) pasca-pendaftaran untuk kejelasan UX.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.7:** Penegasan logika URL *redirect*.
* **v2.8:** Revisi tata letak sapaan dengan *Gradient Text*.
* **v2.9:** Refaktorisasi filter kelas dan implementasi *Alert/Toast*.
* **v2.10 (Current):** Penggantian `<select>` HTML dengan *Custom Dropdown* modern dan penyempurnaan logika status (*state*) tombol kelas (Daftar -> Terdaftar + Batal).