# PRD-v3.54.md
**Status:** Phase 3.54 - RBAC Foundation & Internal Portal UI Update
**TUGAS ANDA:** Memperbarui teks pada halaman login internal agar mencakup peran Owner, dan menerapkan fondasi Role-Based Access Control (RBAC) pada Dashboard utama untuk menyembunyikan data finansial dari staf Admin biasa.

---

## 1. Pembaruan Teks Portal Internal
**Lokasi:** `app/admin/sign-in/[[...sign-in]]/page.tsx`
**Instruksi:**
- Ubah teks judul dari `Portal Manajemen Admin` menjadi `Portal Internal (Admin & Owner)`.
- Ubah deskripsi di bawahnya menjadi: `Sistem internal aman untuk staf operasional dan manajemen tingkat atas Purnama Gym.`

## 2. Definisi Struktur Role (Kondisional UI)
**Instruksi Konseptual:** 
Sistem sekarang memiliki 3 tingkat hierarki (Member, Admin, Superadmin). 
- Ambil metadata `role` dari sesi Clerk (`sessionClaims`) di halaman Dashboard Internal.
- Jika pengguna belum memiliki role (default baru), tetapkan penanganan *fallback* ke `member` atau tendang kembali ke Landing Page, pastikan hanya `admin` dan `superadmin` yang bisa merender layout ini.

## 3. Pembatasan UI Dashboard Keuangan (Strict RBAC)
**Lokasi:** `app/admin/(dashboard)/page.tsx`
**Analisis:** Dasbor saat ini menampilkan grafik pendapatan dan total uang yang masuk. Data finansial ini sangat rahasia dan DILARANG keras dilihat oleh staf `admin` (Kasir/CS).
**Instruksi Eksekusi:**
- Terapkan *Conditional Rendering* berdasarkan pengecekan variabel `role`.
- **Widget Pendapatan & Grafik:** Bungkus komponen `<Card>` Pendapatan Hari Ini dan komponen Chart/Grafik Pendapatan dengan logika kondisi. **HANYA** tampilkan elemen-elemen tersebut jika `role === 'superadmin'`.
- **Tampilan untuk Admin Biasa:** Jika yang login adalah `admin`, pastikan bagian grafik pendapatan disembunyikan (atau diganti dengan pesan "Grafik Finansial hanya untuk Manajemen"), namun biarkan widget operasional seperti "Total Member", "Sesi PT", dan "Check-in" tetap terlihat normal.

**ATURAN KETAT:**
DILARANG memberikan blok kode dalam jawaban Anda. Tugas Anda hanya memperbarui file secara langsung di *environment* proyek. Jangan merusak tata letak CSS/Tailwind yang sudah rapi!