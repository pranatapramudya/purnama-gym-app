# PRD-v3.34.md
**Status:** Phase 3.34 - Landing Page Brand Color Synchronization
**TUGAS ANDA:** Mengubah seluruh skema warna (color palette) pada halaman utama (Landing Page) dari warna Pink/Magenta menjadi Hijau Tosca/Emerald agar selaras dengan identitas merek "Purnama Gym".

---

## 1. Analisis UI & Sinkronisasi Merek
**Masalah:** Komponen Landing Page (`app/page.tsx`) masih menggunakan sisa-sisa *class* warna dari *boilerplate* lama (seperti `text-pink-500`, `bg-pink-600`, dll). Hal ini merusak konsistensi merek yang seharusnya menggunakan warna hijau tosca.

## 2. Instruksi Refactoring Warna (Wajib Diikuti!)
Buka file `app/page.tsx` (Halaman Root). Lakukan *Find and Replace* secara semantik pada *class* Tailwind Anda:

- Ubah semua varian `pink`, `rose`, atau `fuchsia` menjadi varian `emerald` atau `teal`.
- **Panduan Konversi:**
  - Teks sorotan (misal: tulisan "di Sumedang."): Ubah dari `text-pink-500` menjadi `text-emerald-500` atau `text-teal-600`.
  - Latar belakang tombol ("Masuk / Daftar Sekarang"): Ubah dari `bg-pink-500 hover:bg-pink-600` menjadi `bg-emerald-600 hover:bg-emerald-700`.
  - Elemen dekoratif/Badge ("Khusus Wanita"): Ubah latar belakang dari `bg-pink-50` menjadi `bg-emerald-50` dan teksnya dari `text-pink-600` menjadi `text-emerald-700`.
  - Titik dekoratif (Dot): Ubah dari `bg-pink-500` menjadi `bg-emerald-500`.

**ATURAN KETAT:**
HANYA ubah nama warna pada *class* Tailwind! DILARANG merusak struktur HTML, teks bahasa Indonesia, atau memodifikasi tombol tautan ke `/sign-in` yang sudah ada. Berikan kode utuh `app/page.tsx` yang sudah diubah warnanya!