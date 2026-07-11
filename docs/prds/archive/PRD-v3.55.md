# PRD-v3.55.md
**Status:** Phase 3.55 - Prisma-Driven RBAC & Single-Page Conditional UI
**TUGAS ANDA:** Mengimplementasikan Role-Based Access Control (RBAC) dengan menjadikan database Prisma sebagai Source of Truth, dan menerapkan Conditional Rendering pada satu halaman (tanpa menduplikasi file) untuk membedakan tampilan Admin dan Superadmin.

---

## 1. Otentikasi Role via Prisma (Source of Truth)
**Lokasi:** `app/admin/layout.tsx` dan `app/admin/(dashboard)/page.tsx`
**Instruksi:**
- HAPUS logika pengambilan `role` dari `sessionClaims` Clerk.
- Gunakan `auth().userId` dari Clerk hanya untuk mendapatkan identitas.
- Lakukan pemanggilan ke database: `const currentUser = await prisma.user.findUnique({ where: { clerkUserId: userId } })`.
- Gunakan `currentUser.role` sebagai basis penentuan hak akses. Jika bukan `admin` atau `superadmin`, lakukan `redirect('/')`.

## 2. Larangan Keras Duplikasi File (No Copy-Paste)
**Instruksi Arsitektur:**
- JANGAN membuat rute atau file baru seperti `/superadmin/page.tsx`.
- Tetap gunakan satu file `/admin/(dashboard)/page.tsx` untuk kedua role tersebut.

## 3. Eksekusi Conditional Rendering (UI)
**Lokasi:** `app/admin/(dashboard)/page.tsx`
**Instruksi:**
- Gunakan variabel `currentUser.role` yang didapat dari Prisma untuk menyembunyikan atau menampilkan elemen spesifik.
- **Tampilan Superadmin:** Render komponen Grafik Keuangan dan Total Pendapatan Harian HANYA jika `currentUser.role === 'superadmin'`.
- **Tampilan Admin:** Jika `currentUser.role === 'admin'`, sembunyikan grafik dan ganti dengan teks: "Akses Dibatasi - Grafik Finansial hanya untuk Manajemen". Biarkan widget seperti Sesi PT dan Total Member tetap terlihat.

**ATURAN KETAT:**
DILARANG memberikan blok kode dalam balasan Anda! HANYA kerjakan modifikasi logika ini secara langsung di *environment* proyek. Pastikan tidak ada file yang diduplikasi!