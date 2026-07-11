# PRD-v3.39.md
**Status:** Phase 3.39 - Next.js Sync Dynamic APIs Error Fix & Admin Auth UI
**TUGAS ANDA:** Memperbaiki error `headers()` berbasis Promise di Layout Admin, dan membuat desain Split-Screen khusus untuk halaman Login Admin.

---

## 1. FIX ERROR: Async Headers di Admin Layout
**Instruksi:** Buka file `app/admin/layout.tsx`.
- Ubah deklarasi komponen menjadi fungsi `async`.
- Tambahkan `await` sebelum memanggil `headers()`.
- **Ubah kodenya persis menjadi seperti ini:**
  ```tsx
  import { headers } from "next/headers";

  export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const headerList = await headers();
    const pathname = headerList.get("x-pathname") || "";

    // Bypass layout sidebar jika sedang berada di halaman login admin
    if (pathname.includes("/admin/sign-in")) {
      return <>{children}</>;
    }

    return (
      <div className="flex h-screen bg-gray-100">
        {/* Render Sidebar dan Konten Admin di sini */}
        {children}
      </div>
    );
  }

  2. BUAT UI SPLIT-SCREEN UNTUK ADMIN SIGN-IN
Instruksi: Buka atau buat file app/admin/sign-in/[[...sign-in]]/page.tsx.

Buat layout terbelah dua (flex-col lg:flex-row) persis seperti member, TETAPI gunakan skema warna gelap (Slate/Gray) untuk membedakannya sebagai "Ruang Karyawan/Admin".

Gunakan arsitektur berikut:

import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Sisi Kiri: Branding Admin */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:p-16 bg-slate-900 text-white">
        <h1 className="text-3xl lg:text-5xl font-extrabold mb-4">PURNAMA GYM</h1>
        <p className="text-lg lg:text-xl font-semibold mb-2 text-emerald-400">Portal Manajemen Admin</p>
        <p className="text-sm lg:text-base opacity-75">Sistem internal untuk mengelola member, paket VIP, dan jadwal Personal Trainer.</p>
      </div>

      {/* Sisi Kanan: Clerk Auth Khusus Admin */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <SignIn 
          routing="path" 
          path="/admin/sign-in" 
          forceRedirectUrl="/admin/dashboard" 
        />
      </div>
    </div>
  );
}

ATURAN KETAT:
Pastikan await headers() diterapkan dengan benar untuk menghilangkan error build. Berikan kode perbaikan untuk kedua file tersebut sekarang!