# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.6  
**Status:** Phase 3.6 - Missing Admin Menus & Final Frontend Binding  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi:** Next.js 15+ (App Router), Tailwind CSS, Prisma, Neon DB.

---

## 1. Objektif Utama
Menambahkan menu navigasi yang tertinggal pada *Sidebar* Admin (Paket VIP & Panduan Pemula), menghubungkan logika *Scanner* QR ke *database* secara *real-time*, dan mengoreksi data statis pada dropdown kategori di halaman Booking Member.

---

## 2. Penambahan Menu Sidebar Admin
Tugas Agen: Buka file komponen *Sidebar* Admin (misalnya di `app/admin/layout.tsx` atau komponen navigasi terpisahnya) dan tambahkan 2 tautan menu baru:
1. **Menu "Paket VIP" (`/admin/packages`):**
   - Pastikan rute ini mengarah ke halaman CRUD model `MembershipPackage`.
   - Admin harus bisa menginput: Judul Durasi (misal: "1 Bulan") dan Harga (misal: 150000). Data ini yang nantinya akan otomatis muncul di halaman `/member/packages`.
2. **Menu "Panduan Pemula" (`/admin/guides`):**
   - Pastikan rute ini mengarah ke halaman CRUD model `GuideVideo`.
   - Admin harus bisa menginput: Judul Panduan, Deskripsi, dan URL Link YouTube.

---

## 3. Integrasi Real-Time QR Scanner (`app/admin/scanner`)
- **HAPUS** logika simulasi (*dummy success/mock data*) pada fungsi *Scanner* QR.
- **Implementasi Server Action:** Ketika *barcode* di-*scan*, jalankan *Server Action* (misal: `processQRCheckIn(userId)`).
- Tindakan ini harus melakukan validasi ke Prisma:
  - Cek apakah *member* dengan ID tersebut valid dan paketnya masih aktif.
  - Catat kehadiran ke dalam tabel `Attendance` atau `Transaction` (sesuai skema yang ada).
  - Kembalikan respons berhasil/gagal yang sebenarnya ke UI beserta nama riil *member* tersebut untuk dirender di daftar "Riwayat Check-in Hari Ini".

---

## 4. Koreksi Kategori Dropdown di Halaman Booking (`app/member/booking/...`)
- **HAPUS** *array* statis `['Cardio', 'Flexibility', 'Strength', 'Zumba']` yang masih tertinggal di komponen halaman *booking*.
- **Solusi Tepat:** Ambil langsung dari *database* menggunakan query Prisma:
  ```typescript
  const uniqueCategories = await prisma.gymClass.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  Lakukan mapping hasil query tersebut dan teruskan (sebagai props jika menggunakan struktur Client-Server Component) ke elemen Dropdown UI, jangan lupa tambahkan opsi "Semua" di urutan teratas.

5. Instruksi Eksekusi
Gunakan bahasa Indonesia untuk semua teks antarmuka. Pastikan Anda memeriksa ulang apakah rute /admin/packages dan /admin/guides sudah benar-benar memiliki file page.tsx yang berisi form CRUD-nya sebelum menyatakan tugas ini selesai.