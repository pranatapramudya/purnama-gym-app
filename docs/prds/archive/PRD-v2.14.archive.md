# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.14  
**Status:** Phase 2.14 - Strict Above-the-Fold & React State Polish  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Perbaikan Bug & UX Refinement (Fokus Saat Ini)

**A. Strict Above-the-Fold Beranda (`app/member/dashboard/page.tsx`):**
- **Masalah:** Komponen 'Info Penting' di bagian paling bawah masih terpotong dan membutuhkan *scroll* di layar *smartphone* (iOS/Android).
- **Solusi Wajib:** Terapkan *extreme vertical compacting*. Kurangi *margin/gap* vertikal antar komponen secara keseluruhan. Pastikan pembungkus utama beranda menggunakan batas tinggi layar yang responsif (misal dikurangi tinggi *BottomNav*) agar seluruh elemen (Sapaan -> Kartu -> Grid 2x2 -> Perpanjang VIP -> Info Penting) dijamin 100% tampil dalam satu layar (*One Page view*) tanpa *scroll* sama sekali.

**B. Modernisasi Alert Pembatalan (`app/member/booking/page.tsx` & `app/member/schedule/page.tsx`):**
- **Masalah:** Mengklik 'Batal' pada katalog kelas memunculkan *popup* bawaan *browser* (`window.confirm`) yang tidak sesuai dengan tema aplikasi.
- **Solusi Wajib:** Buang fungsi `window.confirm`. Ganti dengan komponen **Custom Modal Dialog** bawaan Tailwind/React. Modal ini harus memiliki latar belakang gelap (*overlay* `bg-black/50`), memusat di tengah layar, dengan desain kotak *rounded* bersih, berisi teks konfirmasi dan dua pilihan tombol modern: "Kembali" dan "Ya, Batalkan" (warna merah).

**C. React State Management pada Jadwal Pribadi (`app/member/schedule/page.tsx`):**
- **Masalah:** Setelah pengguna mengklik "Batal Booking" dan notifikasi *Toast* sukses muncul, kartu kelas masih tetap ada dan tombol tidak berubah wujud.
- **Solusi Wajib:** Implementasikan pembaruan *state* lokal secara instan. Ketika pembatalan dikonfirmasi (mengklik "Ya" di *Modern Modal*), **hapus kartu kelas tersebut dari daftar antarmuka** (gunakan fungsi array `.filter` pada state) sehingga pengguna benar-benar melihat bahwa jadwalnya sudah kosong/hilang. Jika jadwal kosong, tampilkan *Empty State* (teks "Belum ada kelas yang Anda booking").

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.11:** UI Static, Routing, Hero Redesign, Stateful Buttons, Modal Inisiasi.
- [x] **Phase 2.12 - 2.13:** Perbaikan Routing, Update Harga Riil, Modernisasi Grid VIP & Fix Bug Suspense.
- [x] **Phase 2.14 (Fokus Saat Ini):** Merapikan Layout Beranda menjadi *Strict Above-the-Fold* (tanpa scroll di mobile), mengganti *native alert* menjadi *Custom Modal Dialog*, dan mengelola *React State* agar jadwal otomatis hilang (*unmount*) saat berhasil dibatalkan.
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.11:** Sentralisasi tombol perpanjangan di Beranda dan *Modern Modal Dialog*.
* **v2.12:** Penyesuaian tata letak paket menjadi Grid 2x2.
* **v2.13:** Perbaikan *Runtime Error* React (`Suspense`) dan modernisasi visual Grid VIP.
* **v2.14 (Current):** Perbaikan *layout mobile constraint* (pencegahan *scroll* paksa), pemolesan UX *Custom Modal*, dan perbaikan siklus *State* pada saat pembatalan kelas.