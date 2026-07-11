# PRD-v3.86.md
**Status:** Phase 3.86 - Super User: Automated Staff Account Generation & Auth Integration
**TUGAS ANDA:** Membangun modul "Manajemen Karyawan" khusus untuk Super User. Sistem harus mampu membuat akun kredensial asli (terintegrasi dengan Authentication Provider dan Database) untuk role Admin dan Personal Trainer dengan pembuatan kata sandi otomatis.

---

## 1. UI/UX: Halaman Manajemen Karyawan
**Lokasi:** Modul Super User (misal: `app/superadmin/staff/page.tsx`).
**Instruksi Eksekusi UI:**
- Buat halaman tabel yang menampilkan daftar seluruh pengguna dengan `role` sebagai `ADMIN`, `SUPERADMIN`, dan `TRAINER`.
- Sediakan tombol utama: **"+ Tambah Karyawan Baru"**.

## 2. Modal Form: Pembuatan Akun Otomatis
**Lokasi:** Komponen Modal di dalam halaman Manajemen Karyawan.
**Instruksi Eksekusi UI:**
- Rancang form minimalis yang HANYA meminta 3 input dari Super User:
  1. `Nama Lengkap`
  2. `Email Aktif` (Wajib untuk login)
  3. `Pilih Jabatan (Role)` (Dropdown: Admin Kasir, Personal Trainer).
- **PENTING:** JANGAN sediakan input "Kata Sandi" (Password). Kata sandi akan di-generate otomatis oleh sistem di belakang layar.

## 3. Server Action & Auth Integration (Zero Dummy Data)
**Lokasi:** File Server Actions (`app/actions/superadmin.ts`).
**Instruksi Eksekusi Logika Backend:**
- Saat form di-submit, Server Action wajib melakukan hal berikut secara berurutan:
  1. **Generate Password:** Buat fungsi utilitas untuk menghasilkan *strong password* acak (Contoh: kombinasi 8 karakter unik, angka, dan simbol seperti `Purnama_9x#A`).
  2. **Auth Creation:** Gunakan Backend API dari sistem Autentikasi Anda (misal: Clerk API `clerkClient.users.createUser()` atau NextAuth/Prisma hash) untuk mendaftarkan *email* dan *password* yang di-generate tersebut agar Karyawan benar-benar bisa login.
  3. **Database Insert:** Simpan data karyawan tersebut ke tabel `User` di Prisma dengan `role` yang sesuai. Pastikan sinkron dengan ID Autentikasi.
- **One-Time Credential View:** Setelah berhasil, kembalikan response sukses beserta *password plaintext* tersebut ke Frontend.
- Tampilkan UI Pop-up "Akun Berhasil Dibuat!" yang memperlihatkan **Email dan Kata Sandi** sementara tersebut (Beri tombol "Copy Kredensial"). Berikan peringatan visual kepada Super User: *"Simpan kredensial ini dan berikan kepada karyawan. Sandi ini hanya ditampilkan satu kali ini saja!"*

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan integrasi ini langsung ke SDK Autentikasi yang digunakan pada proyek. Pastikan tidak ada data karyawan *dummy*, semua akun yang dibuat dari form ini HARUS bisa digunakan untuk login secara nyata.