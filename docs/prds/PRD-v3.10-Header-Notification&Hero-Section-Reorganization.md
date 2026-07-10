# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.10  
**Status:** Phase 3.10 - Header Notification & Hero Section Reorganization  

---

## 1. Objektif Utama
Membersihkan area *Hero* (atas) dari teks sapaan statis, memindahkan "Info Penting" ke posisi teratas agar lebih terlihat, dan memindahkan akses fitur "Notifikasi" menjadi ikon lonceng (*Bell*) di bagian *Header* utama untuk menghemat ruang dan meningkatkan standar UI/UX aplikasi modern.

---

## 2. Reorganisasi Hero Section & Info Penting
Tugas Agen: Buka komponen halaman Beranda Member (`app/member/dashboard/page.tsx`).
- **HAPUS** komponen kotak/banner yang berisi teks "Siap untuk jadwal latihan kebugaran Anda hari ini?".
- **PINDAHKAN** komponen "Info Penting" (yang saat ini berada di bagian paling bawah layar) ke posisi paling atas, tepat menggantikan posisi banner teks yang baru saja dihapus (di atas Kartu Membership hitam).

---

## 3. Pemindahan Fitur Notifikasi ke Header
Tugas Agen: Merombak akses notifikasi menjadi gaya aplikasi modern.
- **HAPUS** tombol/kartu "Notifikasi" berukuran besar dari daftar menu di halaman `app/member/dashboard/page.tsx`.
- Buka file komponen *Header* untuk area member (biasanya ada di `app/member/layout.tsx` atau komponen `Header.tsx` terpisah).
- Di sisi kanan *Header*, tepat di **sebelah kiri** foto profil Clerk (`<UserButton />`), tambahkan ikon lonceng (gunakan `<Bell />` dari pustaka `lucide-react`).
- Berikan *styling* yang sesuai pada ikon lonceng tersebut (misalnya warna putih agar kontras dengan *background* hijau gradasi) dan pastikan ikon tersebut sejajar vertikal (*items-center*) dengan foto profil Clerk.
- *(Opsional: Jadikan ikon lonceng tersebut sebagai tautan atau pemicu modal/dropdown yang mengarah ke fitur notifikasi).*

---

## 4. Standar Eksekusi
- Lakukan penyesuaian jarak (*margin/gap*) agar elemen "Info Penting" di atas tidak terlalu menempel dengan *Header* atau Kartu Membership di bawahnya.
- Tetap gunakan Bahasa Indonesia dalam penulisan komentar atau teks antarmuka. Eksekusi perubahan komponen ini sekarang!