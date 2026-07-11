# PRD-v4.00.md
**Status:** Phase 4.00 - PWA Scope Fix (Kill the 'X' Button)
**TUGAS ANDA:** Memperbaiki konfigurasi `scope` pada PWA manifest dan memastikan routing Clerk Authentication tidak memicu *in-app browser* (Chrome Custom Tabs).

---

## 1. Kunci "Scope" PWA di Manifest
**Lokasi:** File `manifest.json` atau `manifest.webmanifest`.
**Instruksi Eksekusi:**
- Tambahkan properti `scope` dan `start_url` secara eksplisit agar OS tahu batas wilayah aplikasi.
- Tambahkan baris ini:
  `"start_url": "/",`
  `"scope": "/",`
- Pastikan `"display": "standalone"` tetap ada.

## 2. Clerk Routing Fix (Mencegah Redirect Keluar)
**Lokasi:** Komponen Login/Sign-In Clerk (misal `app/(auth)/sign-in/[[...sign-in]]/page.tsx` atau Middleware).
**Instruksi Eksekusi:**
- Jika form login Clerk memicu *redirect* ke URL eksternal (misal `accounts.clerk.com`), PWA akan menganggapnya sebagai *browser tab* biasa dan memunculkan tombol 'X'.
- Pastikan komponen `<SignIn />` milik Clerk dikonfigurasi untuk *routing* berbasis *path* lokal: `<SignIn routing="path" path="/sign-in" />`.
- Ini memastikan seluruh proses otentikasi terjadi *di dalam* domain Vercel Anda, sehingga PWA tetap dalam mode *fullscreen*.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah! Langsung tambahkan atribut `scope` di file manifest dan periksa cara Clerk melakukan *rendering* UI login.