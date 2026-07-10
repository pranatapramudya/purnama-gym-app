# PRD-v3.46.md
**Status:** Phase 3.46 - Sync Database Robustness (Upsert) & Name Injection
**TUGAS ANDA:** Memperbaiki sistem sinkronisasi pengguna di `app/member/layout.tsx` agar kebal terhadap error `Unique constraint failed` dan memastikan Nama Lengkap dari Clerk tersimpan dengan benar ke database. Berhenti memberikan klaim berlebihan sebelum kode benar-benar berfungsi!

---

## 1. Analisis Bug Kritis
**Masalah 1:** Error `PrismaClientKnownRequestError: Unique constraint failed on the fields: ('email')`. Terjadi karena alur saat ini menggunakan `prisma.user.create()` secara buta. Jika pengguna menghapus akun Clerk dan mendaftar ulang, email yang sama akan memicu tabrakan (*collision*) di database lokal.
**Masalah 2:** Nama pengguna di QR Code gagal tampil karena atribut First Name dan Last Name dari Clerk tidak pernah disinkronisasikan ke kolom `name` di tabel User Prisma saat pembuatan akun.

## 2. Instruksi Refactoring (app/member/layout.tsx)
**Tugas:** Buka file `app/member/layout.tsx`. Rombak total logika pengecekan dan pembuatan *user* di baris 17-22 (sesuai *screenshot* error).

- **Gunakan Logika UPSERT berdasarkan Email:**
  Jangan mengecek eksistensi hanya dari `clerkUserId`. Gunakan metode `upsert` pada Prisma berdasarkan `email` untuk secara otomatis melakukan Update (jika email sudah ada) atau Create (jika email belum ada).

- **Injeksi Nama Pengguna:**
  Ambil `firstName` dan `lastName` dari object `clerkUser`, gabungkan, dan simpan ke dalam atribut `name` di Prisma.

**CONTOH IMPLEMENTASI WAJIB:**
```tsx
  // Ambil email dari Clerk
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress || `no-email-${clerkUser.id}`;
  
  // Susun nama lengkap yang rapi
  const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Member Purnama';

  // Lakukan Upsert agar kebal error sinkronisasi
  await prisma.user.upsert({
    where: { 
      email: userEmail 
    },
    update: {
      clerkUserId: clerkUser.id, // Update ID jika user mendaftar ulang
      name: fullName
    },
    create: {
      clerkUserId: clerkUser.id,
      email: userEmail,
      name: fullName
    }
  });
  ATURAN KETAT:
Ganti logika prisma.user.create yang lama dengan logika upsert di atas. Setelah ini selesai, pastikan komponen QR Code (di halaman QR) menarik data name tersebut langsung dari Prisma. Berikan kode perbaikan yang valid tanpa perlu banyak narasi!