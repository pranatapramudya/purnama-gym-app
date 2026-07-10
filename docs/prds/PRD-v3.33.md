# PRD-v3.33-Fixed.md
**Status:** Phase 3.33 - Landing Page Restoration, Mobile Auth UI, & Routing Fix
**TUGAS:** Perbaiki masalah Routing (404/Nyasar), responsivitas Mobile, dan kembalikan Landing Page.

---

## BAGIAN 1: TUGAS UNTUK AGEN AI (EKSEKUSI KODE)

**A. PEMULIHAN LANDING PAGE (app/page.tsx)**
- **HAPUS** semua logika `redirect('/sign-in')` atau `redirect('/member/dashboard')` dari file `app/page.tsx`.
- Render kembali komponen *Landing Page* asli ("Ruang Kebugaran Eksklusif di Sumedang") yang menggunakan *branding* warna pink.
- Pastikan tombol "Masuk / Daftar Sekarang" mengarah ke `<Link href="/sign-in">`.

**B. PERBAIKAN RESPONSIVITAS MOBILE (app/sign-in/[[...sign-in]]/page.tsx & sign-up)**
- Rombak *class* pembungkus utama agar tidak terpotong di Mobile.
- **Gunakan arsitektur Flexbox ini:**
  ```tsx
  <div className="flex flex-col lg:flex-row min-h-screen w-full">
    {/* Sisi Kiri: Branding */}
    <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:p-16 bg-gradient-to-br from-emerald-500 to-teal-900 text-white">
      <h1 className="text-3xl lg:text-5xl font-extrabold mb-4">PURNAMA GYM</h1>
      <p className="text-lg lg:text-xl font-semibold mb-2">Fasilitas Gym Khusus Wanita Terbaik di Sumedang.</p>
      <p className="text-sm lg:text-base opacity-90">Bergabunglah sekarang dan mulai perjalanan sehatmu dengan privasi dan kenyamanan penuh.</p>
    </div>
    {/* Sisi Kanan: Clerk Auth */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
      <SignIn /> {/* Atau <SignUp /> */}
    </div>
  </div>

  C. FIX ROUTING MIDDLEWARE (middleware.ts)

Jika pengguna belum login dan mencoba mengakses rute protected (seperti /admin/dashboard), pastikan sistem melempar mereka ke /sign-in lokal, BUKAN ke portal default Clerk yang polos.