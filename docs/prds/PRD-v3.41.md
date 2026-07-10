# PRD-v3.41.md
**Status:** Phase 3.41 - Global Performance Optimization & UX Snappiness
**TUGAS ANDA:** Memperbaiki masalah *delay/lag* saat berpindah halaman dengan menerapkan Client-Side Navigation yang benar dan menambahkan antarmuka Loading (Skeleton UI) agar aplikasi terasa instan.

---

## 1. Pemberantasan "Full Page Reload" (Gunakan Next/Link)
**Instruksi:** Pindai seluruh file komponen Navigasi Anda (terutama Sidebar Admin, Header Member, dan Landing Page).
- Cari semua penggunaan tag HTML `<a href="...">`.
- **GANTI SEMUA** dengan komponen `<Link href="...">` dari `next/link`.
- Pastikan import-nya benar: `import Link from 'next/link';`
- *Catatan:* Penggunaan `<Link>` akan mengaktifkan *prefetching* otomatis dari Next.js sehingga saat tombol ditekan, perpindahan halaman akan terasa instan tanpa me- *refresh* browser.

## 2. Implementasi Streaming & Instant Loading UI (loading.tsx)
**Instruksi:** Next.js menahan transisi UI jika komponen Server sedang mengambil data. Untuk mencegah kesan "aplikasi *freeze/lag*", kita WAJIB memberikan respon visual instan.
- Buat file baru: `app/admin/loading.tsx` (dan buat juga untuk `app/member/loading.tsx` jika belum ada).
- **Gunakan kode Skeleton UI yang ringan dan elegan ini:**
  ```tsx
  export default function AdminLoading() {
    return (
      <div className="w-full h-full p-6 flex flex-col gap-4 animate-pulse">
        {/* Skeleton Header */}
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        
        {/* Skeleton Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Skeleton Table/Content */}
        <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
      </div>
    );
  }

  ATURAN KETAT:
Ini adalah proyek Enterprise, performa adalah segalanya. Pastikan tidak ada lagi tag <a> untuk navigasi internal, dan berikan bukti bahwa file loading.tsx telah ditambahkan di level layout utama!