# PRD-v3.64.md
**Status:** Phase 3.64 - Master Schedule CRUD & Frontend Availability Logic
**TUGAS ANDA:** Mengimplementasikan fitur CRUD untuk Master Jadwal PT di Portal Admin, dan menyiapkan logika *endpoint/fetching* untuk Frontend agar slot yang sudah dibooking menjadi non-aktif (greyed out).

---

## 1. Modifikasi UI Admin: CRUD Master Jadwal
**Lokasi:** `app/admin/personal-trainer/page.tsx`
**Instruksi:**
- Jangan hilangkan 4 *section* monitoring (Sesi Aktif, Booking Baru, dll) yang sudah ada.
- Tambahkan sebuah tombol utama (misal: "Kelola Master Jadwal" atau "Atur Slot") di bagian atas halaman (Header).
- Tombol ini HANYA boleh dilihat oleh `role === 'superadmin'`.
- Jika ditekan, buka Modal atau Halaman khusus yang memiliki fitur **CRUD (Create, Read, Update, Delete)** untuk model ketersediaan jadwal/slot PT (menggunakan model `PTSetting` atau model baru `PTScheduleSlot` sesuai arsitektur database terakhir Anda).
- Admin harus bisa menambahkan slot waktu spesifik (misalnya: "09:00 - 10:00") untuk hari-hari tertentu.

## 2. Arsitektur API untuk Frontend (Logika "Grey Out")
**Lokasi:** Buat Server Action khusus (misal: `getAvailablePTSlots(date)`) di `app/actions/pt.ts` atau endpoint API.
**Instruksi Logika Integrasi:**
- Fungsi ini akan dipanggil oleh aplikasi Frontend Member.
- **Langkah 1 (Read Master):** Ambil semua daftar jam/slot Master yang tersedia untuk hari tersebut berdasarkan `date` yang diinput.
- **Langkah 2 (Cek Transaksi):** Lakukan query ke tabel `PTSession` pada rentang tanggal tersebut yang statusnya `PENDING`, `CONFIRMED`, atau `ONGOING`.
- **Langkah 3 (Kalkulasi Bentrok):** Cocokkan Master Slot dengan data Transaksi. Jika suatu jam/slot sudah ada di dalam `PTSession`, tambahkan properti `isBooked: true` pada response JSON-nya.
- *(Catatan untuk Frontend Developer nantinya: Slot dengan `isBooked: true` wajib dirender dengan gaya CSS `disabled` / abu-abu).*

**ATURAN KETAT:**
DILARANG memberikan blok kode mentah dalam balasan Anda! Kerjakan langsung penambahan fitur CRUD Master Jadwal ini pada Client Component, dan buatkan Server Action-nya dengan solid.