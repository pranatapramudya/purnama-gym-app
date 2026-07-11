# PRD-v3.59.md
**Status:** Phase 3.59 - Strict Cross-Role Route Protection (Traffic Controller)
**TUGAS ANDA:** Menerapkan pengalihan rute (redirect) mutlak pada Layout Member dan Root/Landing Page untuk mencegah persilangan akses antara staf (Admin/Superadmin) dan pelanggan (Member).

---

## 1. Proteksi Layout Member dari Admin/Superadmin
**Lokasi:** `app/member/layout.tsx`
**Instruksi:**
- Sama seperti di Admin, lakukan pemanggilan Prisma untuk mengecek `role` dari `clerkUserId`.
- **Logika Blocker:** Jika `user.role === 'admin'` ATAU `user.role === 'superadmin'`, JANGAN izinkan mereka merender halaman member. Langsung lakukan `redirect('/admin/dashboard')`.
- (Ini memastikan jika staf login dari jalur mana pun atau mengetik URL `/member` secara manual, mereka akan dipaksa kembali ke portal manajemen).

## 2. Smart Redirect pada Landing Page / Auth Callback
**Lokasi:** `app/page.tsx` (Landing Page) atau komponen yang menangani setelah *Sign-In* sukses.
**Instruksi:**
- Jika pengguna sudah terotentikasi (sudah *login*), cek `role` mereka melalui Prisma.
- Jika `role` adalah `admin` atau `superadmin`: Lakukan `redirect('/admin/dashboard')`.
- Jika `role` adalah `member` (atau null/default): Lakukan `redirect('/member/dashboard')` atau halaman Onboarding/QR E-Card.
- Ini menghilangkan kebingungan pengguna saat mereka membuka kembali URL root (`/`) ketika sesi login mereka masih aktif.

**ATURAN KETAT:**
DILARANG memberikan blok kode dalam balasan Anda! HANYA kerjakan modifikasi logika ini secara langsung di *environment* proyek. Pastikan pengalihan (redirect) tidak menyebabkan *Infinite Loop* (perulangan tanpa henti).