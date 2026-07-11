# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.4  
**Status:** Phase 3.4 - Deep Sync, Bug Fixes, & Schema Expansion  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi:** Next.js 15+ (App Router), Prisma, Neon DB.

---

## 1. Objektif Utama
Membersihkan sisa data statis (*dummy*) pada halaman member, memperbaiki *crash* di halaman admin, serta memperluas skema database untuk memberikan kontrol penuh kepada Admin terkait Harga Paket dan Konten Panduan.

---

## 2. Pembaruan Skema Database (Wajib Dieksekusi Pertama)
Tugas Agen: Tambahkan dua model baru di `prisma/schema.prisma` untuk mengakomodasi kebutuhan Admin.
1. **Model `MembershipPackage`**: 
   - Fields: `id`, `name` (String, misal: "1 Bulan", "3 Bulan"), `durationMonths` (Int), `price` (Float/Int), `createdAt`, `updatedAt`.
2. **Model `GuideVideo`**:
   - Fields: `id`, `title` (String), `url` (String - link YouTube), `category` (String), `createdAt`, `updatedAt`.
3. **PENTING**: Setelah skema diperbarui, arahkan pengguna (melalui teks balasan) untuk menjalankan perintah `npx prisma db push` dan `npx prisma generate` di terminal mereka.

---

## 3. Sinkronisasi & Perbaikan Halaman Admin
1. **Perbaikan Crash Transaksi (`/admin/transactions`):** 
   - Lakukan *debugging* dan perbaiki *error* yang terjadi saat halaman/tombol transaksi diklik. Pastikan relasi data (misalnya `transaction.user.name`) tidak mengembalikan *undefined* yang memicu *crash* di UI.
2. **Perbaikan Kategori & Fitur Edit Kelas (`/admin/classes`):** 
   - Tambahkan fungsionalitas tombol **Edit** melalui *Server Actions* agar Admin dapat mengubah kelas (termasuk Kategorinya). 
   - Kategori kelas saat pembuatan/pengeditan harus tersimpan dengan benar di database agar selaras dengan filter di halaman Member.
3. **Fitur Baru - Manajemen Paket (`/admin/packages`):** 
   - Buat halaman CRUD baru untuk model `MembershipPackage`. Admin dapat mengatur nama paket dan menetapkan nominal harganya.
4. **Fitur Baru - Manajemen Panduan (`/admin/guides`):**
   - Buat halaman CRUD baru untuk model `GuideVideo`. Admin dapat menambah, mengedit, dan menghapus *link* program gym.

---

## 4. Sinkronisasi Halaman Member (Penghapusan Dummy)
1. **Beranda & Filter Kategori (`/member/dashboard`):** 
   - Ganti kategori filter statis dengan kategori dinamis yang di-*extract* secara unik dari data `GymClass` di Prisma.
2. **Halaman Jadwal (`/member/jadwal`):**
   - Ganti *list* jadwal statis dengan data langsung dari tabel kelas database (`prisma.gymClass.findMany`). Tampilkan hanya jadwal yang relevan.
3. **Pemilihan Paket & Pembayaran (`/member/packages` & `/member/payment`):**
   - Hapus data harga *dummy*. Ambil daftar paket beserta harganya langsung dari tabel `MembershipPackage` yang telah diatur Admin. 
   - Saat pengguna memilih paket dan menuju pembayaran, total tagihan (`amount`) harus sesuai dengan harga dari database tersebut.
4. **Halaman Panduan (`/member/guide`):**
   - Ganti video statis dengan daftar video yang diambil dari tabel `GuideVideo`.
5. **Menu Profil (`/member/profile`):**
   - Aktifkan rute/navigasi untuk tautan "Riwayat Transaksi" (`/member/profile/history`) dan "Notifikasi". Buat halaman penampung (*placeholder page*) sederhana jika halamannya belum ada, agar menu tidak terlihat mati.