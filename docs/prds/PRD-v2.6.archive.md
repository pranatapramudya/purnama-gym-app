# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.6  
**Status:** Phase 2.6 - Dynamic Data & Visual Hierarchy Reorder  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti, database, Clerk, dan UI Guidelines sudah dikunci. Bahasa antarmuka wajib menggunakan Bahasa Indonesia.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
- **URL Redirect Logika:** Akses ke `/` otomatis dialihkan ke `/member/dashboard` bagi pengguna terautentikasi.
- **Hierarki Beranda (Dashboard):**
  1. Sapaan Singkat
  2. Kartu Keanggotaan (Data tersinkronisasi dengan Clerk & Waktu Dinamis)
  3. Grid 2x2 (QR, Booking, VIP, Harian)
  4. Info Penting

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1:** UI Static & Layouting.
- [x] **Phase 2.1 - 2.4:** Routing, Cleanup, & UI Compact Sizing.
- [x] **Phase 2.5:** Hero Minimalism & Uniform Grid 2x2.
- [x] **Phase 2.6 (Fokus Saat Ini):** Menata ulang hierarki visual (memindahkan 'Info Penting' ke bawah), mempercantik Header dengan teks gradien, dan mengintegrasikan nama akun Clerk serta kalkulasi tanggal kedaluwarsa dinamis ke dalam Kartu Member.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.3:** Optimalisasi ruang vertikal UI Beranda.
* **v2.4:** Eksekusi *Aggressive Compact Sizing*.
* **v2.5:** Refaktorisasi menu Beranda menjadi Grid 2x2.
* **v2.6 (Current):** Sinkronisasi data identitas Clerk ke dalam *Membership Card*, pembuatan tanggal dinamis, dan penyesuaian hierarki tata letak Beranda untuk memprioritaskan Kartu Member.