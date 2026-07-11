# PRD-v3.48.md
**Status:** Phase 3.48 - Dashboard Card Sync & VIP Anti-Looping Protection
**TUGAS ANDA:** Menyinkronkan desain kartu di halaman Beranda (Dashboard) dengan logika Black Card, serta menerapkan proteksi "Anti-Looping" pada tombol transaksi agar member yang sudah VIP tidak bisa membeli paket yang sama sebelum masa aktifnya habis (1 Bulan).

---

## 1. Sinkronisasi UI Kartu Dashboard (app/member/(dashboard)/page.tsx)
**Analisis:** Kartu keanggotaan di Beranda masih menggunakan gradasi merah/pink (statis).
**Instruksi:** 
- Tarik data `isVip` dan `vipExpiryDate` dari Prisma untuk *user* yang sedang login.
- Terapkan *Conditional Rendering* pada kartu utama:
  - **Jika VIP (Aktif):** Ubah background kartu menjadi `bg-gradient-to-r from-slate-900 to-black text-white`. Ubah tulisan "Regular Member" menjadi "VIP Member" (warna emas `text-amber-400`).
  - **Jika Non-VIP / Expired:** Ubah background menjadi abu-abu netral/putih `bg-gray-100 text-gray-800 border border-gray-300`. Ubah tulisan menjadi "Non-Member" atau "Regular".
- HAPUS SEMUA class Tailwind yang mengandung warna `red`, `pink`, atau `rose` dari kartu tersebut!

## 2. Proteksi Transaksi Anti-Looping (Disable Buttons)
**Analisis:** Mencegah pengguna melakukan transaksi pembelian VIP jika mereka masih memiliki status VIP yang aktif.
**Instruksi:**
- Pada tombol **"VIP Membership"** dan **"Perpanjang Membership"**, terapkan logika *disabled state*.
- **Logika:** `const isVipActive = isVip && new Date(vipExpiryDate) > new Date();`
- Jika `isVipActive` bernilai `true`:
  - Tambahkan atribut `disabled` pada tombol.
  - Ubah class Tailwind tombol menjadi: `bg-gray-300 text-gray-500 cursor-not-allowed opacity-70`.
  - Ubah teks tombol (opsional) menjadi: "VIP Aktif".
- Jika `false`, biarkan tombol normal dan bisa diklik untuk diarahkan ke halaman pembayaran.

## 3. Penegasan Timer 1 Bulan di Backend Transaksi
**Instruksi:** 
- Pastikan di fungsi Server Action / API Endpoint yang menangani "Checkout/Success" VIP, tanggal kadaluarsa (Expiration Date) diset ketat:
  `vipExpiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1))` (Tepat 1 bulan dari waktu transaksi sukses).
- Set `isVip: true`.

**ATURAN KETAT:**
Gunakan Bahasa Indonesia baku. HANYA ubah halaman Beranda (Dashboard) dan logika *disabled* pada tombol transaksi. Berikan perbaikan kodenya sekarang!