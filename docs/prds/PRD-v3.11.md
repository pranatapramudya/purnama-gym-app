# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.11 (Hotfix)  
**Status:** Phase 3.11 - Notification Routing Correction  

---

## 1. Penyelesaian Bug UX: Rute Tombol Kembali (Back Button) Salah
**Analisis:** Saat ini, ketika pengguna membuka halaman Notifikasi dari Header (Ikon Lonceng) dan mengklik tombol "Kembali", mereka diarahkan ke halaman `/member/profile`. Ini terjadi karena sisa logika lama saat Notifikasi masih menjadi sub-menu Profil.
**Tugas Agen AI:**
- Buka file halaman atau komponen Notifikasi (misalnya `app/member/notifications/page.tsx` atau komponen terkait).
- Cari elemen tombol "Kembali" (biasanya menggunakan tag `<Link>` dari `next/link` atau `router.push()` / `router.back()`).
- UBAH target rute pengalihannya. Hapus `/member/profile` dan ganti secara eksplisit menjadi `/member/dashboard` (Beranda).
- Pastikan perubahan ini di- *save* agar navigasi pengguna kembali mengalir secara logis ke halaman utama. Eksekusi perbaikan kecil ini sekarang!