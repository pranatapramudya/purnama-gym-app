# PRD-v3.95.md
**Status:** Phase 3.95 - End-of-Day Audit, UX Scoring, & Auto-Documentation
**TUGAS ANDA:** Bertindak sebagai Lead QA dan Technical Writer. Anda harus mengevaluasi skor kemudahan pengguna (UX), merangkum seluruh hasil pekerjaan hari ini, dan secara otomatis memperbarui file dokumentasi proyek.

---

## 1. UX & Usability Testing Score
**Instruksi Eksekusi Analisis:**
- Lakukan evaluasi heuristik pada 4 alur aplikasi (Member, Admin Kasir, Personal Trainer, dan Super User).
- Berikan **Skor Persentase (0-100%)** yang merepresentasikan tingkat "User-Friendliness" atau kemudahan penggunaan aplikasi secara keseluruhan saat ini.
- Berikan analisis singkat mengapa Anda memberikan skor tersebut, dan sebutkan 1-2 area yang mungkin masih menjadi *bottleneck* (titik membingungkan) bagi pengguna awam.

## 2. Audit Hasil Pekerjaan (Daily Sprint Report)
**Instruksi Eksekusi Laporan:**
- Buat daftar (bullet points) ringkasan fitur dan perbaikan sistem yang **hanya diselesaikan pada sesi hari ini**. 
- Pastikan mencakup: Restorasi Grafik Regression, Auto-Sync UI, Sistem Short ID & Universal QR Code, Perbaikan Kamera iOS, Modul Karyawan Otomatis (Clerk OTP Bypass), RBAC Navigasi Khusus Trainer, Capacity Management (Kuota Maksimal PT), dan Segmentasi Metrik Dashboard.

## 3. Eksekusi Pembaruan Dokumentasi Teknis
**Lokasi:** `README.md` dan `architecture.md` (Buat `architecture.md` di *root* folder jika belum ada).
**Instruksi Eksekusi Penulisan (Wajib dilakukan!):**
- **Perbarui `README.md`:** 
  - Update status fase proyek.
  - Tambahkan daftar *Roles* pengguna yang kini menjadi 4 (Member, Admin, Super User, Trainer).
  - Berikan panduan singkat tentang pentingnya menjalankan `npx prisma generate` dan `npx prisma db push` untuk pembaruan skema hari ini.
- **Tulis/Perbarui `architecture.md`:** 
  - Dokumentasikan arsitektur keamanan: Integrasi Clerk Authentication & logika *bypass verification*.
  - Dokumentasikan sistem Multi-Tenant & RBAC (Role-Based Access Control).
  - Dokumentasikan sistem Universal QR Code (halaman validasi publik).
  - Dokumentasikan struktur database baru (penambahan `shortId` dan `maxCapacity`).

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda untuk fitur UI/UX! Namun, Anda WAJIB langsung mengaplikasikan (menulis/overwrite) teks pembaruan ke dalam file `README.md` dan `architecture.md` di dalam *environment* proyek. Sajikan laporan persentase UX dan Sprint Report dalam balasan *chat* Anda.