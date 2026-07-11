# PRD-v3.53.md
**Status:** Phase 3.53 - Frontend UI De-cluttering & Admin Desktop Auth Button
**TUGAS ANDA:** Menghapus elemen tombol redundan di Landing Page, melokalisasi teks navigasi, dan mengimplementasikan komponen `<UserButton />` dari Clerk pada Layout Admin versi Desktop (PC).

---

## 1. Pembersihan Redundansi Halaman Depan (Landing Page)
**Lokasi:** `app/page.tsx` (atau komponen Hero Landing Page Anda) dan Komponen Navbar Frontend.
**Instruksi:**
- **Hapus Tombol Tengah:** Cari elemen tombol utama (CTA) di bagian tengah layar (*Hero Section*) yang bertuliskan "Masuk / Daftar Sekarang". Hapus seluruh elemen tombol tersebut beserta *wrapper*-nya agar tampilan lebih bersih.
- **Lokalisasi Teks Navbar:** Di komponen Navbar bagian atas, cari teks tautan `Sign In`. Ubah teks tersebut menjadi `Masuk` agar seragam dengan bahasa tombol `Daftar` di sebelahnya.

## 2. Standardisasi Tombol Logout Admin (Desktop/PC View)
**Lokasi:** `app/admin/layout.tsx` (atau komponen Sidebar Admin Anda).
**Analisis:** Saat ini, komponen `<UserButton />` dari Clerk (yang berfungsi memunculkan modal profil dan tombol Sign Out) hanya muncul di *Header* versi Mobile. Di versi Desktop, bagian bawah Sidebar hanya menampilkan teks statis.
**Instruksi:**
- **Injeksi Komponen Clerk:** Impor komponen `<UserButton />` dari `@clerk/nextjs`.
- **Penempatan Desktop:** Tempatkan `<UserButton />` tersebut di bagian bawah Sidebar Admin (versi Desktop). 
- **Pengaturan UX:** Anda dapat meletakkannya berdampingan dengan nama/email Admin atau menggantikan tombol teks "Keluar" yang lama. Pastikan komponen ini dirender dengan rapi sehingga saat Admin menggunakan PC/Laptop, mereka dapat dengan mudah mengklik foto profil mereka untuk melakukan Sign Out.

**ATURAN KETAT:**
Jangan merusak struktur Layout yang sudah responsif. Pastikan HANYA teks dan tombol yang disebutkan yang diubah. Eksekusi sekarang tanpa memberikan narasi panjang!