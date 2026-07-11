# PRD-v3.88.md
**Status:** Phase 3.88 - Synchronized Staff Account Deletion (Clerk & Prisma)
**TUGAS ANDA:** Menambahkan fitur penghapusan akun karyawan di halaman Manajemen Karyawan. Penghapusan harus tersinkronisasi secara penuh, menghapus kredensial login di sistem autentikasi (Clerk) sekaligus menghapus data dari database lokal (Prisma).

---

## 1. UI: Tombol Hapus & Konfirmasi Keamanan
**Lokasi:** Halaman tabel Manajemen Karyawan (`app/admin/staff/StaffClient.tsx`).
**Instruksi Eksekusi UI:**
- Tambahkan kolom "Aksi" pada tabel daftar karyawan.
- Buat tombol berikon tempat sampah (warna merah) untuk opsi **Hapus**.
- **Wajib Ada UX Confirmation:** Saat tombol ditekan, JANGAN langsung menghapus. Tampilkan Modal atau Dialog Konfirmasi (Alert) dengan pesan peringatan keras: *"Apakah Anda yakin ingin menghapus akses karyawan ini secara permanen? Data kredensial akan dihapus."*
- Berikan perlindungan UI: Sembunyikan atau *disable* tombol Hapus pada baris data milik pengguna yang sedang login (Super Admin tidak boleh bisa menghapus akunnya sendiri secara tidak sengaja).

## 2. Server Action: Dual-System Deletion
**Lokasi:** Fungsi aksi server di `app/actions/superadmin.ts`.
**Instruksi Eksekusi Logika Backend:**
- Buat fungsi `deleteStaffAccount(userId: string, clerkUserId: string)`.
- **Langkah 1 (Auth Deletion):** Gunakan Clerk SDK untuk menghapus akses login pengguna secara permanen. Panggil `clerkClient().users.deleteUser(clerkUserId)`. 
- **Langkah 2 (Database Deletion):** Setelah Clerk berhasil merespons, hapus data record karyawan tersebut dari tabel `User` di Prisma (`prisma.user.delete({ where: { id: userId } })`).
- *Error Handling:* Pastikan fungsi dibungkus dengan `try-catch`. Jika penghapusan Clerk gagal (misal user tidak ditemukan), berikan respon error ke klien agar proses berhenti dan tidak membuat data tidak sinkron.

## 3. Route & Role Protection
**Instruksi Eksekusi:**
- Pastikan Server Action `deleteStaffAccount` ini diawali dengan pengecekan sesi otoritas (authorization check). HANYA user dengan role `SUPERADMIN` yang diizinkan untuk mengeksekusi fungsi ini. Tolak dengan status *Unauthorized* jika diakses oleh role lain.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan logika penghapusan ganda ini dengan hati-hati. Pastikan tabel di layar klien (`Client Component`) langsung melakukan *refresh data* (menghilangkan baris karyawan tersebut) setelah fungsi penghapusan berhasil merespons sukses.