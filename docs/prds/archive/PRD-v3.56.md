# PRD-v3.56.md
**Status:** Phase 3.56 - CSV Button Patch & Cash Flow Database Architecture
**TUGAS ANDA:** Menyembunyikan tombol "Unduh Laporan (CSV)" dari staf Admin biasa, dan merancang skema database baru untuk fitur Buku Kas Harian (Cash Flow) sesuai kebutuhan operasional kasir.

---

## 1. Patch Keamanan UI (Tombol CSV)
**Lokasi:** `app/admin/(dashboard)/page.tsx` (atau komponen Dashboard yang memuat tombol CSV)
**Instruksi:**
- Temukan elemen tombol "Unduh Laporan (CSV)".
- Gunakan variabel `currentUser.role` yang sudah ada dari Prisma.
- Bungkus tombol tersebut dengan *Conditional Rendering* agar HANYA muncul jika `currentUser.role === 'superadmin'`.
- Jika rolenya hanya `admin`, tombol tersebut harus hilang sepenuhnya dari layar.

## 2. Arsitektur Database (Prisma Schema) untuk Buku Kas
**Lokasi:** `prisma/schema.prisma`
**Analisis:** Kasir membutuhkan fitur untuk mencatat uang masuk dan uang keluar harian yang nantinya akan direkonsiliasi oleh Super User.
**Instruksi:** Tambahkan model tabel baru dengan spesifikasi berikut:
- **Nama Model:** `CashFlow` (atau `BukuKas`)
- **Kolom (Fields):**
  - `id` (String, CUID, Primary Key)
  - `type` (Enum atau String: wajib bernilai 'INCOME' atau 'EXPENSE')
  - `amount` (Int atau Float: jumlah nominal uang)
  - `description` (String: keterangan, misal "Beli Galon", "Visit Harian Tunai")
  - `adminId` (String: berelasi ke tabel `User` untuk melacak kasir siapa yang menginput)
  - `createdAt` (DateTime: default now)
- **Instruksi Tambahan untuk AI:** JANGAN buatkan UI-nya dulu. Fokus HANYA pada memperbarui `schema.prisma` dan perintahkan Tech Lead (User) untuk menjalankan `npx prisma db push` setelah ini selesai.

**ATURAN KETAT:**
Tidak boleh ada duplikasi file. Hanya perbaiki komponen tombol CSV dan tambahkan skema database. Berikan rangkuman perubahan Anda secara singkat dan jelas!