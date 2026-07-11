# PRD-v3.27.md
**Status:** Phase 3.27 - Schema Expansion & Marketing Features for VIP Packages
**TUGAS ANDA:** Lakukan perombakan *Full-Stack* (Database, Server Action, Admin UI, dan Member UI) untuk mendukung fitur Deskripsi Paket dan Harga Promo (Harga Coret).

---

## 1. Update Database (Prisma Schema)
**Instruksi:** Buka file `prisma/schema.prisma`.
- Cari model yang menyimpan data Paket VIP (misalnya `MembershipPackage` atau sejenisnya).
- Tambahkan 2 *field* baru:
  1. `description` (tipe `String?` atau opsional) -> Untuk menyimpan fasilitas seperti "Khusus Pelajar, Ruangan Nyaman, dll".
  2. `originalPrice` (tipe `Int?` atau opsional) -> Untuk menyimpan harga asli/harga coret sebelum diskon.
- *Peringatan untuk User:* Ingatkan *user* untuk menjalankan `npx prisma db push` setelah Anda memberikan pembaruan skema ini.

## 2. Update Server Actions (Backend)
**Instruksi:** Buka file `app/actions/admin.ts` (atau tempat fungsi CRUD paket berada).
- Sesuaikan fungsi `createPackage` dan `editPackage` agar menerima parameter `description` dan `originalPrice`.
- Pastikan logika penyimpanannya tidak *error* jika form tersebut dikosongkan (gunakan tipe opsional).

## 3. Update Form Admin (Tambah & Edit Paket)
**Instruksi:** Buka komponen Modal Form Anda (seperti pada gambar yang diberikan user).
- Tambahkan input `<textarea>` untuk **Deskripsi Paket**. Berikan *placeholder*: "Contoh: Khusus Pelajar, Free Wifi (pisahkan dengan koma)".
- Tambahkan input angka untuk **Harga Normal (Coret)**. Beri label "Harga Normal (Opsional)" dan letakkan di atas input "Harga Jual". 
- *Logika UI:* "Harga Normal" adalah harga yang akan dicoret (misal 175.000), sedangkan "Harga Jual" adalah harga yang harus dibayar member (misal 150.000).

## 4. Update Tampilan Card VIP (Frontend Member)
**Instruksi:** Buka halaman tempat *Member* melihat dan memilih paket VIP.
- **Logika Harga Coret:** Jika `originalPrice` memiliki nilai dan lebih besar dari `price` (Harga Jual), tampilkan `originalPrice` dengan desain teks dicoret (`line-through text-slate-400 text-sm`) tepat di atas/samping harga jual yang dicetak tebal.
- **Tampilan Deskripsi:** Render `description` di dalam kartu paket. Jika kosong, tidak perlu ditampilkan. Gunakan desain teks yang rapi (`text-sm text-slate-600`).

**ATURAN EKSEKUSI:**
Eksekusi dari tahap Database hingga Frontend! Berikan panduan terminal untuk sinkronisasi Prisma, dan berikan revisi kode UI secara lengkap!