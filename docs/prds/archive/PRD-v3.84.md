# PRD-v3.84.md
**Status:** Phase 3.84 - Minimalist Sync UI, Short ID QR, & iOS Scanner Fix
**TUGAS ANDA:** Merombak UI Auto-Sync menjadi label minimalis dengan pulsing dot, mengimplementasikan sistem "Short ID" untuk QR Code member, merancang UI hasil scan yang informatif, serta memperbaiki kompatibilitas kamera scanner untuk perangkat Mobile/iOS.

---

## 1. UI Refinement: Minimalist "Live" Badge (Auto-Sync)
**Lokasi:** Header Dashboard Admin.
**Instruksi Eksekusi UI:**
- Hapus angka hitung mundur (countdown text).
- Ubah komponen menjadi sebuah *Badge/Label* statis yang elegan (misal berlatar abu-abu transparan) dengan teks "Auto-Sync" atau "Live".
- Tambahkan efek animasi **Pulsing Dot** (titik kecil berwarna hijau yang berkedip/berdenyut menggunakan animasi CSS `animate-ping` dari Tailwind) di sebelah teks tersebut.
- Logika timer 30 detik untuk *refresh* halaman tetap berjalan secara *invisible* (di latar belakang).

## 2. Implementasi Short ID & UI Hasil Scan QR
**Lokasi:** Fitur Manajemen Member & Scanner QR.
**Instruksi Eksekusi Database & UI:**
- **Pembuatan Short ID:** Saat registrasi member baru, buatkan `memberCode` atau `shortId` yang mudah dibaca manusia (Contoh format: `PRN-1001` atau 6 digit alfanumerik acak `A7B2X9`). Simpan di kolom database yang sesuai.
- **Generate QR:** Pastikan gambar QR Code yang di-generate (di halaman profil member) menggunakan `shortId` ini, BUKAN lagi menggunakan CUID/UUID yang panjang.
- **UI Hasil Scan:** Ketika kamera berhasil memindai QR, jangan hanya menampilkan teks mentah. Munculkan sebuah **Card Pop-up** (atau Toast informatif) yang menampilkan:
  1. `Nama Lengkap`
  2. `Short ID` (Tampil besar dan jelas)
  3. `Status Membership` (Badge warna: Hijau untuk VIP/Bulan, Kuning untuk Regular/Harian, Abu-abu untuk Non-Member).

## 3. Bugfix: Kompatibilitas Kamera Mobile (iOS/Safari)
**Lokasi:** Komponen UI Scanner QR (menggunakan `html5-qrcode`, `react-qr-reader`, atau library serupa).
**Instruksi Eksekusi Logika Browser:**
- Modifikasi konfigurasi library scanner agar secara eksplisit meminta akses ke kamera belakang perangkat genggam.
- Gunakan properti `facingMode: { exact: "environment" }` atau konfigurasi ekuivalen pada library yang Anda gunakan.
- Tambahkan *error handling* UI jika izin (permission) kamera ditolak oleh *browser* (menampilkan pesan: "Harap izinkan akses kamera pada browser Anda").
- *(Catatan untuk developer: Pengujian di perangkat iOS wajib menggunakan protokol HTTPS atau localhost).*

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Kerjakan perubahan visual Tailwind, modifikasi schema/generator ID, dan konfigurasi API kamera langsung di dalam lingkungan proyek Anda.