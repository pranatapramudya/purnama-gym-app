# Product Requirement Document (PRD) - Purnama Gym Sumedang
**Versi:** 3.20  
**Status:** Phase 3.20 - Feature Pivot: Class Booking to PT Booking

---
## Objektif Utama
Berdasarkan aturan bisnis gym, kita akan MENGUBAH fitur "Booking Kelas" menjadi "Booking Personal Trainer (PT)". Aturan bisnis mewajibkan pengguna untuk melakukan *booking* PT terlebih dahulu dan tidak melayani *booking* di hari yang sama.

## Tugas Agen AI:
1. **Refaktor UI & Navigasi:** Cari seluruh file UI (Beranda, Sidebar Admin, Menu Navigasi) yang menggunakan kata "Kelas", "Jadwal Kelas", atau "Booking Kelas". Ganti secara menyeluruh menjadi "Personal Trainer", "Jadwal PT", atau "Booking PT".
2. **Penyesuaian Aturan Booking:** Pada logika *Server Action* untuk *booking* (`app/actions/member.ts`), pastikan ada validasi tanggal: pengguna tidak boleh memilih tanggal *booking* pada hari ini (*Today*). *Booking* minimal harus dilakukan untuk H+1.
3. Tetap pertahankan seluruh logika *Double-Booking* dan pengurangan kuota. Eksekusi perubahan teks dan logika tanggal ini sekarang!