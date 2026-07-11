# PRD-v3.98.md
**Status:** Phase 3.98 - PWA Manifest Optimization (Standalone UI)
**TUGAS ANDA:** Memperbarui konfigurasi Progressive Web App (PWA) agar aplikasi berjalan dalam mode layar penuh (tanpa bilah alamat browser) saat diinstal di perangkat seluler pengguna.

---

## 1. Pembaruan File Manifest PWA
**Lokasi:** File `manifest.json`, `manifest.webmanifest`, atau konfigurasi PWA di `next.config.js` / file metadata Next.js Anda (biasanya terletak di direktori `public` atau `app`).
**Instruksi Eksekusi Konfigurasi:**
- Temukan properti `display` di dalam konfigurasi manifest Anda.
- Saat ini kemungkinan diatur ke `browser` atau `minimal-ui`.
- **Ubah properti tersebut menjadi mutlak:** `"display": "standalone"`
- *(Catatan: Mode `standalone` akan menghilangkan address bar dan tombol navigasi browser, memberikan pengalaman aplikasi native sejati seperti contoh KKF Label).*

## 2. Pengecekan Meta Tags Pendukung (iOS & Android)
**Lokasi:** `app/layout.tsx` atau file konfigurasi metadata utama.
**Instruksi Eksekusi Logika Meta:**
- Pastikan tag meta viewport dan kapabilitas web-app sudah disetel untuk mendukung mode fullscreen.
- Tambahkan atau verifikasi keberadaan properti berikut pada objek `metadata` atau tag `<meta>`:
  - `appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Purnama Gym' }`
  - `<meta name="mobile-web-app-capable" content="yes" />`

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan perubahan `display: "standalone"` ini secara langsung pada file manifest proyek. Berikan konfirmasi setelah konfigurasi selesai diperbarui.