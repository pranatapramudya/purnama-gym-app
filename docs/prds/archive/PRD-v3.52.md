# PRD-v3.52.md
**Status:** Phase 3.52 - Admin Bypass, Mobile UI Polish, & Superadmin Prep
**TUGAS ANDA:** Memperbaiki celah logika onboarding untuk role Admin, membersihkan sisa UI bawaan browser mobile (tanda silang), menambahkan tombol Logout di versi mobile Admin, dan menyiapkan struktur RBAC untuk Superadmin.

---

## 1. Bypass Onboarding untuk Admin & Superadmin
**Lokasi:** `app/onboarding/page.tsx` (atau Middleware jika relevan)
**Instruksi:**
- Ambil data `role` pengguna saat ini dari Clerk (melalui `sessionClaims?.metadata?.role` atau mekanisme yang Anda gunakan).
- **Logika:** Jika pengguna memiliki role `admin` atau `superadmin`, mereka TIDAK BOLEH dipaksa mengisi form Nomor HP dan Alamat.
- Langsung lakukan `redirect('/admin/dashboard')` jika role mereka adalah admin/superadmin, lewati pengecekan data form sepenuhnya.

## 2. Clean UI Mobile (Hapus Tanda 'X' Default Webkit)
**Lokasi:** `app/globals.css`
**Instruksi:**
- Browser iOS/Android sering memunculkan tombol *clear* (tanda silang 'x') bawaan pada elemen `<input>`. Ini merusak estetika e-commerce premium.
- Tambahkan CSS murni untuk menghilangkan dekorasi bawaan Webkit pada seluruh input.
- Targetkan pseudo-elements seperti `::-webkit-search-cancel-button`, `::-ms-clear`, `::-webkit-search-decoration`, dan set `display: none` atau `appearance: none`.

## 3. Perbaikan UX Navigasi Mobile Admin (Missing Logout)
**Lokasi:** `app/admin/layout.tsx`
**Instruksi:**
- Saat ini, jika diakses melalui Mobile, Sidebar Admin disembunyikan (`hidden md:flex`), yang menyebabkan tombol Logout ikut hilang.
- Buat sebuah **Mobile Header** (Navbar atas) yang HANYA muncul di perangkat mobile (`flex md:hidden`).
- Di dalam Mobile Header tersebut, letakkan komponen `<UserButton />` dari Clerk atau tombol Logout kustom agar Admin tetap bisa keluar dari akun mereka melalui HP.
- Pastikan Mobile Header ini memiliki *styling* yang rapi (misal: logo di kiri, tombol *logout* di kanan, dengan background putih/gelap dan *shadow*).

## 4. Persiapan Arsitektur RBAC (Role-Based Access Control)
**Lokasi:** Refactoring konseptual pada file utilitas role / Prisma schema.
**Instruksi:**
- Mulai siapkan *logic gates* untuk membedakan 3 entitas: `member`, `admin` (karyawan/kasir), dan `superadmin` (Owner/Big Boss).
- Untuk saat ini, pastikan semua proteksi rute `/admin/(.*)` mengizinkan akses untuk `admin` DAN `superadmin`. (Detail fitur khusus Superadmin akan dikerjakan di fase berikutnya, cukup siapkan fondasi *role checker*-nya saja).

**ATURAN KETAT:**
TIDAK BOLEH merusak fungsi Onboarding untuk Member biasa. HANYA eksekusi perbaikan CSS dan penambahan komponen Mobile Header pada Layout Admin. Berikan perbaikan kodenya sekarang!