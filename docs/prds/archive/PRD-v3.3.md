# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.3  
**Status:** Phase 3.3 - Global Data Synchronization (Replacing Dummy with Real Data)  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), Tailwind CSS, Clerk, Prisma, Neon DB.

---

## 1. Objektif Utama (Fokus Saat Ini)
Melakukan audit menyeluruh pada seluruh halaman (Member & Admin) untuk mengganti data *dummy/hardcoded* menjadi data dinamis yang bersumber dari database PostgreSQL (Neon DB) menggunakan arsitektur *Server Components* dan *Server Actions* bawaan Next.js.

## 2. Instruksi Audit & Sinkronisasi untuk Agen AI

**A. Pembuatan Centralized Server Actions (`app/actions/`)**
Tugas Agen: Buat pustaka fungsi *backend* yang aman dan terpusat.
1. Buat folder/file khusus untuk menangani operasi database (misal: `app/actions/member.ts` dan `app/actions/admin.ts`), tandai bagian atas file dengan direktif `"use server"`.
2. Jangan lupakan pemanggilan fungsi `revalidatePath` pada setiap aksi mutasi (Create/Update/Delete) agar antarmuka pengguna langsung terbarui tanpa perlu *refresh* peramban.

**B. Sinkronisasi Area Member (`/member/...`)**
Tugas Agen: Hapus data palsu di antarmuka member.
1. **Beranda/Dashboard & Profil:** Ganti teks status *membership* statis dengan query Prisma yang membaca `membershipType` dan `membershipUntil` dari pengguna yang sedang aktif (berdasarkan ID Clerk saat ini).
2. **Jadwal Kelas:** Pada antarmuka pendaftaran kelas, ganti daftar kelas statis dengan query `prisma.classSession.findMany()` yang hanya menampilkan kelas dengan jadwal di masa depan.
3. Hubungkan tombol "Daftar/Booking" dengan *Server Action* yang memasukkan data ke tabel `Booking` dan mengurangi slot kuota kelas secara *atomic*.

**C. Sinkronisasi Area Admin (`/admin/...`)**
Tugas Agen: Hidupkan panel kendali operasional bisnis.
1. **Dashboard Analytics:** Ganti kartu metrik statis dengan query agregasi Prisma (misal: `prisma.user.count()` untuk total member, agregasi `Transaction` untuk total pendapatan).
2. **Manajemen Member (`/admin/members`):** Hubungkan tabel dengan daftar seluruh pengguna dari database. Fungsikan tombol "Edit" untuk mengubah status *membership* melalui *Server Actions*.
3. **Manajemen Kelas (`/admin/classes`):** Fungsikan operasi CRUD penuh (Create, Read, Delete) pada antarmuka tabel kelas. Pastikan pembuatan kelas baru benar-benar tersimpan ke tabel `ClassSession`.
4. **Manajemen Transaksi (`/admin/transactions`):** Tampilkan riwayat transaksi riil, dan fungsikan tombol "Verifikasi" untuk mengubah `TransactionStatus` dari `PENDING` menjadi `SUCCESS` (serta memperbarui tanggal `membershipUntil` milik pengguna yang bersangkutan secara otomatis).

## 3. Aturan Kode Eksekusi (Strict Rules)
- Dilarang keras memicu *Client-side Fetching* (seperti SWR atau React Query) kecuali sangat mendesak. Selalu prioritaskan *Server Components* bawaan App Router untuk mengambil data.
- Setiap operasi mutasi ke database wajib memicu komponen UI `AdminToast` atau peringatan Modern yang sudah dibuat di fase sebelumnya untuk memberikan umpan balik (berhasil/gagal) kepada pengguna.
- Pastikan pengecekan proteksi otorisasi (`role === 'ADMIN'`) diterapkan di dalam setiap fungsi *Server Action* khusus admin, bukan hanya di level UI.