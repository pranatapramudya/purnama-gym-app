# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.9 (Hotfix)  
**Status:** Phase 3.9 - Mobile Layout Spacing Fix  

---

## 1. Penyelesaian Bug Kritis: Konten Tertutup Bottom Navigation
**Analisis:** Pada halaman Beranda/Dashboard Member (`app/member/dashboard/page.tsx`), elemen paling bawah ("Info Penting") tertutup/terpotong oleh komponen *Bottom Navigation* yang posisinya *fixed*.
**Tugas Agen AI:**
- Buka file *layout* utama untuk member (`app/member/layout.tsx`) ATAU file halaman beranda (`app/member/dashboard/page.tsx`).
- Cari tag `<main>` atau `<div>` pembungkus utama yang menampung seluruh konten halaman.
- Tambahkan kelas Tailwind `pb-24` atau `pb-28` pada *container* tersebut agar ada jarak kosong ekstra di bagian bawah. 
- Jarak ekstra ini akan memastikan pengguna bisa men-*scroll* hingga elemen "Info Penting" berada tepat di atas batas *Bottom Navigation* tanpa terpotong.
- Lakukan penyesuaian ini sekarang juga!