# PRD-v3.89.md
**Status:** Phase 3.99 - Dedicated Personal Trainer Portal & Strict Admin RBAC
**TUGAS ANDA:** Memisahkan hak akses navigasi (Sidebar) secara ketat antara Admin (Kasir) dan Trainer, serta membuat halaman *landing page* khusus untuk role `TRAINER` agar mereka tidak melihat Dashboard keuangan.

---

## 1. Navigasi Sidebar: Hide Menu dari Admin Kasir
**Lokasi:** `components/admin/AdminSidebar.tsx` (atau komponen navigasi Sidebar utama).
**Instruksi Eksekusi Logika UI:**
- Terapkan filter ketat berdasarkan `role` user yang sedang login.
- **Untuk Role `ADMIN` (Kasir):** SEMBUNYIKAN menu "Personal Trainer" dan "Manajemen Karyawan". Kasir HANYA boleh melihat: Dashboard (Ringkasan Harian), Member, Transaksi, dan Scanner QR.
- **Untuk Role `SUPERADMIN` (Owner):** Tampilkan SELURUH menu tanpa terkecuali.
- **Untuk Role `TRAINER` (PT):** SEMBUNYIKAN menu Dashboard, Transaksi, Member (Master), Manajemen Karyawan, dan menu manajemen Personal Trainer (Master). Trainer HANYA boleh melihat: **"Jadwal Sesi Saya"** dan **"Scanner QR"**.

## 2. Pembuatan Halaman Khusus Trainer ("Jadwal Sesi Saya")
**Lokasi:** Halaman baru di `app/admin/my-schedule/page.tsx` (atau *routing* sejenis untuk PT).
**Instruksi Eksekusi UI/UX:**
- Buat sebuah halaman Server Component yang khusus diakses oleh `TRAINER`.
- **Tampilan Utama:** Sebuah tabel atau *list view* minimalis berbahasa Indonesia yang menampilkan daftar jadwal klien/member yang mem- *booking* PT tersebut pada hari ini dan hari-hari mendatang.
- Tarik (fetch) data ini dari tabel jadwal/sesi di Prisma, filter secara ketat di mana `trainerId` sama dengan ID PT yang sedang login.
- Halaman ini HANYA menampilkan data, belum perlu ada aksi rumit selain melihat nama klien, jam mulai, dan status sesi.

## 3. Smart Redirect (Routing & Middleware)
**Lokasi:** Middleware Clerk (`middleware.ts`) atau logika *redirect* setelah login sukses.
**Instruksi Eksekusi Logika:**
- Saat user dengan role `TRAINER` berhasil login (melalui portal login rahasia admin), JANGAN arahkan mereka ke `/admin/dashboard` (karena Dashboard berisi metrik omzet keuangan).
- Arahkan (redirect) `TRAINER` secara otomatis langsung ke `/admin/my-schedule` yang baru saja dibuat.
- Jika `TRAINER` mencoba mengetik manual URL `/admin/dashboard` atau `/admin/transactions` di browser, tendang (redirect) mereka kembali ke `/admin/my-schedule` dengan respons *Unauthorized*.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan logika penyembunyian menu dan *redirect* ini langsung menggunakan state/auth hooks yang tersedia. Pastikan *wording* di halaman PT menggunakan bahasa Indonesia.