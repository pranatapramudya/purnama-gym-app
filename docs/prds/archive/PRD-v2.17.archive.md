# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.17  
**Status:** Phase 2.17 - Custom Asset Integration (Grid Icons)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, `next/image`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Pembaruan Visual (Custom Icons)

**A. Integrasi Custom Icon di Beranda (`app/member/dashboard/page.tsx`):**
- **Masalah:** Ikon bawaan dari *library* (seperti Lucide React) pada Grid 2x2 kurang memberikan sentuhan visual yang khas dan ingin diganti dengan aset *custom* PNG.
- **Solusi Wajib:**
  1. Gunakan komponen `<Image />` dari bawaan `next/image` untuk menggantikan komponen ikon Lucide React pada 3 tombol utama di Grid 2x2.
  2. **Mapping Aset:**
     - Tombol **QR Masuk**: Gunakan `src="/icons/qr-code.png"` dan `alt="QR Masuk"`.
     - Tombol **Booking Kelas**: Gunakan `src="/icons/calendar.png"` dan `alt="Booking Kelas"`.
     - Tombol **VIP Membership**: Gunakan `src="/icons/vip.png"` dan `alt="VIP Membership"`.
  3. **Sizing (Micro-UI Constraints):** Sangat krusial untuk tetap mematuhi aturan ukuran ringkas agar halaman tidak bisa di-*scroll*. Berikan properti `width={32} height={32}` (atau `w-8 h-8` dengan *className*) pada komponen `<Image />`. Tambahkan *class* `object-contain` dan `mx-auto mb-1` agar gambar tetap proporsional dan berada tepat di tengah atas teks.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.15:** UI Static, Routing, Pricing, Layout Constraint (Anti-Scroll), & Stateful Buttons.
- [x] **Phase 2.16:** *Strict Viewport Lock* (`100dvh`).
- [x] **Phase 2.17 (Fokus Saat Ini):** Mengganti ikon bawaan dengan aset gambar *custom* PNG pada Grid 2x2 di halaman Beranda menggunakan optimasi bawaan Next.js (`next/image`).
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.14:** Pemolesan UX *Custom Modal* dan penghapusan redundansi Profil.
* **v2.15:** Pemangkasan ukuran komponen (Micro-UI).
* **v2.16:** Mengunci *layout* utama menjadi statis 100dvh *anti-scroll*.
* **v2.17 (Current):** Penggunaan aset gambar kustom (`/icons/...`) untuk menggantikan ikon standar pada menu Grid utama demi meningkatkan daya tarik visual Beranda.