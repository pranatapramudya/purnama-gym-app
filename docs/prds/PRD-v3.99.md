# PRD-v3.99.md
**Status:** Phase 3.99 - Hard Force PWA Fullscreen (iOS & Android Meta Tags)
**TUGAS ANDA:** Memperbarui konfigurasi Metadata dan Viewport pada Root Layout Next.js untuk memaksa browser seluler (terutama iOS Safari) merender aplikasi dalam mode fullscreen sejati tanpa UI browser.

---

## 1. Pembaruan Next.js Metadata & Viewport
**Lokasi:** `app/layout.tsx`
**Instruksi Eksekusi Logika:**
- Jika menggunakan Next.js App Router (versi 14+), pastikan Anda mengekspor objek `viewport` dan `metadata` secara terpisah.
- **Dalam konfigurasi `viewport`:** Tambahkan aturan ketat untuk mencegah scaling browser yang memicu UI muncul. Atur `width: 'device-width'`, `initialScale: 1`, `maximumScale: 1`, dan `userScalable: false`.
- **Dalam konfigurasi `metadata`:** 
  1. Pastikan file manifest di-link secara eksplisit: `manifest: '/manifest.json'` (sesuaikan dengan nama file manifest Anda).
  2. Tambahkan injeksi paksa untuk ekosistem Apple: 
     `appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Purnama Gym' }`
- Langkah ini krusial karena iOS Safari sering mengabaikan `manifest.json` jika tag `apple-mobile-web-app-capable` (`capable: true`) tidak diinjeksi langsung ke tag `<head>` HTML.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan injeksi objek `appleWebApp` dan konfigurasi `viewport` ini secara langsung pada `app/layout.tsx`. Konfirmasi jika injeksi telah selesai.