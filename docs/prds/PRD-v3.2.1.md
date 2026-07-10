# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.2.1 (Hotfix)  
**Status:** Phase 3.2.1 - Resolving Prisma Unique Constraint Race Condition

---

## 1. Penyelesaian Bug Kritis: Unique Constraint Failed pada clerkUserId

**A. Analisis Masalah:**
- Muncul error `PrismaClientKnownRequestError: Unique constraint failed on the fields: ("clerkUserId")` di file `app/member/dashboard/page.tsx`.
- Hal ini terjadi karena adanya *Race Condition* yang dipicu oleh React Strict Mode di lingkungan Next.js 15+ (App Router). Fungsi pengecekan manual (`findUnique` dilanjut `create`) dieksekusi dua kali secara paralel sebelum proses penyimpanan pertama selesai, sehingga memicu pelanggaran nilai unik pada database.

**B. Solusi Wajib: Refaktor Logika Sync menggunakan Prisma Upsert**
Tugas Agen AI: Ganti logika sinkronisasi manual di `app/member/dashboard/page.tsx` menjadi operasi database yang bersifat atomic.

*Instruksi Logika untuk Agen:*
1. Buka file `app/member/dashboard/page.tsx`.
2. Hapus blok logika percabangan `if (!dbUser) { await prisma.user.create(...) }`.
3. Ganti proses pengambilan data pengguna menggunakan metode `prisma.user.upsert()`.
4. **Parameter Upsert:**
   - `where`: Cari pengguna berdasarkan `clerkUserId` yang didapat dari sesi Clerk saat ini.
   - `update`: Biarkan objek ini kosong `{}`. Jika pengguna sudah ada, kita tidak perlu memperbarui apa-apa saat mereka masuk ke *dashboard*.
   - `create`: Isi dengan pemetaan data untuk pendaftaran pengguna baru (petakan `clerkUserId` dengan ID Clerk, `email` dengan email primer dari Clerk jika ada di schema, `name` dengan gabungan nama depan dan belakang Clerk, serta berikan nilai *default* `role: "MEMBER"`).
5. Pastikan seluruh fungsi ini tetap berada di dalam *Server Component* dan di-*await* dengan benar sebelum me-render UI Dashboard.