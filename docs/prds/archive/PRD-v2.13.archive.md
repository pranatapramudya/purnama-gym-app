# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 2.13  
**Status:** Phase 2.13 - Payment Bug Fix & VIP Grid Modernization  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Prisma 7+, Neon DB, Clerk, Lucide React.

---

## 1-7. (Isi Sama dengan Versi Sebelumnya)
*Catatan: Spesifikasi UI Mobile Wrapper, Typography, dan Layout dikunci.*

---

## 8. Perbaikan Bug & Modernisasi UI (Fokus Saat Ini)

**A. Bug Fix: Runtime Error di Halaman Pembayaran (`/member/payment/page.tsx`)**
- **Masalah:** Komponen `<Suspense>` gagal di- *render* (terdeteksi sebagai `undefined`).
- **Solusi Wajib:** Tambahkan baris kode `import { Suspense } from 'react';` di bagian paling atas file `app/member/payment/page.tsx`. Pastikan seluruh komponen yang menggunakan *client-side features* (seperti `useSearchParams`) dibungkus dengan benar oleh `Suspense` sesuai standar Next.js.

**B. Modernisasi UI Katalog VIP (`/member/packages/page.tsx`)**
Tata letak *Grid 2x2* sudah benar, namun gaya visual ( *styling* ) perlu dirombak agar terlihat modern dan premium (tidak jadul):
1. **Peningkatan Kartu Base (1, 3, 12 Bulan):**
   - Tambahkan *border* tipis yang elegan (`border border-slate-100`).
   - Berikan sudut yang lebih membulat (`rounded-2xl` atau `rounded-3xl`).
   - Berikan efek bayangan halus (`shadow-sm hover:shadow-md transition-all`).
   - Buat tombol "Pilih" di dalamnya lebih modern (gunakan *background* abu-abu sangat muda `bg-slate-50` dengan teks gelap, dan efek *hover* yang lembut).
2. **Peningkatan Kartu Highlight (6 Bulan - Best Seller):**
   - Ubah latar belakang kartu menjadi *gradient* halus (contoh: `bg-gradient-to-br from-pink-50 to-purple-50`) dipadu dengan *border* warna pink/ungu transparan.
   - **Modernisasi Badge:** Ubah teks "*BEST SELLER*" menjadi *badge* berbentuk pil/kapsul yang melayang di pojok atas atau di tengah atas kartu (`bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-3`).
   - Pastikan tombol "Pilih" pada kartu ini berwarna mencolok (contoh: *solid pink* dengan efek bayangan warna pink `shadow-pink-200/50`).

---

## 9. Frontend Implementation Tracker
- [x] **Phase 1 - 2.11:** UI Static, Routing, Hero Redesign, Stateful Buttons, Modal.
- [x] **Phase 2.12:** Perbaikan *Routing Back Button*, Harga Riil, dan Layout *Grid 2x2* VIP.
- [x] **Phase 2.13 (Fokus Saat Ini):** Menyelesaikan *Missing Import Bug* (`Suspense`) pada halaman *Payment* agar tidak *crash*, dan memodernisasi desain kartu paket VIP dengan gaya UI kekinian ( *Gradients, Drop Shadows, Floating Badges* ).
- [ ] **Phase 3:** Backend & Database Sync (Implementasi Prisma & Server Actions).

---

## 10. Riwayat Catatan Pengerjaan (Changelog)
* **v2.10:** Penggantian `<select>` HTML dengan *Custom Dropdown* modern.
* **v2.11:** Sentralisasi tombol perpanjangan di Beranda dan *Modern Modal Dialog*.
* **v2.12:** Penyesuaian tata letak paket menjadi Grid 2x2.
* **v2.13 (Current):** Perbaikan *Runtime Error* React (`Suspense`) dan peningkatan kualitas visual (UI Modernization) pada antarmuka *Grid* paket VIP.