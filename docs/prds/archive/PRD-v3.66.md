# 📋 PRD: Purnama Gym - V3.66 (Hydration Fix & Onboarding Stabilization)

## 1. Ringkasan Eksekutif
Dokumen ini ditujukan untuk AI Agent (Coding Assistant) guna melakukan perbaikan bug kritis pada aplikasi **Purnama Gym** yang terjadi pada halaman registrasi anggota. Fokus utama adalah menyelesaikan *React Hydration Error* pada Root Layout, sekaligus memvalidasi ulang alur *Custom Onboarding Flow* agar sinkronisasi data pengguna (Clerk ↔ PostgreSQL) berjalan tanpa cacat.

## 2. Tech Stack & Arsitektur Acuan (Tidak Diubah)
Berdasarkan `ARCHITECTURE.md` dan `README.md`, arsitektur saat ini adalah:
- **Framework:** Next.js 15+ (App Router, React Server Components)
- **Auth:** Clerk (Social Login, Webhooks)
- **Database:** Neon DB (Serverless PostgreSQL) + Prisma ORM
- **Styling:** Tailwind CSS
- **Layout:** Pemisahan total antara Layout Member (Mobile-first, Bottom Nav) dan Admin (Desktop-first, Sidebar SaaS).

## 3. Laporan Bug Saat Ini (Penting untuk Diperbaiki)

**Bug Utama (Hydration Mismatch):**
- **Lokasi:** `app/layout.tsx` (Root Layout), baris ~50 (pada tag `<body>`).
- **Gejala:** Konsol developer menampilkan error: *"A tree hydrated but some attributes of the rendered HTML didn't match the client properties... bis_register=..."*
- **Penyebab:** Browser extension/plugin keamanan pengguna (seperti BIS Register) secara otomatis menyisipkan atribut `bis_register` ke dalam DOM `<body>` setelah HTML dikirim oleh server. React membandingkan HTML Server (tanpa atribut) dengan DOM Client (dengan atribut), dan menyebabkan crash/mismatch.

**Bug Sekunder (Registrasi Akun):**
- **Lokasi:** Alur Onboarding (`/member/onboarding`).
- **Gejala:** Terjadi error tak terduga saat pengguna baru selesai login melalui Clerk dan diarahkan ke halaman pengisian profil.
- **Penyebab Dugaan:** Mungkin terjadi konflik pada logika `upsert` yang dijalankan di Layout, atau ada race condition antara Webhook Clerk dan Layout State.

## 4. Solusi & Instruksi Implementasi (Untuk AI Agent)

### A. Root Layout Fix (Mengatasi Hydration Error)
Kita tidak bisa mengontrol ekstensi browser pengguna, tapi kita bisa memberi tahu React untuk mengabaikan perbedaan atribut yang tidak penting dari ekstensi tersebut.
- **Tindakan:** Buka file `app/layout.tsx`.
- **Implementasi:** Tambahkan prop `suppressHydrationWarning={true}` pada tag `<html>` dan `<body>` di Root Layout.

**Contoh Perubahan Kode:**
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="..." suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

B. Memperkuat Robust Data Sync (Upsert Logic)
Cek logika prisma.user.upsert yang ada di dalam komponen app/member/layout.tsx atau di halaman onboarding.

Tindakan: Pastikan email digunakan sebagai unique identifier utama dalam kondisi where.

Validasi: Pastikan data phoneNumber dan address berhasil tertulis ke database saat pengguna menyelesaikan form Onboarding, tidak hanya mengandalkan Webhook Clerk.

C. Pembersihan & Optimasi Middleware
Tindakan: Pastikan Global Redirect Interception di middleware.ts sudah tepat. Pengguna baru harus dipaksa masuk ke /member/onboarding jika phoneNumber kosong, dan mencegah redirect loop ke /member/dashboard jika data belum lengkap.

5. Panduan Testing (Untuk Dicek Setelah Fix)
Setelah AI Agent melakukan commit perubahan:

Tes Hydration: Buka halaman registrasi/onboarding di browser yang memiliki ekstensi BIS Register. Pastikan tidak ada lagi error merah di konsol (DevTools).

Tes Onboarding: Daftar dengan akun Google/Email baru. Pastikan sistem mengarahkan ke /member/onboarding. Isi Nomor HP dan Alamat. Klik Simpan.

Tes Data: Login ke Neon DB (via Prisma Studio), cek tabel User. Pastikan phoneNumber dan address tersimpan sesuai, dan role otomatis terisi MEMBER_REGULAR.

Tes Anti-Looping: Jika pengguna sudah terdaftar, pastikan mereka langsung diarahkan ke /member/dashboard tanpa stuck di onboarding.