# PRD-v3.49.md
**Status:** Phase 3.49 - Server Component Event Handler Fix (Remove onClick)
**TUGAS ANDA:** Memperbaiki error `Event handlers cannot be passed to Client Component props` pada halaman Dashboard dengan menghapus fungsi `onClick` di dalam Server Component.

---

## 1. Analisis Bug: Server vs Client
**Masalah:** Anda mencoba memasukkan *event handler* (`onClick`) ke dalam elemen navigasi (seperti `<Link>`) di dalam Server Component (`app/member/(dashboard)/page.tsx`) untuk menonaktifkan klik jika status VIP aktif. Server Component tidak dapat mengirimkan *function props* ke klien.
**Solusi:** Gunakan manipulasi DOM kondisional atau CSS murni tanpa *event handler*.

## 2. Instruksi Perbaikan (app/member/(dashboard)/page.tsx)
**Tugas:** Buka file Beranda/Dashboard.
- Cari elemen tombol "VIP Membership" atau "Perpanjang Membership" (kemungkinan dibungkus `<Link>`).
- **HAPUS** semua atribut `onClick` pada elemen tersebut.
- **Terapkan Kondisi Rendering Tanpa Fungsi:**
  - Jika `isVipActive` adalah `true` (VIP sedang aktif):
    Render tombol sebagai `<div>` atau `<button disabled>` (bukan `<Link>`).
    Beri class: `bg-gray-300 text-gray-500 cursor-not-allowed opacity-70`.
  - Jika `isVipActive` adalah `false`:
    Render tombol sebagai `<Link href="...">` normal seperti biasa dengan warna asli.

**Contoh Struktur yang Benar (Tanpa onClick):**
```tsx
{isVipActive ? (
  <div className="bg-gray-300 text-gray-500 cursor-not-allowed opacity-70 p-4 rounded-xl text-center">
    VIP Aktif (1 Bulan)
  </div>
) : (
  <Link href="/member/vip-checkout" className="bg-slate-900 text-white p-4 rounded-xl text-center hover:bg-black">
    VIP Membership
  </Link>
)}

ATURAN KETAT:
Jangan menambahkan "use client" di bagian atas file jika halaman ini mengeksekusi panggilan langsung ke Prisma. Cukup hapus logika onClick dan gunakan conditional rendering murni seperti contoh di atas. Eksekusi perbaikannya sekarang!