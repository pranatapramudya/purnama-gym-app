# PRD-v3.93.md
**Status:** Phase 3.93 - Microcopy Update: Internal Portal Login
**TUGAS ANDA:** Memperbarui teks (microcopy) pada halaman login portal internal agar mencerminkan penambahan role baru (Personal Trainer) secara akurat.

---

## 1. Pembaruan Teks Sub-heading & Deskripsi
**Lokasi:** Halaman Layout/Wrapper Login Internal (kemungkinan di `app/admin/login/page.tsx`, `app/(auth)/sign-in/page.tsx`, atau komponen UI yang membungkus form Clerk Sign-In).
**Instruksi Eksekusi UI:**
- Cari elemen teks yang saat ini bertuliskan **"Portal Internal (Admin & Owner)"** (teks berwarna hijau).
- Ubah teks tersebut menjadi: **"Portal Internal (Super User, Admin, Personal Trainer)"**.
- Cari elemen deskripsi di bawahnya yang saat ini bertuliskan: *"Sistem internal aman untuk staf operasional dan manajemen tingkat atas Purnama Gym."*
- Ubah teks deskripsi tersebut menjadi: **"Sistem internal terintegrasi khusus untuk Super User, Admin Kasir, dan Personal Trainer Purnama Gym."**

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Lakukan perubahan *string text* ini secara langsung pada komponen UI yang bersangkutan. Pastikan *styling* (seperti warna hijau pada sub-heading) tetap dipertahankan, hanya ubah isi teksnya saja.