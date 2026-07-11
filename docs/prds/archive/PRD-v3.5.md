# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.5  
**Status:** Phase 3.5 - Total Responsiveness Audit & Final Data Binding  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi:** Next.js 15+ (App Router), Tailwind CSS, Prisma.

---

## 1. Objektif Utama
Melakukan audit total terhadap tata letak (Layout) Admin agar 100% responsif (Mobile & Desktop), menyelesaikan *binding* data dinamis yang tertinggal (Dropdown Kategori & Riwayat QR), serta memperbaiki tampilan layar kosong (Blank Screen) pada halaman Paket VIP.

---

## 2. Rombak Total Layout Admin (Responsivitas Mobile vs Desktop)
Tugas Agen: Edit file `app/admin/layout.tsx`. Layout saat ini rusak (menumpuk) jika dibuka di perangkat *mobile*.
- **Tampilan Desktop (md: ke atas):** Pertahankan *Sidebar* di sebelah kiri dengan lebar tetap (misal: `w-64`), layar harus terbagi menjadi `flex-row`.
- **Tampilan Mobile (layar kecil):** SEMBUNYIKAN *Sidebar* samping (`hidden md:flex`). Gantilah dengan **Bottom Navigation Bar** (Menu Bawah) yang menempel/fixed di bagian bawah layar khusus untuk tampilan mobile (`flex md:hidden fixed bottom-0 w-full`).
- Pastikan area konten utama (Main Content) memiliki *padding* bawah yang cukup di mode mobile agar tidak tertutup oleh Bottom Nav.

---

## 3. Pembersihan Data Dummy (Fokus Frontend)

**A. Dropdown Kategori Kelas (`app/member/jadwal`):**
- **HAPUS** secara eksplisit *array* statis `['Cardio', 'Flexibility', 'Strength', 'Zumba']`!
- **Solusi:** Ambil data kelas menggunakan `prisma.gymClass.findMany()`. Lakukan *mapping* untuk mengekstrak properti `category`, gunakan `Set` atau logika filter untuk membuang duplikat agar hanya tersisa kategori yang unik (termasuk kelas "Pilates" yang baru ditambahkan Admin). Jadikan hasil ekstraksi ini sebagai opsi dinamis untuk dropdown.

**B. Riwayat Scanner QR (`app/admin/scanner`):**
- **HAPUS** nama-nama statis (Sisca, Rina, Dewi).
- **Solusi:** Ganti dengan *Server Component* yang melakukan *fetch* data ke Prisma untuk mengambil riwayat absensi/kunjungan hari ini (berdasarkan tanggal saat ini, *order by desc*).

**C. Layar Blank Halaman Paket VIP (`app/member/packages`):**
- Halaman saat ini *blank* (putih kosong).
- **Solusi:** Lakukan *fetch* ke model `MembershipPackage` (yang sudah dibuat di PRD 3.4). 
- **Penting:** Tambahkan *Empty State Handling*! Jika array paket dari Prisma kosong (`length === 0`), tampilkan UI pesan yang ramah: "Saat ini belum ada paket VIP yang tersedia. Silakan hubungi Admin."

**D. Input Harga Paket VIP (`app/admin/packages`):**
- Pastikan Admin memiliki antarmuka (Form/Modal) yang utuh untuk melakukan operasi CREATE dan DELETE pada model `MembershipPackage` (Nama Paket, Durasi Bulan, dan Harga).

---

## 4. Standar Kualitas Pengecekan Agen AI
- Periksa seluruh *className* Tailwind. Gunakan *modifier* `md:` dengan benar untuk membedakan antarmuka iOS/Mobile dan Desktop.
- Jangan tinggalkan satu pun teks statis untuk nama pengguna, harga, atau jadwal kelas. Semua HARUS berasal dari *database*.