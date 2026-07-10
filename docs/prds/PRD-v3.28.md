# PRD-v3.28.md
**Status:** Phase 3.28 - Discount Percentage Automation & UI Badge
**TUGAS ANDA:** Ubah logika input form admin menjadi berbasis persentase diskon, dan tambahkan *badge* diskon pada UI Member. **DILARANG mengubah skema Prisma (Database)!** Kita akan menggunakan kalkulasi matematika di sisi *Client*.

---

## 1. Perombakan Form Admin (Kalkulasi Diskon Otomatis)
**Instruksi:** Buka komponen Modal Form Tambah/Edit Paket Admin.
- **Hapus/Sembunyikan** input manual untuk "Harga Jual" (`price`).
- Tambahkan input baru bernama **"Diskon (%)"** dengan tipe *number* (batas 0 hingga 100).
- **Logika State React:** - Buat *state* untuk `discountPercent`.
  - Buat kalkulasi otomatis untuk Harga Jual menggunakan rumus: 
    `const calculatedPrice = originalPrice - (originalPrice * (discountPercent / 100));`
  - Jika form ini dalam mode "Edit", cari persentase awalnya menggunakan rumus kebalikan: 
    `Math.round(((originalPrice - price) / originalPrice) * 100)`.
- Tampilkan `calculatedPrice` ini di bawah input diskon dalam bentuk teks *read-only* (Misal: "Harga Final Jual: Rp 150.000") agar Admin bisa memverifikasi angkanya.
- Saat tombol "Simpan" ditekan, kirim nilai `calculatedPrice` tersebut ke *Server Action* sebagai `price`.

## 2. Penambahan Badge Diskon (Frontend Member)
**Instruksi:** Buka komponen Card Paket VIP di halaman Member.
- Pastikan logika sebelumnya tetap berjalan (menampilkan harga coret jika `originalPrice` lebih besar dari `price`).
- **Kalkulasi Persentase Dinamis:** Di dalam komponen render, hitung persentase diskon secara langsung:
  `const discountPromo = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);`
- **UI Badge Modern:** Tampilkan *badge* diskon di sebelah atau di atas harga coret dengan desain *eye-catching* ala aplikasi E-Commerce. 
  Contoh *class* Tailwind:
  `<span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md ml-2 animate-pulse">- {discountPromo}%</span>`

**ATURAN KETAT:**
Terapkan logika matematika di atas pada komponen React Anda! Jangan buat kolom baru di database, manfaatkan kolom `price` dan `originalPrice` yang sudah ada untuk mendapatkan persentasenya. Berikan kode revisi untuk form admin dan UI member sekarang!