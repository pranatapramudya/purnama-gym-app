# PRD-v3.83.md
**Status:** Phase 3.83 - UI/UX Overhaul: Modern Auto-Refresh Countdown Timer
**TUGAS ANDA:** Mengganti elemen *Toggle Switch* statis pada fitur Auto-Sync dengan komponen indikator visual *Countdown Timer* (waktu mundur) yang modern dan elegan ala SaaS premium.

---

## 1. Hapus UI Toggle Jadul
**Lokasi:** `app/admin/dashboard/page.tsx` (atau komponen Header Dashboard terkait).
**Instruksi Eksekusi UI:**
- Hapus elemen *Toggle/Switch* hijau bertuliskan "Auto-Sync (30s)".
- Hapus *state* on/off jika ada, karena kita asumsikan dashboard monitoring ini akan selalu *auto-refresh* secara otomatis ketika halaman terbuka.

## 2. Bangun Komponen "Modern Countdown Timer"
**Instruksi Eksekusi UI & Animasi:**
- Buat sebuah komponen visual baru di pojok kanan atas (menggantikan posisi toggle tadi).
- **Desain Opsi 1 (Pill Text):** Sebuah tombol/Pill dengan *background* abu-abu terang, di dalamnya terdapat teks yang reaktif: `Auto-update dalam 29s...`, angkanya menghitung mundur secara reaktif.
- **Desain Opsi 2 (Circular Progress - Opsional):** Ikon *refresh* kecil yang dikelilingi oleh SVG cincin *progress bar* yang berkurang setiap detik selama 30 detik.
- Tambahkan sebuah tombol *Manual Refresh* (ikon putar) di sebelahnya, sehingga pengguna tetap bisa melakukan penyegaran secara instan tanpa harus menunggu 30 detik.

## 3. Logika Timer (React Hooks)
**Instruksi Eksekusi Logika:**
- Gunakan kombinasi `useEffect` dan `useState` (atau custom hook `useInterval`) untuk mengelola hitung mundur dari 30 ke 0.
- Ketika angka mencapai `0`:
  1. Panggil fungsi penyegaran data (seperti `router.refresh()`, atau panggil ulang *fetch API*).
  2. Reset kembali angka timer ke `30`.
- Pastikan tidak ada *Memory Leak* (bersihkan interval pada *cleanup function* di dalam `useEffect` saat komponen di-*unmount*).

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan logika komponen Timer ini secara langsung pada Client Component. Pastikan angka hitung mundur berjalan *smooth* dan benar-benar melakukan pengambilan data (*refresh*) saat mencapai angka nol.