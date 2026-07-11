# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.2 (Revised)  
**Status:** Phase 3.2 - Localhost Webhook Bypass & Authentication Sync  
**Target Pasar:** Khusus Wanita (Sumedang)  
**Teknologi Utama:** Next.js 15+ (App Router), Tailwind CSS, Clerk, Neon DB (Serverless PostgreSQL), Prisma 7+[cite: 1].

---

## 1-7. (Fase Sebelumnya Dikunci)
*Catatan: Fokus eksklusif pada perbaikan aliran data Autentikasi di lingkungan pengembangan lokal (localhost).*

---

## 8. Penyelesaian Bug Kritis: Localhost Webhook Sync Failure

**A. Analisis Akar Masalah (Konteks LumeStack Boilerplate):**
- Proyek ini pada awalnya menggunakan arsitektur LumeStack yang mengandalkan Clerk Webhooks (`/api/webhooks/clerk`) untuk sinkronisasi data dari Clerk ke tabel database Prisma[cite: 1].
- Karena saat ini aplikasi dijalankan pada lingkungan `localhost` tanpa *tunneling* (Ngrok), Webhook dari Clerk gagal diterima. Hal ini menyebabkan data pengguna ada di Clerk, tetapi tidak pernah dibuat di database Prisma.
- Kekosongan data di Prisma ini memicu *Infinite Redirect Loop* pada rute proteksi admin, karena sistem tidak dapat menemukan profil dan status *role* pengguna.

**B. Solusi Utama: Mekanisme Bypass Webhook untuk Local Development**
Tugas Agen AI: Buat sistem sinkronisasi manual (*Check-and-Create*) yang berjalan secara spesifik saat pengguna masuk ke halaman member, guna mem-bypass ketergantungan pada Webhook saat pengembangan lokal.

*Instruksi Logika untuk Agen:*
1. Lokasikan file halaman utama untuk member (misalnya `app/member/dashboard/page.tsx`).
2. Tulis logika *Server Component* di bagian paling atas sebelum merender antarmuka pengguna.
3. Gunakan metode pembacaan sesi dari Clerk untuk mendapatkan ID pengguna yang sedang aktif saat ini.
4. Lakukan pencarian ke database Prisma berdasarkan ID pengguna Clerk tersebut.
5. **Logika Inti:** Jika hasil pencarian di Prisma mengembalikan nilai kosong (berarti pengguna baru pertama kali masuk dan Webhook gagal bekerja), perintahkan Prisma untuk membuat entri pengguna baru saat itu juga.
6. Isi kolom pembuatan data dengan memetakan ID Clerk ke `clerkId`, mengambil nama dari objek Clerk, serta memberikan nilai *default* `MEMBER` untuk status *role*.

**C. Perbaikan Logika Redirect pada Layout Admin**
Tugas Agen AI: Cegah terjadinya *looping* tanpa ujung pada sistem pembatasan rute.

*Instruksi Logika untuk Agen:*
1. Buka file pelindung rute admin (`app/admin/layout.tsx`).
2. Jika pengecekan *database* mengembalikan nilai kosong (pengguna tidak ada di tabel Prisma) ATAU pengguna tersebut bukan `ADMIN`, sistem dilarang keras membuang pengguna ke rute otentikasi (seperti halaman *Sign In* atau `/`).
3. Sistem wajib mengarahkan secara paksa *redirect* pengguna tersebut ke rute `/member/dashboard`. Hal ini akan memastikan pengguna melewati fungsi sinkronisasi manual yang telah dibuat pada Solusi B.

---

## 9. Full-Stack Implementation Tracker
- [x] **Phase 1 & 2:** UI/UX, Routing, PWA, dan State Management.
- [x] **Phase 3.0 & 3.1:** Inisiasi Prisma Schema & Layout Skeleton Admin.
- [x] **Phase 3.2 (Fokus Saat Ini):** Membangun jalur *bypass* untuk mengatasi kegagalan Webhook lokal pada Boilerplate LumeStack agar Clerk dapat bersinkronisasi ke Prisma, sekaligus memperbaiki *Infinite Loop* pada proteksi rute admin.
- [ ] **Phase 3.3:** Implementasi Server Actions untuk operasional CRUD.