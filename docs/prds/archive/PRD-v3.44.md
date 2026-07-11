# PRD-v3.44.md
**Status:** Phase 3.44 - Custom Onboarding Flow (Bypass Clerk Phone Restrictions)
**TUGAS ANDA:** Membuat halaman *Onboarding* kustom untuk mencegat pengguna baru setelah Sign Up agar mereka melengkapi No. HP dan Alamat sebelum bisa masuk ke Dashboard.

---

## 1. Buat Halaman Onboarding (Form Profil)
**Instruksi:** Buat rute baru di `app/onboarding/page.tsx`.
- **Logika Server (Server Component):**
  - Cek apakah pengguna sudah memiliki data lengkap (No HP & Alamat) di *database* Prisma.
  - Jika `phoneNumber` dan `address` sudah terisi, langsung `redirect('/member/dashboard')`.
- **Desain UI Form:**
  - Jika belum lengkap, tampilkan formulir dengan desain elegan (mirip layar registrasi).
  - Judul: "Satu Langkah Lagi!"
  - Deskripsi: "Lengkapi data diri Anda sesuai formulir keanggotaan Purnama Gym."
  - Input 1: Nomor HP (WhatsApp).
  - Input 2: Alamat Lengkap (Textarea).
  - Tombol: "Simpan & Lanjutkan".

## 2. Server Action (Simpan ke Prisma)
**Instruksi:** Di dalam file `actions` (misalnya `app/actions/user.ts`), buat fungsi untuk menangani pengiriman form.
- Fungsi harus menerima data No HP dan Alamat, lalu melakukan `db.user.update` (atau model yang sesuai) berdasarkan `userId` dari Clerk.
- Setelah sukses disimpan, panggil `redirect('/member/dashboard')`.

## 3. Penyesuaian Global Layout / Middleware (Proteksi Akses)
**Instruksi:** - Pastikan di layout atau halaman Dasbor (`app/member/layout.tsx` atau `dashboard/page.tsx`), terdapat pengecekan: Jika `user` belum mengisi No HP di DB, paksa mereka kembali (redirect) ke `/onboarding`. Hal ini untuk mencegah *user* nakal yang mencoba mem- *bypass* form.

**ATURAN KETAT:**
Gunakan komponen klien (`"use client"`) hanya pada file form terpisah jika membutuhkan state manajemen, biarkan `app/onboarding/page.tsx` tetap menjadi komponen server. Berikan kode implementasi halaman *Onboarding* ini sekarang!