# PRD-v3.31.md
**Status:** Phase 3.31 - Vercel 404 Root Routing & Middleware Fix
**TUGAS ANDA:** Memperbaiki halaman utama (Root `/`) yang mengembalikan error 404 di Vercel, serta memastikan Clerk Middleware menangani rute awal dengan benar.

---

## 1. Analisis Bug: Vercel 404 NOT_FOUND pada Root URL
**Masalah:** Deployment berhasil, namun ketika pengguna mengunjungi URL utama/root domain, Vercel mengembalikan `404 NOT_FOUND`. Hal ini mengindikasikan ketiadaan file `app/page.tsx` atau kesalahan *redirect* dari Middleware.

## 2. Instruksi Perbaikan (Wajib Diikuti!)

**A. Buat/Perbaiki Root Landing Page (`app/page.tsx`)**
- Periksa folder `app/`. Pastikan ada file `page.tsx` di *root* folder tersebut.
- Jika tidak ada, BUAT file tersebut.
- Karena aplikasi ini adalah sistem *internal/member*, halaman *root* cukup difungsikan sebagai jembatan *redirect*.
- **Gunakan logika Server Component ini:**
  ```tsx
  import { redirect } from "next/navigation";
  import { auth } from "@clerk/nextjs/server";

  export default function RootPage() {
    const { userId } = auth();
    
    // Jika user sudah login, arahkan ke member dashboard (atau logika cek admin nanti)
    if (userId) {
      redirect("/member/dashboard");
    }
    
    // Jika belum login, paksa ke halaman Sign In
    redirect("/sign-in");
  }

  B. Verifikasi Clerk Middleware (middleware.ts)

Buka file middleware.ts di root proyek Anda.

Pastikan konfigurasi clerkMiddleware (atau authMiddleware jika memakai versi lama) mengizinkan public routes yang benar, terutama untuk Webhook.

Struktur standar Next.js 15+ Clerk Middleware harus seperti ini:

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Tentukan rute publik (Webhook dan Halaman Sign In/Up)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhooks/clerk(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect(); // Kunci semua rute selain rute publik di atas
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

ATURAN EKSEKUSI:
Berikan kode untuk kedua file di atas (app/page.tsx dan middleware.ts). Pastikan tidak ada typo karena ini adalah konfigurasi krusial yang menentukan Routing di Vercel!