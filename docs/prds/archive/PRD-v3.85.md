# PRD-v3.85.md
**Status:** Phase 3.85 - Hotfix: QR Code Payload Synchronization
**TUGAS ANDA:** Memperbaiki ketidaksesuaian antara teks Short ID yang tampil di layar dengan data payload aktual yang tersimpan (di-encode) di dalam gambar QR Code.

---

## 1. Perbaikan Payload / Value QR Code
**Lokasi:** Halaman UI QR Masuk (Member/Mobile view, kemungkinan di `app/(member)/qr/page.tsx` atau komponen serupa yang me-render UI pada gambar referensi).
**Instruksi Eksekusi UI & Logika:**
- Cari tag komponen yang bertugas men-generate gambar QR (misalnya `<QRCode />`, `<QRCodeSVG />`, atau library sejenis).
- Periksa properti `value` (atau properti data) pada komponen tersebut. Saat ini kemungkinan besar masih menggunakan variabel lama: `value={user.id}`.
- **Ubah Nilainya Secara Mutlak:** Sesuai dengan PRD-v3.86 sebelumnya, ubah `value` tersebut menjadi format URL Universal. 
  Gunakan logika ini: `value={`${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/verify/${user.shortId || user.id}`}`
- *(Catatan: URL Base di atas berfungsi agar ketika di-scan oleh kamera HP biasa, QR akan langsung mengarahkan pengguna ke halaman web verifikasi publik, BUKAN hanya menampilkan teks).*

## 2. Pengecekan Keamanan Rendering
**Instruksi Eksekusi:**
- Pastikan logika rendering aman. Jika karena suatu hal data `user` belum selesai di-fetch atau `shortId` tidak ada, JANGAN me-render QR Code dengan nilai `undefined` atau URL yang terpotong. 
- Tampilkan *skeleton loading* atau pesan *"Memuat QR..."* sampai data ID benar-benar siap dimasukkan ke dalam properti `value` QR Code.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Fokus perbaiki properti `value` di dalam komponen pembuat QR secara langsung agar data yang tersembunyi di dalam QR 100% sama dengan teks "ID: PG-..." yang tampil di layar UI.