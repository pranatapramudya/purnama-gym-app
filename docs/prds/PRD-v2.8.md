# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.8  
**Status:** Phase 2.8 - Greeting Text Gradient Refinement  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React, `react-qr-code`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi inti dan UI Guidelines dikunci. Seluruh teks antarmuka wajib dalam Bahasa Indonesia.*

---

## 8. Peta Navigasi & Interaktivitas (Routing Map)
- **Hierarki Beranda (Dashboard):**
  1. **Greeting Text:** Teks berukuran besar dengan *gradient text* (tanpa *background card*).
  2. **Kartu Keanggotaan:** Tersinkronisasi dengan Clerk (Nama & Tanggal Dinamis).
  3. **Grid 2x2:** QR, Booking, VIP, Harian.
  4. **Info Penting:** Posisi paling bawah *Above the Fold*.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.6:** UI Static, Routing, Dynamic Data Clerk, & Hierarchy Reorder.
- [x] **Phase 2.7:** *Greeting Banner* (direvisi).
- [x] **Phase 2.8 (Fokus Saat Ini):** Menghapus *background card* pada sapaan dan mengubahnya menjadi *Gradient Text* agar antarmuka terlihat lebih menyatu, ringan, dan modern tanpa elemen kotak yang bertumpuk.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.5:** Refaktorisasi menu Beranda menjadi Grid 2x2.
* **v2.6:** Sinkronisasi data identitas Clerk ke dalam *Membership Card*.
* **v2.7:** Pembuatan *Greeting Banner* (eksperimen).
* **v2.8 (Current):** Revisi tata letak sapaan dengan menghapus *wrapper card* dan menerapkan efek *Gradient Text* secara langsung untuk estetika yang lebih bersih (*clean*).