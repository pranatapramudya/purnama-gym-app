# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.7  
**Status:** Phase 2.7 - Greeting Banner UI & Redirect Enforcement  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Struktur folder `/member/...` dikunci karena berisi Layout utama (Mobile Wrapper & BottomNav).*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
- **URL Redirect Logika (Strict):** Halaman `app/page.tsx` bertindak sebagai *gatekeeper*. Jika *user* memiliki sesi aktif (Clerk), akan dilempar secara *server-side* ke `/member/dashboard`.
- **Hierarki Beranda (Dashboard):**
  1. **Greeting Banner:** Sapaan berukuran besar dengan latar belakang gradasi modern.
  2. **Kartu Keanggotaan:** Tersinkronisasi dengan Clerk (Nama & Tanggal Dinamis).
  3. **Grid 2x2:** QR, Booking, VIP, Harian.
  4. **Info Penting:** Posisi paling bawah *Above the Fold*.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1:** UI Static & Layouting.
- [x] **Phase 2.1 - 2.5:** Routing, Cleanup, Grid Refactoring.
- [x] **Phase 2.6:** Dynamic Data & Hierarchy Reorder.
- [x] **Phase 2.7 (Fokus Saat Ini):** Memperbesar teks sapaan dan membungkusnya dalam *Banner* berlatar belakang modern, serta memastikan sistem *redirect* otomatis dari halaman pendaratan utama berjalan instan.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.4:** Eksekusi *Aggressive Compact Sizing*.
* **v2.5:** Refaktorisasi menu Beranda menjadi Grid 2x2.
* **v2.6:** Sinkronisasi data identitas Clerk ke dalam *Membership Card*.
* **v2.7 (Current):** Peningkatan UI sapaan menjadi *Modern Greeting Banner* dan penegasan logika *redirect* pada URL pendaratan utama.