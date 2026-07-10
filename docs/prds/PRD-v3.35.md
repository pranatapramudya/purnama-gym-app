# PRD-v3.35.md
**Status:** Phase 3.35 - Post-Authentication Redirect Fix
**TUGAS ANDA:** Memperbaiki bug di mana pengguna yang berhasil Sign In atau Sign Up dilempar kembali ke Landing Page (Root `/`) alih-alih masuk ke dalam aplikasi (Dashboard).

---

## 1. Analisis Bug: Redirection Fallback
**Masalah:** Komponen `<SignIn />` dan `<SignUp />` dari Clerk secara *default* akan mengarahkan pengguna kembali ke rute `/` setelah proses autentikasi selesai. Karena rute `/` sekarang adalah *Landing Page* publik, pengguna yang sudah *login* seolah-olah "terjebak" di luar aplikasi.

## 2. Instruksi Perbaikan Kode (Wajib Diikuti!)
Buka dua file ini dan tambahkan *props* pengalihan eksplisit pada komponen Clerk:

**A. File: `app/sign-in/[[...sign-in]]/page.tsx`**
- Cari komponen `<SignIn />`.
- Tambahkan *props* `forceRedirectUrl` (atau `fallbackRedirectUrl` tergantung versi Clerk) yang mengarah ke dasbor member.
- **Ubah menjadi:**
  `<SignIn forceRedirectUrl="/member/dashboard" />`

**B. File: `app/sign-up/[[...sign-up]]/page.tsx`**
- Cari komponen `<SignUp />`.
- Tambahkan *props* yang sama.
- **Ubah menjadi:**
  `<SignUp forceRedirectUrl="/member/dashboard" />`

**ATURAN EKSEKUSI:**
Hanya tambahkan *props* tersebut pada komponen Clerk. DILARANG merubah *layout split-screen* hijau yang sudah kita buat sebelumnya! Eksekusi sekarang!