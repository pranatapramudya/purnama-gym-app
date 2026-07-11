# PRD-v3.96.md
**Status:** Phase 3.96 - Final Pre-Deployment Polish & PRD Archiving
**TUGAS ANDA:** Memperbaiki ambiguitas UI pada form input, menambahkan validasi format email yang ketat (untuk mencegah typo), dan merapikan ruang kerja dengan mengarsipkan seluruh file PRD yang telah selesai.

---

## 1. UI Polish: Form Placeholder Ambiguity
**Lokasi:** Komponen UI "Tambah Karyawan Baru" (Modal/Form Karyawan).
**Instruksi Eksekusi UI:**
- Ubah warna *placeholder* teks ("Budi Santoso" dan "budi@purnamagym.com") agar kontrasnya jauh lebih rendah (lebih pudar) dibandingkan teks yang diketik pengguna.
- Gunakan class Tailwind seperti `placeholder:text-gray-400` atau `placeholder:text-slate-300`.
- Pastikan teks ketikan *user* berwarna solid gelap (misal `text-gray-900`) agar pengguna langsung tahu bahwa *field* tersebut masih kosong sebelum mereka mengetik.

## 2. Validasi Anti-Typo Email
**Lokasi:** Form "Tambah Karyawan Baru" (dan form Pendaftaran Member jika memungkinkan).
**Instruksi Eksekusi Logika:**
- Tambahkan validasi *Regex* (Regular Expression) pada input Email.
- Pastikan string yang diinput mematuhi standar format email (mengandung karakter `@`, memiliki domain, dan diakhiri dengan ekstensi seperti `.com`, `.co.id`, dll).
- Jika *user* mengetik email yang salah format (misal: `budigmail.com`), disable tombol "Buat Akun Karyawan" dan tampilkan pesan *error* di bawah input: *"Format email tidak valid."*

## 3. Project Cleanup: PRD Archiving
**Lokasi:** Struktur direktori proyek (`docs/prds/`).
**Instruksi Eksekusi File Management:**
- Buat folder baru bernama `archive` di dalam direktori `docs/prds/` (atau direktori tempat Anda menyimpan file PRD).
- Pindahkan SEMUA file `.md` PRD lama (dari fase 1 hingga fase 3.95) ke dalam folder `archive` tersebut.
- Sisakan hanya PRD terbaru atau biarkan folder utama kosong (clean state) untuk persiapan *sprint* hari esok.

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Terapkan perbaikan Tailwind dan validasi Regex ini secara langsung. Setelah memindahkan file ke folder arsip, berikan konfirmasi singkat bahwa proyek sudah rapi dan siap di-*push* ke Git / Vercel.