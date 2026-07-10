# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.19  
**Status:** Phase 2.19 - Greeting Gradient Card & iOS Mobile Cutoff Fix  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, `next/image`.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Perbaikan Bug & Modernisasi UI (Fokus Saat Ini)

**A. Modernisasi Teks Sapaan (Greeting Card):**
- **Masalah:** Teks sapaan ("Siap untuk jadwal...") saat ini hanya berupa teks biasa yang terkesan kurang menonjol.
- **Solusi Wajib:** Bungkus teks tersebut menggunakan elemen *card* modern dengan latar belakang gradasi pastel.
  1. Gunakan *class* seperti: `bg-gradient-to-r from-pink-50 to-indigo-50 border border-pink-100 rounded-2xl p-3 mb-1`.
  2. Pastikan ukuran teks di dalamnya tetap proporsional (`text-sm` atau `text-base` maksimal) agar tidak memakan terlalu banyak ruang vertikal (mencegah *layout* bocor).

**B. Perbaikan Bug Cutoff di iOS (Extreme Vertical Fit):**
- **Masalah:** Komponen "Info Penting" di bagian paling bawah terpotong (ketutup) pada layar perangkat seluler/iOS, meskipun *layout* sudah di-set `100dvh` dan `overflow-hidden`. Ini terjadi karena total tinggi seluruh elemen melebihi tinggi ruang yang tersedia (*viewport*).
- **Solusi Wajib (Compressing Heights):**
  Untuk mempertahankan *layout One-Page* absolut (anti-scroll) tanpa ada yang terpotong, paksa elemen untuk menyusut:
  1. **Kurangi Gap Utama:** Ubah jarak antar elemen utama di `dashboard/page.tsx`. Jika sebelumnya menggunakan `justify-between`, coba ganti menjadi tata letak *flex* yang lebih rapat dengan `justify-evenly` atau `gap-2` maksimal.
  2. **Pangkas Tinggi Kartu Pink (Member):** Kurangi *padding* vertikalnya secara drastis (misal `py-3` atau `py-4` saja).
  3. **Pangkas Tinggi Grid:** Pastikan tombol di dalam Grid tidak terlalu tinggi. Sesuaikan *padding* atau *aspect ratio* agar lebih ceper (pipih) namun tetap tidak merusak ikon.
  4. **Pengecekan Bottom Navigation:** Jika komponen `BottomNav` menggunakan *position* `fixed` atau `absolute`, pastikan pembungkus utama halaman (Beranda) memiliki *padding-bottom* yang cukup (misal `pb-20` atau `pb-24`) agar konten terbawah (Info Penting) tidak tertimpa oleh menu navigasi. Jika `BottomNav` menggunakan tata letak `flex` standar, abaikan *padding-bottom* ekstra ini.

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.17:** UI Static, Routing, Strict Constraints, & Custom Icons Integration.
- [x] **Phase 2.18:** Perbaikan *layouting* tombol Grid (Anti-lonjong) dan standarisasi warna latar belakang Beranda menjadi putih murni (`bg-white`).
- [x] **Phase 2.19 (Fokus Saat Ini):** Mentransformasi teks sapaan menjadi *Modern Gradient Card*, serta melakukan kompresi tinggi elemen ( *padding/gap reduction* ) secara ekstrem untuk menyelesaikan *bug layout* terpotong (*cutoff*) di iOS.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.16:** Mengunci *layout* utama menjadi statis `100dvh` *anti-scroll*.
* **v2.17:** Penggunaan gambar kustom (`/icons/...`) pada menu Grid.
* **v2.18:** Perbaikan tombol Grid dan standarisasi warna latar belakang putih.
* **v2.19 (Current):** Pembuatan *Greeting Gradient Card* dan penyelesaian *bug viewport overlap/cutoff* pada perangkat *mobile* iOS dengan memangkas tinggi elemen secara presisi.