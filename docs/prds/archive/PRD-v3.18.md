# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.18  
**Status:** Phase 3.18 - UI Contrast & Page Header Consistency

---

## 1. Objektif Utama
Memperbaiki kontras teks (*Accessibility*) pada Header utama agar lebih mudah dibaca, serta menyeragamkan desain judul halaman (Jadwal Kelas, Jadwal Pribadi, Panduan Latihan, dan Profil Saya) dengan latar belakang gradasi hijau tosca yang sama seperti Beranda, namun tetap mempertahankan warna teks hitam/gelap.

---

## 2. Perbaikan Kontras Header Utama (Beranda)
Tugas Agen: Buka komponen *Header* global untuk Member (misalnya di `app/member/layout.tsx` atau `components/Header.tsx`).
- Cari elemen teks logo **"Purnama Gym"**.
- HAPUS *class* Tailwind `text-white`.
- GANTI menjadi `text-slate-900 font-extrabold` (Hitam/Abu-abu sangat gelap) agar kontras dengan latar belakang gradasi hijau tosca.
- Pastikan ikon lonceng notifikasi dan elemen di sekitarnya juga disesuaikan warnanya menjadi gelap agar seragam.

---

## 3. Penyeragaman Latar Belakang Judul Halaman (Page Headers)
Tugas Agen: Terapkan *styling banner header* pada 4 halaman berikut:
1. `app/member/jadwal/page.tsx` (Jadwal Kelas & Jadwal Pribadi)
2. `app/member/panduan/page.tsx` (Panduan Latihan)
3. `app/member/profile/page.tsx` (Profil Saya)

**Instruksi Styling:**
- Saat ini, teks judul seperti "Jadwal Kelas" hanya memiliki latar belakang transparan/putih.
- Bungkus tag `<h1>` (Judul) dan `<p>` (Sub-judul/Deskripsi) ke dalam sebuah `<div className="...">`.
- Terapkan *class* Tailwind berikut pada `div` pembungkus tersebut: 
  `bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-8 rounded-b-3xl shadow-sm mb-6`
- **Penting:** Pastikan teks di dalam *banner* tersebut menggunakan warna hitam/gelap (`text-slate-900`) agar terbaca dengan jelas. Contoh:
  ```tsx
  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-8 rounded-b-3xl shadow-sm mb-6">
    <h1 className="text-2xl font-bold text-slate-900">Jadwal Kelas</h1>
    <p className="text-slate-800 mt-1">Pilih dan booking kelas favoritmu</p>
  </div>

  4. Standar Eksekusi
Lakukan perubahan ini secara merata agar setiap kali pengguna berpindah tab (dari Beranda ke Jadwal, Panduan, atau Profil), mereka disambut dengan banner header lengkung (rounded-b-3xl) berwarna hijau tosca yang konsisten.

Eksekusi sekarang juga!