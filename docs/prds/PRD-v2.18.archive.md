# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.18  
**Status:** Phase 2.18 - Grid Proportions & Background Consistency Fix  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, `next/image`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Perbaikan Bug Visual (Fokus Saat Ini)

**A. Perbaikan Proporsi Grid 2x2 (Anti-Gepeng/Lonjong):**
- **Masalah:** Tombol pada menu utama (QR Masuk, Booking Kelas, VIP, Visit) terlihat terlalu lonjong ke samping dan gepeng (kurang tinggi). Ini akibat pemangkasan ruang vertikal yang berlebihan.
- **Solusi Wajib:** 
  1. Buka `app/member/dashboard/page.tsx`.
  2. Pada elemen tombol di dalam *Grid*, berikan *padding* vertikal yang lebih proporsional, misalnya `py-4` atau `py-5`, dan pastikan menggunakan `flex flex-col items-center justify-center` agar ikon dan teks terpusat secara rapi di tengah.
  3. Sebagai alternatif, gunakan *class* `aspect-[2/1]` atau `aspect-[5/3]` pada tombol grid agar perbandingan lebar dan tingginya selalu konsisten (kotak persegi panjang yang proporsional), tidak peduli seberapa lebar layar *mobile*-nya.

**B. Keseragaman Latar Belakang (White Background Uniformity):**
- **Masalah:** Terdapat area berwarna abu-abu ( *gray/slate* ) di bagian paling bawah layar, tepat di bawah komponen "Info Penting". Latar belakang seharusnya putih bersih secara keseluruhan.
- **Solusi Wajib:**
  1. Cek pembungkus utama di halaman Beranda (`dashboard/page.tsx`) dan pastikan memiliki *class* `bg-white`.
  2. Cek juga file *Layout* utama (`app/member/layout.tsx`). Jika ada *class* seperti `bg-slate-50` atau `bg-gray-50` pada pembungkus *Mobile Wrapper* atau elemen `<main>`, segera ubah menjadi `bg-white` agar latar belakang dari atas sampai batas *Bottom Navigation* seragam berwarna putih murni.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.16:** UI Static, Routing, Strict Anti-Scroll Constraint (`100dvh`).
- [x] **Phase 2.17:** Integrasi aset *Custom Icons* PNG (`next/image`) pada Grid.
- [x] **Phase 2.18 (Fokus Saat Ini):** Mengembalikan proporsi tinggi tombol Grid 2x2 agar tidak gepeng (menambahkan *padding* vertikal/aspek rasio), dan menyeragamkan latar belakang layar menjadi putih murni (`bg-white`) untuk menghilangkan area abu-abu di bagian bawah layar.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.15:** Pemangkasan ukuran komponen (Micro-UI).
* **v2.16:** Mengunci *layout* utama menjadi statis `100dvh` *anti-scroll*.
* **v2.17:** Penggunaan gambar kustom (`/icons/...`) untuk menggantikan ikon standar pada menu Grid utama.
* **v2.18 (Current):** Perbaikan *layouting* tombol Grid (Anti-lonjong) dan standarisasi warna latar belakang Beranda menjadi putih polos.