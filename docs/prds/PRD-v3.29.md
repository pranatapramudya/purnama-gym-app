# PRD-v3.29.md
**Status:** Phase 3.29 - Input Number UI/UX Refinement (Decimals & Spin Button)
**TUGAS ANDA:** Memperbaiki pengalaman pengguna (UX) pada input "Diskon (%)" di form Admin. DILARANG MERUBAH logika kalkulasi diskon yang sudah berjalan, cukup sempurnakan inputnya!

---

## 1. Analisis Bug & UI/UX Issue
**Masalah 1:** Pengguna tidak bisa memasukkan angka desimal (koma/titik) untuk diskon yang spesifik (misal: 14,2%).
**Masalah 2:** Muncul *scrollbar* atau panah naik-turun (HTML *Spin Button*) di dalam kotak input yang merusak estetika desain modern.

## 2. Instruksi Perbaikan Input (Wajib Diikuti!)
Buka komponen *Client* untuk form Edit/Tambah Paket Admin. Cari elemen `<input>` untuk **Diskon (%)**.

**A. Sembunyikan Spin Button (Panah Atas Bawah):**
- Tambahkan *class* Tailwind khusus ini ke dalam `className` input diskon tersebut (dan juga ke input Harga Normal jika ada):
  `[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`
- *Catatan untuk Agen:* Class di atas akan memaksa *browser* (Chrome/Safari/Firefox) untuk menyembunyikan panah *spin button* bawaan.

**B. Izinkan Input Desimal/Koma:**
- Pastikan elemen input memiliki atribut `type="number"`.
- **TAMBAHKAN** atribut `step="any"` agar *browser* mengizinkan angka desimal.
- Pada fungsi `onChange`, pastikan Anda menangkap nilainya menggunakan `parseFloat()` bukan `parseInt()`. 
- **Trik Aksesibilitas (Opsional tapi disarankan):** Ganti karakter koma (`,`) menjadi titik (`.`) secara programatis sebelum di-*parse*, karena format desimal JavaScript standar menggunakan titik. 
  *Contoh logika:* `const val = e.target.value.replace(',', '.');`
  `setDiscountPercent(val === '' ? 0 : parseFloat(val));`

**ATURAN KETAT:**
Berikan KODE REVISI khusus untuk komponen form input ini saja. Pastikan setelah revisi, kalkulasi "Harga Final Jual" tetap berfungsi sempurna dan UI input terlihat bersih tanpa panah naik-turun!